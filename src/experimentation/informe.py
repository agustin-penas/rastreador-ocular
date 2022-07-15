import sys, os
import matplotlib.pyplot as plt

from instances_common.plots import separated_hist
from instances_common.plots import draw_sampling_frequecies_marks
from instances_common.plots import plot_post_processing_trials
from instances_common.plots import plot_responses_times_distributions

def draw_compared_metric(instance, perRunAx, perTrialAx, metric_name, field_name):
    separated_hist(
        perRunAx,
        perTrialAx,
        instance['post_filtering_metrics'][metric_name],
        field_name
    )

def plot_descriptive_histograms(instances, target, scope):
    config = { 'frequencies': {
        'title': 'Distribución de frecuencias de sampleo',
        'metric_name': 'frequencies',
        'key_name': 'frequency',
        'unit_label': 'Frecuencia (en Hz)'
    }, 'resolutions': {
        'title': 'Distribución de frecuencias de anchos de pantalla',
        'metric_name': 'widths',
        'key_name': 'width',
        'unit_label': 'Ancho de pantalla (en px)'
    }, 'ages': {
        'title': 'Distribución de edades',
        'metric_name': 'ages',
        'key_name': 'age',
        'unit_label': 'Edad'
    }, 'post_processing': {}}
    nrows = 2
    ncols = 1
    if scope == 'both':
        ncols = 2

    fig, axes = plt.subplots(nrows=nrows, ncols=ncols)
    fig.suptitle(config[target]['title'])
    if scope == 'both':
        for j, name in enumerate(['first', 'second']):
            draw_compared_metric(
                instances[name],
                axes[0][j],
                axes[1][j],
                config[target]['metric_name'],
                config[target]['key_name']
            )
        axes[0][0].set_ylabel('Cantidad de sujetos')
        axes[1][0].set_ylabel('Cantidad de repeticiones')
        axes[1][0].set_xlabel(config[target]['unit_label'])
        axes[1][1].set_xlabel(config[target]['unit_label'])
    
        axes[0][0].set_title('Primera instancia, repeticiones agrupadas por sujeto')
        axes[1][0].set_title('Primera instancia, repeticiones miradas individualmente')
        axes[0][1].set_title('Segunda instancia, repeticiones agrupadas por sujeto')
        axes[1][1].set_title('Segunda instancia, repeticiones miradas individualmente')
        if target == 'frequencies':
            draw_sampling_frequecies_marks(axes[0][0])
            draw_sampling_frequecies_marks(axes[1][0])
            draw_sampling_frequecies_marks(axes[0][1])
            draw_sampling_frequecies_marks(axes[1][1])
        axes[0][1].legend()
    else:
        draw_compared_metric(
            instances[scope],
            axes[0],
            axes[1],
            config[target]['metric_name'],
            config[target]['key_name']
        )
        axes[0].set_ylabel('Cantidad de sujetos')
        axes[1].set_ylabel('Cantidad de repeticiones')
        axes[1].set_xlabel(config[target]['unit_label'])

        instance_label = 'Primera' if scope == 'first' else 'Segunda'
        axes[0].set_title('{} instancia, repeticiones agrupadas por sujeto'.format(instance_label))
        axes[1].set_title('{} instancia, repeticiones miradas individualmente'.format(instance_label))
        axes[0].legend()

    plt.show()

###

import sys
sys.path = [
    '/home/francisco/eye-tracking/rastreador-ocular/src/experimentation',
] + sys.path

from first_instance.summary import FirstInstance
from first_instance.summary import build_first_instance_tex_context

from second_instance.summary import SecondInstance
from second_instance.summary import build_second_instance_tex_context

from instances_common.main import AgesDistributionFigure
from instances_common.main import DisaggregatedAntisaccadesFigure
from instances_common.main import DisaggregatedProsaccadesFigure
from instances_common.main import ResponseTimesDistributionFigure

def build_results_tex_string(results, template, build_path, logical_path):
    return template.format(
        **results.first_instance_context,
        **results.second_instance_context,
        **dict([
            (n, f.as_tex_string(build_path, logical_path))
            for n, f
            in results.figures.items()]),
        **dict([
            ("{}__label".format(n), f.label)
            for n, f
            in results.figures.items()]),
    ).strip('\n')

