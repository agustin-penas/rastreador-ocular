import csv
import re
import os 
import json
import matplotlib.pyplot as plt

# Read trials results
antisaccades_data_path = 'src/data-analysis/short-antisaccades'
trials = []
for file_path in os.listdir(antisaccades_data_path):
    p = re.compile('short-antisaccades_(\d{1,3}).csv')
    print('\n', file_path)
    run_id = p.match(file_path).group(1)
    with open(os.path.join(antisaccades_data_path, file_path), 'r') as f:
        csv_rows_iterator = csv.reader(f, delimiter=",", quotechar='"')
        headers = next(csv_rows_iterator, None)

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
        for row in csv_rows_iterator:
            if row[inner_width_idx] != '"':
                inner_width = json.loads(row[inner_width_idx])
            if row[exp_name_idx] == "antisaccade":
                run_trials.append({
                    "gaze_estimations": json.loads(row[wg_data_idx]),
                    "center_x": json.loads(row[center_x_idx]),
                    "center_y": json.loads(row[center_y_idx]),
                    "cue_show_at_left": json.loads(row[cue_shown_at_left_idx]),
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
            trial['run_id'] = run_id
            trial['inner_width'] = inner_width
        trials.extend(run_trials)

#fig, ax = plt.subplots()
#for trial in trials:
#    ax.plot(
#        [e['t'] for e in trial['gaze_estimations']],
#        [e['x'] for e in trial['gaze_estimations']],
#        alpha=0.4,
#        linewidth=0.7
#    )
#plt.show()

def normalize(trial):
    delta_xs = []
    print(trial)
    for g in trial["gaze_estimations"]:
        # TODO: Normalize and center
        print(g['x'], trial['center_x'], trial['inner_width'])
        asd
    return {
        "delta_xs": delta_xs
    }

d = [normalize(t) for t in trials]

