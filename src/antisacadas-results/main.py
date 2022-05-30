import matplotlib.pyplot as plt
from statistics import mean, stdev

from utils.parsing import parse_trials
from utils.constants import MINIMUM_TRIALS_AMOUNT_PER_RUN_PER_TASK
from utils.trials_collection import TrialsCollection
from utils.trial_utilities import second_saccade_interval
from fixated_trials import divide_trials_by_focus_on_center
from saccade_detection import compute_saccades_in_place
from early_saccade_trials import divide_trials_by_early_saccade
from non_response_trials import divide_trials_by_non_response
from incorrect_trials import divide_trials_by_correctness
from trials_response_times import compute_response_times_in_place

def plot_trials_by_run_and_saccade_type(trials):
    fig, axs = plt.subplots(ncols=2, nrows=trials.runs_count, sharex=True)
    for i, run_id in enumerate(trials.runs_ids):
        for j, saccade_type in enumerate(['pro', 'anti']):
            for t in trials.get_trials_by_run_by_saccade(run_id, saccade_type):
                es = t['estimates']
                axs[i][j].plot(
                    [e['t'] for e in es],
                    [e['x'] for e in es],
                    color="black",
                    alpha=0.3
                )
                axs[i][j].set_title("%ssaccades of run %d" % (
                    t['saccade_type'],
                    t['run_id']
                ))
                axs[i][j].axvline(
                    0,
                    linestyle="--",
                    color='black',
                    alpha=0.1,
                    label="apparition of visual cue"
                )
    plt.show()

saccade_types = ['pro', 'anti']
trials, counts_per_run = parse_trials()

trials, unfocused_trials = divide_trials_by_focus_on_center(trials)
for run_id in counts_per_run.keys():
    for st in saccade_types:
        counts_per_run[run_id][st]['unfocused_drop_count'] = len([
            t for t in unfocused_trials.get_trials_by_run_by_saccade(run_id, st)
        ])

compute_saccades_in_place(trials)

trials, early_saccade_trials = divide_trials_by_early_saccade(trials)
for run_id in counts_per_run.keys():
    for st in saccade_types:
        counts_per_run[run_id][st]['early_saccade_drop_count'] = len([
            t for t in early_saccade_trials.get_trials_by_run_by_saccade(run_id, st)
        ])

trials, non_response_trials = divide_trials_by_non_response(trials)
for run_id in counts_per_run.keys():
    for st in saccade_types:
        counts_per_run[run_id][st]['non_response_drop_count'] = len([
            t for t in non_response_trials.get_trials_by_run_by_saccade(run_id, st)
        ])

for run_id in counts_per_run.keys():
    for st in saccade_types:
        counts_per_run[run_id][st]['post_preprocessing_count'] = \
            counts_per_run[run_id][st]['original_count'] - \
            counts_per_run[run_id][st]['low_frequency_drop_count'] - \
            counts_per_run[run_id][st]['unfocused_drop_count'] - \
            counts_per_run[run_id][st]['early_saccade_drop_count'] - \
            counts_per_run[run_id][st]['non_response_drop_count']

