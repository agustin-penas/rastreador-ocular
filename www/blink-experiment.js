const jsPsych = initJsPsych({
  on_finish: function () {
    jsPsych.data.displayData();
    jsPsych.data.get().localSave(
      'csv',
      `blink-experiment-${(new Date).toISOString()}.csv`
    );
  },
  extensions: [{ type: jsPsychExtensionWebgazer }, { type: jsPsychExtensionRecordVideo }],
});

// Define the experiment timeline
var timeline = [];

// Define the parameters of the trial
var blink_duration = 1000; // milliseconds
var dot_duration = 2000; // milliseconds
var trial_duration = 6000; // milliseconds
var dot_color = "red";
var dot_blink_color = "green";
var correct_response = " ";// older browsers return "Spacebar"

// Create the dot stimulus
var dot_html = '<div style="width:50px;height:50px;border-radius:50%;background-color:' + dot_color + ';"></div>';
var dot_green_html = '<div style="width:50px;height:50px;border-radius:50%;background-color:' + dot_blink_color + ';"></div>';

timeline.push({
  type: jsPsychInitializeCamera
});
timeline.push({
  type: jsPsychWebgazerInitCamera,
  instructions: `
    <div style="left: calc(50% - 400px); width:800px;">
      <p>
        Corregí la posición de la webcam para que se alinie con tus ojos y estos
        queden bien enfocados. Tu cabeza debería quedar en el centro del
        recuadro que aparece acá arriba.
        <br>
        Itentá que tus ojos se distingan correctamente. Si tenés luces atrás
        tuyo probá apagarlas.
      </p>
      <p>
        Cuando el recuadro se pinte de verde podés hacer click en
        <i>"continuar"</i>.
      </p>
    </div>
    `,
  button_text: "continuar",
});
timeline.push({
  type: rastocJSPsych.EventsTrackingStart
});
timeline.push({
  type: jsPsychFullscreen,
  message: `
  <div style="left: calc(50% - 400px); width:800px;">
    <h2>Intro</h2>
    <p>
      Para evitar distracciones te pedimos también que en la medida de lo
      posible durante la duración del experimento cierres aplicaciones que
      generen notificaciones y pongas el teléfono en modo no molestar.
      <br>
      Además vamos a cambiar a pantalla completa.
    </p>
  </div>`,
  button_label: "continuar",
});
timeline.push(
  rastocJSPsych.ensureCalibration({
    performValidation: true,
    forceCalibration: true,
    maxRetries: 1,
  })
);

timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>
			En el siguiente experimento debes mirar fijamente al punto rojo por 20 segundos <br>
      Presioná <i>continuar</i> para iniciar el experimento.
    </p>
    `,
  choices: ["continuar"],
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  choices: "NO_KEYS",
  stimulus: dot_html,
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }, { type: jsPsychExtensionRecordVideo }],
  trial_duration: 20000,
})

timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>
			En el siguiente experimento debes mirar fijamente al punto rojo, cuando este cambie a color verde debes pestañear. <br>
      Presioná <i>continuar</i> para iniciar el experimento.
    </p>
    `,
  choices: ["continuar"],
})

//Repetir 20 veces el green blink con 1 segundo entre cada uno.
for (let i = 0; i < 20; i++) {
  timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    choices: "NO_KEYS",
    stimulus: dot_html,
    extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }, { type: jsPsychExtensionRecordVideo }],
    trial_duration: 1000,
  })

  timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    choices: "NO_KEYS",
    stimulus: dot_green_html,
    extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }, { type: jsPsychExtensionRecordVideo }],
    trial_duration: 500,
  })
}

timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>
      Fin del experimento. Presioná <i>finalizar</i> y esperá unos segundos a
      que la pantalla quede en blanco. Luego podés cerrar la pestaña. <br>
      Muchas gracias por participar c:
    </p>
    `,
  choices: ["finalizar"],
})
timeline.push({ type: rastocJSPsych.EventsTrackingStop });

// Start the experiment
jsPsych.run(timeline);