import os 
import json
import re
import csv

from constants import TARGET_SAMPLING_PERIOD_IN_MS

antisaccades_data_path = 'src/short-antisacades-results/data'
def load_trials():
    trials = []
    for file_path in os.listdir(antisaccades_data_path):
        p = re.compile('short-antisaccades_(\d{1,3}).csv')
        run_id = p.match(file_path).group(1)
        with open(os.path.join(antisaccades_data_path, file_path), 'r') as f:
            csv_rows_iterator = csv.reader(f, delimiter=",", quotechar='"')
            headers = next(csv_rows_iterator, None)
    
            trial_id_idx = headers.index('trialId')
            inner_width_idx = headers.index('inner_width')
            wg_data_idx = headers.index('webgazer_data')
            exp_name_idx = headers.index('experimentName')
            center_x_idx = headers.index('center_x')
            center_y_idx = headers.index('center_y')
            cue_x_delta_idx = headers.index('cueXDistance')
            cue_shown_at_left_idx = headers.index('cueWasShownAtLeft')
            pre_trial_duration_idx = headers.index('intraTrialBlankDuration')
            fixation_duration_idx = headers.index('fixationDuration')
            mid_blank_duration_idx = headers.index('interTrialBlankDuration')
            cue_duration_idx = headers.index('cueDuration')
    
            run_trials = []
            inner_width = None
            i = 0
            for row in csv_rows_iterator:
                if row[inner_width_idx] != '"':
                    inner_width = json.loads(row[inner_width_idx])
                if row[exp_name_idx] == "antisaccade":
                    i += 1
                    if i < 10:
                        # skip 10 first trials which are training trials
                        continue
    
                    run_trials.append({
                        "trial_id": json.loads(row[trial_id_idx]),
                        "gaze_estimations": json.loads(row[wg_data_idx]),
                        "center_x": json.loads(row[center_x_idx]),
                        "center_y": json.loads(row[center_y_idx]),
                        # The following variable was incorrectly named when the
                        # experiment was set up
                        # Check line 47 of www/short-antisaccades.js
                        "cue_shown_at_left": not json.loads(row[cue_shown_at_left_idx]),
                        "cue_abs_x_delta": abs(json.loads(row[cue_x_delta_idx])),
                        "pre_duration": json.loads(row[pre_trial_duration_idx]),
                        "fixation_duration": json.loads(row[fixation_duration_idx]),
                        "mid_duration": json.loads(row[mid_blank_duration_idx]),
                        "cue_duration": json.loads(row[cue_duration_idx])
                    })
            if inner_width is None:
                raise Exception(
                    "Viewport inner width not found for run %d" % run_id
                )
            for trial in run_trials:
                estimations = trial['gaze_estimations']
                total_duration_in_ms = \
                    trial['pre_duration'] + \
                    trial['fixation_duration'] + \
                    trial['mid_duration'] + \
                    trial['cue_duration']
                formatted_trial = {
                    "run_id": run_id,
                    "trial_id": trial["trial_id"],
                    "estimations": estimations,
                    "sampling_frequency": len(estimations) / (total_duration_in_ms / 1000),
                    "center_x": trial["center_x"],
    
                    "pre_start": 0,
                    "fixation_start": trial['pre_duration'],
                    "mid_start": \
                        trial['pre_duration'] + \
                        trial['fixation_duration'],
                    "cue_start": \
                        trial['pre_duration'] + \
                        trial['fixation_duration'] + \
                        trial['mid_duration'],
                    "cue_finish": total_duration_in_ms,
    
                    "cue_shown_at_left": trial["cue_shown_at_left"],
                    "cue_abs_x_delta": trial["cue_abs_x_delta"]
                }
                trials.append(formatted_trial)
    return trials

def group_by_run(trials):
    d = dict()
    for t in trials:
        r = t['run_id']
        if r not in d:
            d[r] = []
        d[r].append(t)
    return d

def uniformize_trial_sampling(trial):
    t0 = trial['estimations'][0]['t']
    tn = trial['estimations'][-1]['t']

    def interpolate_between(x, xa, ya, xb, yb):
        # Here x and y are not used as the screen coordinates but as the
        # classic horizontal vs vertical axis.
        # Check https://en.wikipedia.org/wiki/Interpolation#Linear_interpolation
        if not xa <= x <= xb:
            raise Exception('can not interpolate outside of input points')
        return ya + (yb - ya) * (x - xa) / (xb - xa)

    def interpolate(t, axis):
        if t >= tn + TARGET_SAMPLING_PERIOD_IN_MS:
            raise Exception('input time is too big to interpolate')
        if t >= tn:
            return trial['estimations'][-1][axis]

        # find first bucket in which `t` is contained
        for i in range(1, len(trial['estimations'])):
            if trial['estimations'][i]['t'] > t:
                # this is the bucket since estimations are sorted by time
                past_estimation = trial['estimations'][i - 1]
                future_estimation = trial['estimations'][i]
                return interpolate_between(
                    t,
                    past_estimation['t'], past_estimation[axis],
                    future_estimation['t'], future_estimation[axis],
                )
        raise Exception('you should not be here')

    resampled_estimations = []
    t = t0
    while t < tn + TARGET_SAMPLING_PERIOD_IN_MS:
        resampled_estimations.append({
            'x': interpolate(t, 'x'),
            'y': interpolate(t, 'y'),
            't': t
        })
        t += TARGET_SAMPLING_PERIOD_IN_MS
    
    trial['estimations'] = resampled_estimations
    return trial

def uniformize_sampling(trials):
    return [uniformize_trial_sampling(t) for t in trials]