runs_without_enough_valid_trials = []
print('>> Preprocessing drop count report:')
print('---------------------------------------------------------------------------------------------------------------------------')
print('       || counts                                                                                        ||                 ')
print('run_id || original   || low frecuency | unfocused  | early saccade | non response || post preprocessing || is below minimum')
print('       || pro ~ anti || pro   ~ anti  | pro ~ anti | pro   ~ anti  | pro  ~ anti  || pro     ~ anti     ||                 ')
print('---------------------------------------------------------------------------------------------------------------------------')
for run_id, counts in sorted(
        counts_per_run.items(),
        key=lambda e: e[1]['pro']['post_preprocessing_count'] + e[1]['anti']['post_preprocessing_count']
    ):
    is_below_minimum = \
        counts['pro']['post_preprocessing_count'] < MINIMUM_TRIALS_AMOUNT_PER_RUN_PER_TASK or \
        counts['anti']['post_preprocessing_count'] < MINIMUM_TRIALS_AMOUNT_PER_RUN_PER_TASK

    if is_below_minimum:
        runs_without_enough_valid_trials.append(run_id)

    print('{:6d} || {:3d} ~ {:4d} || {:3d}   ~ {:4d}  | {:3d} ~ {:4d} | {:3d}   ~ {:4d}  | {:3d}   ~ {:4d} || {:3d}     ~ {:4d}     || {}'.format(
        run_id,
        counts['pro']['original_count'],
        counts['anti']['original_count'],
        counts['pro']['low_frequency_drop_count'],
        counts['anti']['low_frequency_drop_count'],
        counts['pro']['unfocused_drop_count'],
        counts['anti']['unfocused_drop_count'],
        counts['pro']['early_saccade_drop_count'],
        counts['anti']['early_saccade_drop_count'],
        counts['pro']['non_response_drop_count'],
        counts['anti']['non_response_drop_count'],
        counts['pro']['post_preprocessing_count'],
        counts['anti']['post_preprocessing_count'],
        is_below_minimum
    ))
print('---------------------------------------------------------------------------------------------------------------------------')

if len(runs_without_enough_valid_trials) > 0:
    print('')
    print('>> Trials of {:d} runs (ids=[{:s}]) were dropped due to having less than {:d} trials per task after preprocessing'.format(
        len(runs_without_enough_valid_trials),
        ', '.join([str(i) for i in runs_without_enough_valid_trials]),
        MINIMUM_TRIALS_AMOUNT_PER_RUN_PER_TASK
    ))
    trials = TrialsCollection([
        t for t in trials.all()
        if t['run_id'] not in runs_without_enough_valid_trials
    ])

compute_response_times_in_place(trials)
correct_trials, incorrect_trials = divide_trials_by_correctness(trials)
#plot_trials_by_run_and_saccade_type(correct_trials)
#plot_trials_by_run_and_saccade_type(incorrect_trials)

trials_per_correctness = dict()
for run_id in trials.runs_ids:
    trials_per_correctness[run_id] = dict()
    for st in saccade_types:
        trials_per_correctness[run_id][st] = {
            'correct': TrialsCollection(
                correct_trials.get_trials_by_run_by_saccade(run_id, st)),
            'incorrect': TrialsCollection(
                incorrect_trials.get_trials_by_run_by_saccade(run_id, st)),
        }

print('')
print('>> Correctness report:')
print('--------------------------------------------------------')
print('run id || # correct   | # incorrect  | correctness ratio')
print('       || pro  ~ anti | pro  ~ anti  | pro     ~ anti   ')
print('--------------------------------------------------------')
for run_id in trials.runs_ids:
    print('{:6d} || {:4d} ~ {:4d} | {:4d} ~ {:4d}  | {:1.2f}    ~ {:1.2f}   '.format(
        run_id,
        trials_per_correctness[run_id]['pro']['correct'].count,
        trials_per_correctness[run_id]['anti']['correct'].count,
        trials_per_correctness[run_id]['pro']['incorrect'].count,
        trials_per_correctness[run_id]['anti']['incorrect'].count,
        trials_per_correctness[run_id]['pro']['correct'].count / (
            trials_per_correctness[run_id]['pro']['correct'].count + \
            trials_per_correctness[run_id]['pro']['incorrect'].count),
        trials_per_correctness[run_id]['anti']['correct'].count / (
            trials_per_correctness[run_id]['anti']['correct'].count + \
            trials_per_correctness[run_id]['anti']['incorrect'].count)
    ))