class Results():
    def __init__(self):
        first_instance = FirstInstance()
        self.first_instance_context = build_first_instance_tex_context(first_instance)

        second_instance = SecondInstance()
        self.second_instance_context = build_second_instance_tex_context(second_instance)
    
        first_categorized_trials = {
            'anti': {
                'correct': first_instance.correct_sample.ts.all(),
                'incorrect': first_instance.incorrect_sample.ts.all(),
            }
        }
        second_categorized_trials = {
            'anti': {
                'correct': [t for t in second_instance.correct_sample.ts.all() if t.saccade_type == 'anti'],
                'incorrect': [t for t in second_instance.incorrect_sample.ts.all() if t.saccade_type == 'anti'],
            },
            'pro': {
                'correct': [t for t in second_instance.correct_sample.ts.all() if t.saccade_type == 'pro'],
                'incorrect': [t for t in second_instance.incorrect_sample.ts.all() if t.saccade_type == 'pro'],
            },
        }

        self.figures = dict([
            (
                "first__ages_distribution_figure",
                AgesDistributionFigure(first_instance.ages, 'first')
            ),
            (
                "second__ages_distribution_figure",
                AgesDistributionFigure(second_instance.ages, 'second')
            ),
            (
                "first__response_times_distribution_figure",
                ResponseTimesDistributionFigure(first_categorized_trials, 'first')
            ),
            (
                "second__response_times_distribution_figure",
                ResponseTimesDistributionFigure(second_categorized_trials, 'second')
            ),
            (
                "first__disaggregated_antisaccades_figure",
                DisaggregatedAntisaccadesFigure(first_categorized_trials, 'first')
            ),
            (
                "second__disaggregated_antisaccades_figure",
                DisaggregatedAntisaccadesFigure(second_categorized_trials, 'second')
            ),
            (
                "second__disaggregated_prosaccades_figure",
                DisaggregatedProsaccadesFigure(second_categorized_trials, 'second')
            ),
        ])

###

import sys
import os

sys.path = ['/home/francisco/eye-tracking/rastreador-ocular/src/experimentation'] + sys.path

from shared.main import rm_rf

# TODO: Match what is exported to '/build' with what I then copy to overleaf
#        - intro/ (done)
#        - metodo/
#        - results/ (missing figures and tables)
#        - conclu/
#        - refs/
if __name__ == "__main__":
    rm_rf('informe/build')
    os.mkdir('informe/build')

    os.mkdir('informe/build/results')
    with open('informe/resultados.tex') as results_template_file:
        with open('informe/build/results/main.tex'.format(), "w") as results_output_file:
            results_output_file.write(build_results_tex_string(
                Results(),
                results_template_file.read(),
                'informe/build/results',
                "results"
            ))

    os.mkdir('informe/build/intro')
    with open('informe/intro.tex') as intro_template_file:
        with open('informe/build/intro/main.tex', "w") as intro_output_file:
            intro_output_file.write(intro_template_file.read().format())

# TODO: Delete this content below as it gets reused for re-writing
    #with open("informe/resultados.tex") as f:
        #print(f.read().format())
#    description_targets = ['frequencies', 'resolutions', 'ages']
#    allowed_targets = \
#        description_targets + \
#        ['post_processing', 'response_times_distribution']
#    if len(sys.argv) < 2:
#        print('missing target', file=sys.stderr)
#        sys.exit(-1)
#    target = sys.argv[1]
#    if target not in allowed_targets:
#        print(
#            'unkown target, valid ones are [{}]'.format(', '.join(allowed_targets)),
#            file=sys.stderr
#        )
#        sys.exit(-1)
#
#    allowed_scopes = ['both', 'first', 'second']
#    if len(sys.argv) < 3:
#        print(
#            'missing scope, valid ones are [{}]'.format(', '.join(allowed_scopes)),
#            file=sys.stderr
#        )
#        sys.exit(-1)
#    scope = sys.argv[2]
#    if scope not in allowed_scopes:
#        print(
#            'unkown scope, valid ones are [{}]'.format(', '.join(allowed_scopes)),
#            file=sys.stderr
#        )
#        sys.exit(-1)
#
#    instances = {}
#    if scope == 'both':
#    elif scope == 'first':
#    else:
#
#    if target in description_targets:
#        plot_descriptive_histograms(instances, target, scope)
#    elif target == 'post_processing':
#        for name in instances.keys():
#            saccades = instances[name]['saccades']
#            if name == 'first':
#            elif name == 'second':
#    elif target == 'response_times_distribution':
#        for name in instances.keys():
#            saccades = instances[name]['saccades']
#            plot_responses_times_distributions(saccades)
