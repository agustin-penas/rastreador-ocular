const jsPsych = initJsPsych({
  on_finish: function () {
    jsPsych.data.displayData();
    jsPsych.data.get().localSave(
      'csv',
      `blink-experiment-expose-points${(new Date).toISOString()}.csv`
    );
  },
  extensions: [{ type: jsPsychExtensionWebgazer }],
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

/*timeline.push({
  type: jsPsychInitializeCamera
});*/
timeline.push({
  type: jsPsychWebgazerInitCamera
});
timeline.push({
  type: rastocJSPsych.EventsTrackingStart
});
timeline.push({
  type: jsPsychFullscreen
});

timeline.push({
  type: jsPsychVirtualChinrest,
  blindspot_reps: 3,
  resize_units: "none"
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
    En el proximo experimento usted debe:<br>
      1. Pestañear 5 veces rapido.<br>
      2. Esperar 2 segundos.<br>
      3. Pestañear 5 veces rapido. <br>
    Tiene 20 segundos, si termina antes puede apretar el boton <i>continuar</i>.<br>
    Presione <i>continuar</i> para iniciar el experimento.<br>
    </p>
    `,
  choices: ["continuar"],
})

timeline.push({
  type: jsPsychHtmlButtonResponse,
  choices: ["continuar"],
  stimulus: dot_html,
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: 20000,
})

timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>
    En el proximo experimento usted debe:<br>
      1. Pestañear 5 veces de manera relajada.<br>
      2. Esperar 2 segundos.<br>
      3. Pestañear 5 veces de manera relajada.<br>
    Tiene 20 segundos, si termina antes puede apretar el boton <i>continuar</i>.<br>
    Presione <i>continuar</i> para iniciar el experimento.<br>
    </p>
    `,
  choices: ["continuar"],
})

timeline.push({
  type: jsPsychHtmlButtonResponse,
  choices: ["continuar"],
  stimulus: dot_html,
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: 20000,
})

timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>
    En el proximo experimento usted debe:<br>
      1. Cierre los ojos por 1 segundo.<br>
      2. Esperar 2 segundos.<br>
      3. Cierre los ojos por 1 segundo.<br>
    Tiene 20 segundos, si termina antes puede apretar el boton <i>continuar</i>.<br>
    Presione <i>continuar</i> para iniciar el experimento.<br>
    </p>
    `,
  choices: ["continuar"],
})

timeline.push({
  type: jsPsychHtmlButtonResponse,
  choices: ["continuar"],
  stimulus: dot_html,
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: 20000,
})

timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>
    En el proximo experimento usted debe:<br>
      1. Mirar fijamente a la camara pestañeando 10 veces.<br>
      2. Mueva la mirada por toda la pantalla sin movimientos de cabeza pestañeando 10 veces.<br>
      3. Mueva la mirada por toda la pantalla con movimientos de la cabeza pestañeando 10 veces.  <br>
    Tiene 20 segundos, si termina antes puede apretar el boton <i>continuar</i>.<br>
    Presione <i>continuar</i> para iniciar el experimento.<br>
    </p>
    `,
  choices: ["continuar"],
})

timeline.push({
  type: jsPsychHtmlButtonResponse,
  choices: ["continuar"],
  stimulus: dot_html,
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: 32000,
})

timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>
      Fin del experimento. Presione <i>finalizar</i> y espere unos segundos a
      que la pantalla quede en blanco. Luego podra cerrar la pestaña. <br>
      Muchas gracias por participar c:
    </p>
    `,
  choices: ["finalizar"],
})
timeline.push({ type: rastocJSPsych.EventsTrackingStop });

// Start the experiment
jsPsych.run(timeline);