print('--------------------------------------------------------')
total_pro_correct_count = sum([
    trials_per_correctness[run_id]['pro']['correct'].count
    for run_id in trials.runs_ids
])
total_anti_correct_count = sum([
    trials_per_correctness[run_id]['anti']['correct'].count
    for run_id in trials.runs_ids
])
total_pro_incorrect_count = sum([
    trials_per_correctness[run_id]['pro']['incorrect'].count
    for run_id in trials.runs_ids
])
total_anti_incorrect_count = sum([
    trials_per_correctness[run_id]['anti']['incorrect'].count
    for run_id in trials.runs_ids
])
print(' total || {:4d} ~ {:4d} | {:4d} ~ {:4d}  | {:1.2f}    ~ {:1.2f}   '.format(
    total_pro_correct_count,
    total_anti_correct_count,
    total_pro_incorrect_count,
    total_anti_incorrect_count,
    total_pro_correct_count / (total_pro_correct_count + total_pro_incorrect_count),
    total_anti_correct_count / (total_anti_correct_count + total_anti_incorrect_count)
))
print('--------------------------------------------------------')
print('')

print('>> Mean response time report (value of 0 indicates there was not enough data to compute the value):')
print('-------------------------------------------------------------------------------')
print('run id || correct mean RT (std)             | incorrect mean RT (std)')
print('       || pro             ~ anti            | pro             ~ anti      ')
print('-------------------------------------------------------------------------------')
for run_id in trials.runs_ids:
    run_pro_correct_rts = [
        t['response_time']
        for t
        in trials_per_correctness[run_id]['pro']['correct'].all()
    ]
    run_anti_correct_rts = [
        t['response_time']
        for t
        in trials_per_correctness[run_id]['anti']['correct'].all()
    ]
    run_pro_incorrect_rts = [
        t['response_time']
        for t
        in trials_per_correctness[run_id]['pro']['incorrect'].all()
    ]
    run_anti_incorrect_rts = [
        t['response_time']
        for t
        in trials_per_correctness[run_id]['anti']['incorrect'].all()
    ]
    for l in [run_pro_correct_rts, run_anti_correct_rts, run_pro_incorrect_rts, run_anti_incorrect_rts]:
        if len(l) == 0:
            l.append(0)
        if len(l) == 1:
            l.append(l[0])
    print('{:6d} || {:6.2f} ({:6.2f}) ~ {:6.2f} ({:6.2f}) | {:6.2f} ({:6.2f}) ~ {:6.2f} ({:6.2f})'.format(
        run_id,
        mean(run_pro_correct_rts), stdev(run_pro_correct_rts),
        mean(run_anti_correct_rts), stdev(run_anti_correct_rts),
        mean(run_pro_incorrect_rts), stdev(run_pro_incorrect_rts),
        mean(run_anti_incorrect_rts), stdev(run_anti_incorrect_rts)
    ))
print('-------------------------------------------------------------------------------')
pro_correct_rts = [
    t['response_time']
    for run_id in trials_per_correctness.keys()
    for t
    in trials_per_correctness[run_id]['pro']['correct'].all()
]
anti_correct_rts = [
    t['response_time']
    for run_id in trials_per_correctness.keys()
    for t
    in trials_per_correctness[run_id]['anti']['correct'].all()
]
pro_incorrect_rts = [
    t['response_time']
    for run_id in trials_per_correctness.keys()
    for t
    in trials_per_correctness[run_id]['pro']['incorrect'].all()
]
anti_incorrect_rts = [
    t['response_time']
    for run_id in trials_per_correctness.keys()
    for t
    in trials_per_correctness[run_id]['anti']['incorrect'].all()
]
print(' total || {:6.2f} ({:6.2f}) ~ {:6.2f} ({:6.2f}) | {:6.2f} ({:6.2f}) ~ {:6.2f} ({:6.2f})'.format(
    mean(pro_correct_rts), stdev(pro_correct_rts),
    mean(anti_correct_rts), stdev(anti_correct_rts),
    mean(pro_incorrect_rts), stdev(pro_incorrect_rts),
    mean(anti_incorrect_rts), stdev(anti_incorrect_rts)
))
print('-------------------------------------------------------------------------------')

