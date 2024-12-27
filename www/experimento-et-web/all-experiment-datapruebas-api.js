
const queryParams = new URLSearchParams(window.location.search);
let run_id = queryParams.get('run-id');

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const jsPsych = initJsPsych({
  on_finish: function () {
    jsPsych.data.displayData();
    jsPsych.data.get().localSave(
      'csv',
      `all-experiment-expose-points${(new Date).toISOString()}.csv`
    );
    window.location.href = "https://datapruebas.org/"
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
var trialDuration = 30000;
// Create the dot stimulus
var dot_html = '<div style="width:50px;height:50px;border-radius:50%;background-color:' + dot_color + ';"></div>';
var dot_green_html = '<div style="width:50px;height:50px;border-radius:50%;background-color:' + dot_blink_color + ';"></div>';



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
//***************************** */
// EMPIEZAN DISTANCE
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

timeline.push({
  type: jsPsychVirtualChinrest,
  blindspot_reps: 3,
  viewing_distance_report: "Según tus respuestas, estás sentado aproximadamente a <span id='distance-estimate' style='font-weight: bold;'></span> de la pantalla. ¿Te parece correcto?",
  blindspot_measurements_prompt: "Mediciones restantes.",
  blindspot_done_prompt: "Si",
  redo_measurement_button_label: "No, eso no está cerca. Intentar de nuevo.",
  blindspot_prompt: "Ahora mediremos rápidamente a qué distancia estás sentado. Coloca tu mano izquierda en la barra espaciadora. Cubre tu ojo derecho con tu mano derecha. Con tu ojo izquierdo, enfócate en el cuadrado negro. Mantén tu enfoque en el cuadrado negro. La bola roja desaparecerá mientras se mueve de derecha a izquierda. Presiona la barra espaciadora tan pronto como la bola desaparezca. Presiona la barra espaciadora cuando estés listo para comenzar.",
  adjustment_button_prompt: "Haz clic aquí cuando la imagen tenga el tamaño correcto.",
  adjustment_prompt: "<p>El experimento se repetira 3 veces (1/3).</p>Haz clic y arrastra <span style='color:red; font-weight: bold;'>la esquina inferior derecha de la imagen (indicada en color rojo)</span> hasta que sea del mismo tamaño que una tarjeta de crédito sostenida frente a la pantalla. Puedes usar cualquier tarjeta que tenga el mismo tamaño que una tarjeta de crédito, como una tarjeta de membresía o una licencia de conducir. Si no tienes acceso a una tarjeta real, puedes usar una regla para medir el ancho de la imagen a 8.5 cm.<br><br>",
  resize_units: "none",
  item_path:"card.png",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  on_finish: function(data){
    console.log(data)
    console.log("run_id:", run_id)
    experimentData = jsPsych.data.get().json()
    console.log(experimentData)

    let url = `https://datapruebas.org/api/v1/record_data/${run_id}/`;
    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({ "data": experimentData })
    }).then(response => console.log(JSON.stringify(response)));
  }
});

timeline.push({
  type: jsPsychVirtualChinrest,
  blindspot_reps: 3,
  viewing_distance_report: "Según tus respuestas, estás sentado aproximadamente a <span id='distance-estimate' style='font-weight: bold;'></span> de la pantalla. ¿Te parece correcto?",
  blindspot_measurements_prompt: "Mediciones restantes.",
  blindspot_done_prompt: "Si",
  redo_measurement_button_label: "No, eso no está cerca. Intentar de nuevo.",
  blindspot_prompt: "Ahora mediremos rápidamente a qué distancia estás sentado. Coloca tu mano izquierda en la barra espaciadora. Cubre tu ojo derecho con tu mano derecha. Con tu ojo izquierdo, enfócate en el cuadrado negro. Mantén tu enfoque en el cuadrado negro. La bola roja desaparecerá mientras se mueve de derecha a izquierda. Presiona la barra espaciadora tan pronto como la bola desaparezca. Presiona la barra espaciadora cuando estés listo para comenzar.",
  adjustment_button_prompt: "Haz clic aquí cuando la imagen tenga el tamaño correcto.",
  adjustment_prompt: "<p>El experimento se repetira 3 veces (2/3).</p>Haz clic y arrastra <span style='color:red; font-weight: bold;'>la esquina inferior derecha de la imagen (indicada en color rojo)</span> hasta que sea del mismo tamaño que una tarjeta de crédito sostenida frente a la pantalla. Puedes usar cualquier tarjeta que tenga el mismo tamaño que una tarjeta de crédito, como una tarjeta de membresía o una licencia de conducir. Si no tienes acceso a una tarjeta real, puedes usar una regla para medir el ancho de la imagen a 8.5 cm.<br><br>",
  resize_units: "none",
  item_path:"card.png",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
});

timeline.push({
  type: jsPsychVirtualChinrest,
  blindspot_reps: 3,
  viewing_distance_report: "Según tus respuestas, estás sentado aproximadamente a <span id='distance-estimate' style='font-weight: bold;'></span> de la pantalla. ¿Te parece correcto?",
  blindspot_measurements_prompt: "Mediciones restantes.",
  blindspot_done_prompt: "Si",
  redo_measurement_button_label: "No, eso no está cerca. Intentar de nuevo.",
  blindspot_prompt: "Ahora mediremos rápidamente a qué distancia estás sentado. Coloca tu mano izquierda en la barra espaciadora. Cubre tu ojo derecho con tu mano derecha. Con tu ojo izquierdo, enfócate en el cuadrado negro. Mantén tu enfoque en el cuadrado negro. La bola roja desaparecerá mientras se mueve de derecha a izquierda. Presiona la barra espaciadora tan pronto como la bola desaparezca. Presiona la barra espaciadora cuando estés listo para comenzar.",
  adjustment_button_prompt: "Haz clic aquí cuando la imagen tenga el tamaño correcto.",
  adjustment_prompt: "<p>El experimento se repetira 3 veces (3/3).</p>Haz clic y arrastra <span style='color:red; font-weight: bold;'>la esquina inferior derecha de la imagen (indicada en color rojo)</span> hasta que sea del mismo tamaño que una tarjeta de crédito sostenida frente a la pantalla. Puedes usar cualquier tarjeta que tenga el mismo tamaño que una tarjeta de crédito, como una tarjeta de membresía o una licencia de conducir. Si no tienes acceso a una tarjeta real, puedes usar una regla para medir el ancho de la imagen a 8.5 cm.<br><br>",
  resize_units: "none",
  item_path:"card.png",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
});


//***************************** */
// EMPIEZAN BLINK
/**
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
*/
timeline.push(
  rastocJSPsych.ensureCalibration({
    performValidation: true,
    forceCalibration: true,
    maxRetries: 1,
  })
);

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>
    Trate de no mover la cabeza y coloque su mano sobre la barra espaciadora.<br>
    </p>
    `,
  choices: [" "],
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>
    En el proximo experimento por favor fijá la mirada en el círculo y luego realizá las siguientes acciones:<br>
      1. Pestañear 5 veces rapido.<br>
      2. Esperar 2 segundos.<br>
      3. Pestañear 5 veces rapido. <br>
    Tiene 20 segundos, si termina antes puede apretar la tecla <i>espacio</i>.<br>
    Presione la tecla <i>espacio</i> para iniciar el experimento.<br>
    </p>
    `,
  choices: [" "],
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  choices: [" "],
  stimulus: dot_html,
  margin_vertical: '50px',
  margin_horizontal: '-10px',
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: trialDuration,
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>
    En el proximo experimento por favor fijá la mirada en el círculo y luego realizá las siguientes acciones:<br>
      1. Pestañear 5 veces de manera relajada.<br>
      2. Esperar 2 segundos.<br>
      3. Pestañear 5 veces de manera relajada.<br>
    Tiene 20 segundos, si termina antes puede apretar la tecla <i>espacio</i>.<br>
    Presione la tecla <i>espacio</i> para iniciar el experimento.<br>
    </p>
    `,
  choices: [" "],
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  choices: [" "],
  stimulus: dot_html,
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: trialDuration,
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>
    En el proximo experimento por favor fijá la mirada en el círculo y luego realizá las siguientes acciones:<br>
      1. Cierre los ojos por 2 segundo.<br>
      2. Esperar 4 segundos.<br>
      3. Cierre los ojos por 2 segundo.<br>
    Tiene 20 segundos, si termina antes puede apretar la tecla <i>espacio</i>.<br>
    Presione la tecla <i>espacio</i> para iniciar el experimento.<br>
    </p>
    `,
  choices: [" "],
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  choices: [" "],
  stimulus: dot_html,
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: trialDuration,
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>
    En el proximo experimento por favor realizá las siguientes acciones:<br>
      1. Mirar fijamente al círculo pestañeando 10 veces.<br>
    Tiene 20 segundos, si termina antes puede apretar la tecla <i>espacio</i>.<br>
    Presione la tecla <i>espacio</i> para iniciar el experimento.<br>
    </p>
    `,
  choices: [" "],
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  choices: [" "],
  stimulus: dot_html,
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: trialDuration,
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>
    En el proximo experimento realizá las siguientes acciones:<br>
      1. Mueva la mirada por toda la pantalla SIN MOVER LA CABEZA pestañeando 10 veces.<br>
    Tiene 20 segundos, si termina antes puede apretar la tecla <i>espacio</i>.<br>
    Presione la tecla <i>espacio</i> para iniciar el experimento.<br>
    </p>
    `,
  choices: [" "],
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  choices: [" "],
  stimulus: dot_html,
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: trialDuration,
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>
    En el proximo experimento usted debe:<br>
      1. Mueva la mirada por toda la pantalla MOVIENDO LA CABEZA y además pestañeando 10 veces.  <br>
    Tiene 20 segundos, si termina antes puede apretar la tecla <i>espacio</i>.<br>
    Presione la tecla <i>espacio</i> para iniciar el experimento.<br>
    </p>
    `,
  choices: [" "],
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  choices: [" "],
  stimulus: dot_html,
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: trialDuration,
})


//***************************** */
// EMPIEZAN ROTATION

timeline.push({
  type: jsPsychVideoKeyboardResponse,
  stimulus: ['derecha_hombro.mp4'],
  choices: [" "],
  prompt: "<p>Luego de apretar la tecla <i>espacio</i> gire la cabeza hacia su hombro derecho como muestra el video.</p>",
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  choices: [" "],
  stimulus: "Luego de girar la cabeza, presione espacio para continuar",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: 20000,
})

timeline.push({
  type: jsPsychVideoKeyboardResponse,
  stimulus: ['derecha.mp4'],
  choices: [" "],
  prompt: "<p>Luego de apretar la tecla <i>espacio</i> gire la cabeza hacia la derecha, a medio camino entre mirar hacia el frente y hacia el hombro, como muestra el video.</p>",
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  choices: [" "],
  stimulus: "Luego de girar la cabeza, presione espacio para continuar",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: 20000,
})

timeline.push({
  type: jsPsychVideoKeyboardResponse,
  stimulus: ['izquierda_hombro.mp4'],
  choices: [" "],
  prompt: "<p>Luego de apretar la tecla <i>espacio</i> gire la cabeza hacia el hombro izquierdo como muestra el video.</p>",
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  choices: [" "],
  stimulus: "Luego de girar la cabeza, presione espacio para continuar",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: 20000,
})

timeline.push({
  type: jsPsychVideoKeyboardResponse,
  stimulus: ['izquierda.mp4'],
  choices: [" "],
  prompt: "<p>Luego de apretar la tecla <i>espacio</i> gire la cabeza hacia la izquierda, a medio camino entre mirar hacia el frente y hacia el hombro, como muestra el video.</p>",
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  choices: [" "],
  stimulus: "Luego de girar la cabeza, presione espacio para continuar",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: 20000,
})

timeline.push({
  type: jsPsychVideoKeyboardResponse,
  stimulus: ['arriba.mp4'],
  choices: [" "],
  prompt: "<p>Luego de apretar la tecla <i>espacio</i> gire la cabeza mirando al techo como muestra el video.</p>",
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  choices: [" "],
  stimulus: "Luego de girar la cabeza, presione espacio para continuar",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: 20000,
})

timeline.push({
  type: jsPsychVideoKeyboardResponse,
  stimulus: ['arriba2.mp4'],
  choices: [" "],
  prompt: "<p>Luego de apretar la tecla <i>espacio</i> gire la cabeza, fijando la mirada por encima del monitor, como muestra el video.</p>",
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  choices: [" "],
  stimulus: "Luego de girar la cabeza, presione espacio para continuar",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: 20000,
})

timeline.push({
  type: jsPsychVideoKeyboardResponse,
  stimulus: ['abajo.mp4'],
  choices: [" "],
  prompt: "<p>Luego de apretar la tecla <i>espacio</i> gire la cabeza mirando su ombligo como muestra el video.</p>",
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  choices: [" "],
  stimulus: "Luego de girar la cabeza, presione espacio para continuar",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: 20000,
})

timeline.push({
  type: jsPsychVideoKeyboardResponse,
  stimulus: ['abajo2.mp4'],
  choices: [" "],
  prompt: "<p>Luego de apretar la tecla <i>espacio</i> gire la cabeza mirando su ombligo como muestra el video.</p>",
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  choices: [" "],
  stimulus: "Luego de girar la cabeza, presione espacio para continuar",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: 20000,
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>
      Fin del experimento. Presione la tecla <i>espacio</i> y espere unos segundos a
      que la pantalla quede en blanco. Luego podra cerrar la pestaña. <br>
      Muchas gracias por participar c:
    </p>
    `,
  choices: [" "],
})
timeline.push({ type: rastocJSPsych.EventsTrackingStop });

// Start the experiment
jsPsych.run(timeline);