min_rt = min(
    min(pro_correct_rts),
    min(anti_correct_rts),
    min(pro_incorrect_rts),
    min(anti_incorrect_rts)
)
max_rt = max(
    max(pro_correct_rts),
    max(anti_correct_rts),
    max(pro_incorrect_rts),
    max(anti_incorrect_rts)
)
buckets_amount = 20
bucket_size = (max_rt - min_rt) / buckets_amount
bucketed_rts = dict()
for st in saccade_types:
    bucketed_rts[st] = dict()
    for c in ['correct', 'incorrect']:
        bucketed_rts[st][c] = [list() for _ in range(buckets_amount)]
def rt_to_bucket_idx(rt):
    if rt < min_rt:
        raise Exception('rt too low')
    if rt > max_rt:
        raise Exception('rt too low')
    if rt == max_rt:
        return buckets_amount - 1
    return int((rt - min_rt) // bucket_size)

for rt in pro_correct_rts:
    bucketed_rts['pro']['correct'][rt_to_bucket_idx(rt)].append(rt)
for rt in anti_correct_rts:
    bucketed_rts['anti']['correct'][rt_to_bucket_idx(rt)].append(rt)
for rt in pro_incorrect_rts:
    bucketed_rts['pro']['incorrect'][rt_to_bucket_idx(rt)].append(rt)
for rt in anti_incorrect_rts:
    bucketed_rts['anti']['incorrect'][rt_to_bucket_idx(rt)].append(rt)

buckets_middle_values = [
    ((min_rt + i * bucket_size) + (min_rt + (i + 1) * bucket_size)) / 2
    for i in range(buckets_amount)
]
fig, ax = plt.subplots()
plt.plot(
    buckets_middle_values,
    [
        len(bucket) / total_pro_correct_count
        for bucket in bucketed_rts['pro']['correct']
    ],
    label="correct prosaccades",
    lw=0.5,
    color="black",
    marker="."
)
plt.plot(
    buckets_middle_values,
    [
        len(bucket) / total_pro_incorrect_count
        for bucket in bucketed_rts['pro']['incorrect']
    ],
    label="incorrect prosaccades",
    lw=0.5,
    ls="--",
    color="black",
    marker="o"
)
plt.plot(
    buckets_middle_values,
    [
        len(bucket) / total_anti_correct_count
        for bucket in bucketed_rts['anti']['correct']
    ],
    label="correct antisaccades",
    lw=0.5,
    color="black",
    marker="x"
)
plt.plot(
    buckets_middle_values,
    [
        len(bucket) / total_anti_incorrect_count
        for bucket in bucketed_rts['anti']['incorrect']
    ],
    label="incorrect antisaccades",
    lw=0.5,
    ls="--",
    color="black",
    marker="X"
)
fig.suptitle("""Trials distribution (accumulated in buckets with size of {:.2f} ms)
Incorrect trials show quicker responses than correct trials.
Correct antisaccades show slower responses than correct prosaccades.""".format(bucket_size))
plt.xlabel('response time (in ms)')
plt.ylabel('proportion per category')
plt.legend()
plt.show()

def compute_correction_time_in_place(trials):
    for t in trials.all():
        second_saccade_indexes = second_saccade_interval(t)
        t['correction_time'] = \
            t['estimates'][second_saccade_indexes[0]]['t'] \
            if second_saccade_indexes is not None \
            else None
compute_correction_time_in_place(incorrect_trials)

corrected_trials = [
    t for t in incorrect_trials.all()
    if t['correction_time'] is not None
]
correction_delays = [
    t['correction_time'] - t['response_time']
    for t in corrected_trials
]
print('')
print('>> Incorrect antisaccades correction report')
print('------------------------------------------------------------------------------')
print('# total | # corrected | correction proportion | mean correction delay (std)')
print('------------------------------------------------------------------------------')
print(' {:4d}   | {:4d}        | {:4.2f}                  | {:6.2f}                ({:6.2f})'.format(
    incorrect_trials.count,
    len(corrected_trials),
    len(corrected_trials) / incorrect_trials.count,
    mean(correction_delays),
    stdev(correction_delays),
))
print('------------------------------------------------------------------------------')
