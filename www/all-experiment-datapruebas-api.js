
const queryParams = new URLSearchParams(window.location.search);
let run_id = queryParams.get('run-id');
let redirect_url = "https://datapruebas.org"

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}


// Function to finalize the experiment
async function finalizeExperiment() {
  if (!run_id) {
      console.error("Error: run-id is missing. Experiment cannot proceed.");
      alert("Error: run-id is missing. Please restart the experiment.");
      return;
  }

  let recordDataUrl = `https://datapruebas.org/dj/api/v1/record_data/${run_id}/`;
  let endRunUrl = `https://datapruebas.org/dj/api/v1/end_run/${run_id}/`;

  try {
      // Step 1: Record experiment data
      experimentData = jsPsych.data.get().json()

      console.log("Tamaño del JSON:", experimentData.length, "caracteres (~", (experimentData.length / 1024).toFixed(1), "KB )");

      let recordResponse = await fetch(recordDataUrl, {
          method: 'POST',
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "X-CSRFToken": getCookie("csrftoken"),
          },
          
          body: JSON.stringify({ "data": experimentData })
      });

      if (!recordResponse.ok) {
          throw new Error(`Failed to record data. Status: ${recordResponse.status}`);
      }

      console.log("Data recorded successfully.");

      // Step 2: End the experiment (only if Step 1 succeeded)
      let endResponse = await fetch(endRunUrl, {
          method: 'POST',
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "X-CSRFToken": getCookie("csrftoken"),
          },
          body: JSON.stringify({ "score": 0 })
      });

      if (!endResponse.ok) {
          throw new Error(`Failed to end experiment. Status: ${endResponse.status}`);
      }

      console.log("Experiment successfully ended.");

      // Step 3: Redirect after confirmation
      document.body.innerHTML = '<p>Enviando datos, espere por favor ...</p>';
      setTimeout(() => window.location.href = redirect_url, 5000); 

  } catch (error) {
      console.error("Error during experiment finalization:", error);
      alert("Ocurrió un error guardando los datos. Por favor, verifica tu conexión e inténtalo nuevamente.");
  }
}

// Initialize jsPsych
const jsPsych = initJsPsych({
  on_finish: finalizeExperiment, // Call finalizeExperiment when experiment finishes
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
      Corregí la posición de la webcam para que se alinee con tus ojos y estos
      queden bien enfocados. Tu cabeza debería quedar en el centro del
      recuadro que aparece acá arriba.
      <br>
      Itentá que tus ojos se distingan correctamente. Si tenés luces atrás
      tuyo probá apagarlas.
    </p>
    <p>
      Cuando el recuadro se pinte de verde podrás hacer click en
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
      Para evitar distracciones te pedimos también que durante el experimento cierres aplicaciones que
      generen notificaciones y pongas el teléfono en modo "no molestar".
      <br>
      Además vamos a cambiar a pantalla completa.
    </p>
  </div>`,
  button_label: "continuar",
});

timeline.push({
  type: jsPsychVirtualChinrest,
  blindspot_reps: 3,
  viewing_distance_report: "Según tus respuestas, estás sentado aproximadamente a <span id='distance-estimate' style='font-weight: bold;'></span> de la pantalla ¿Te parece correcto?",
  blindspot_measurements_prompt: "Mediciones restantes.",
  blindspot_done_prompt: "Si",
  redo_measurement_button_label: "No, eso no está cerca. Intentar de nuevo.",
  blindspot_prompt: "Ahora mediremos rápidamente a qué distancia estás sentado. Colocá tu mano izquierda en la barra espaciadora. Cubrí tu ojo derecho con tu mano derecha. Con tu ojo izquierdo, enfocá en el cuadrado negro. Mantené tu enfoque en el cuadrado negro. La bola roja desaparecerá mientras se mueve de derecha a izquierda. Presioná la barra espaciadora tan pronto como la bola desaparezca. Presioná la barra espaciadora cuando estés listo para comenzar.",
  adjustment_button_prompt: "Hacé clic acá cuando la imagen tenga el tamaño correcto.",
  adjustment_prompt: "<p>El experimento se repetira 3 veces (3/3).</p>Hacé clic y arrastrá <span style='color:red; font-weight: bold;'>la esquina inferior derecha de la imagen (indicada en color rojo)</span> hasta que sea del mismo tamaño que una tarjeta de crédito sostenida frente a la pantalla. Podés usar cualquier tarjeta que tenga el mismo tamaño que una tarjeta de crédito, como una tarjeta de de débito o la SUBE. Si no tenés acceso a una tarjeta real, podés usar una regla para medir el ancho de la imagen a 8.5 cm.<br><br>",
  resize_units: "none",
  item_path:"card.png",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
});

timeline.push({
  type: jsPsychVirtualChinrest,
  blindspot_reps: 3,
  viewing_distance_report: "Según tus respuestas, estás sentado aproximadamente a <span id='distance-estimate' style='font-weight: bold;'></span> de la pantalla ¿Te parece correcto?",
  blindspot_measurements_prompt: "Mediciones restantes.",
  blindspot_done_prompt: "Si",
  redo_measurement_button_label: "No, eso no está cerca. Intentar de nuevo.",
  blindspot_prompt: "Ahora mediremos rápidamente a qué distancia estás sentado. Colocá tu mano izquierda en la barra espaciadora. Cubrí tu ojo derecho con tu mano derecha. Con tu ojo izquierdo, enfocá en el cuadrado negro. Mantené tu enfoque en el cuadrado negro. La bola roja desaparecerá mientras se mueve de derecha a izquierda. Presioná la barra espaciadora tan pronto como la bola desaparezca. Presioná la barra espaciadora cuando estés listo para comenzar.",
  adjustment_button_prompt: "Hacé clic acá cuando la imagen tenga el tamaño correcto.",
  adjustment_prompt: "<p>El experimento se repetira 3 veces (3/3).</p>Hacé clic y arrastrá <span style='color:red; font-weight: bold;'>la esquina inferior derecha de la imagen (indicada en color rojo)</span> hasta que sea del mismo tamaño que una tarjeta de crédito sostenida frente a la pantalla. Podés usar cualquier tarjeta que tenga el mismo tamaño que una tarjeta de crédito, como una tarjeta de de débito o la SUBE. Si no tenés acceso a una tarjeta real, podés usar una regla para medir el ancho de la imagen a 8.5 cm.<br><br>",
  resize_units: "none",
  item_path:"card.png",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
});

timeline.push({
  type: jsPsychVirtualChinrest,
  blindspot_reps: 3,
  viewing_distance_report: "Según tus respuestas, estás sentado aproximadamente a <span id='distance-estimate' style='font-weight: bold;'></span> de la pantalla ¿Te parece correcto?",
  blindspot_measurements_prompt: "Mediciones restantes.",
  blindspot_done_prompt: "Si",
  redo_measurement_button_label: "No, eso no está cerca. Intentar de nuevo.",
  blindspot_prompt: "Ahora mediremos rápidamente a qué distancia estás sentado. Colocá tu mano izquierda en la barra espaciadora. Cubrí tu ojo derecho con tu mano derecha. Con tu ojo izquierdo, enfocá en el cuadrado negro. Mantené tu enfoque en el cuadrado negro. La bola roja desaparecerá mientras se mueve de derecha a izquierda. Presioná la barra espaciadora tan pronto como la bola desaparezca. Presioná la barra espaciadora cuando estés listo para comenzar.",
  adjustment_button_prompt: "Hacé clic acá cuando la imagen tenga el tamaño correcto.",
  adjustment_prompt: "<p>El experimento se repetira 3 veces (3/3).</p>Hacé clic y arrastrá <span style='color:red; font-weight: bold;'>la esquina inferior derecha de la imagen (indicada en color rojo)</span> hasta que sea del mismo tamaño que una tarjeta de crédito sostenida frente a la pantalla. Podés usar cualquier tarjeta que tenga el mismo tamaño que una tarjeta de crédito, como una tarjeta de de débito o la SUBE. Si no tenés acceso a una tarjeta real, podés usar una regla para medir el ancho de la imagen a 8.5 cm.<br><br>",
  resize_units: "none",
  item_path:"card.png",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  on_finish: function(data){
    console.log(data)
    console.log("run_id:", run_id)
    experimentData = jsPsych.data.get().json()
    console.log("Tamaño del JSON:", experimentData.length, "caracteres (~", (experimentData.length / 1024).toFixed(1), "KB )");


    // let url = `https://datapruebas.org/dj/api/v1/record_data/${run_id}/`;
    // fetch(url, {
    //     method: 'POST',
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json',
    //         "X-CSRFToken": getCookie("csrftoken"),
    //     },
    //     body: JSON.stringify({ "data": experimentData })
    // }).then(response => console.log(JSON.stringify(response)));
  }
});


//***************************** */
// EMPIEZAN BLINK

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
    Tenés 20 segundos, si terminás antes podés apretar la tecla <i>espacio</i>.<br>
    Presioná la tecla <i>espacio</i> para iniciar el experimento.<br>
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
    Tenés 20 segundos, si termina antes puede apretar la tecla <i>espacio</i>.<br>
    Presioná la tecla <i>espacio</i> para iniciar el experimento.<br>
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
      1. Cerrá los ojos por 2 segundos.<br>
      2. Esperá 4 segundos.<br>
      3. Cerrá los ojos por otros 2 segundos.<br>
    Tenés 20 segundos, si terminás antes podés apretar la tecla <i>espacio</i>.<br>
    Presioná la tecla <i>espacio</i> para iniciar el experimento.<br>
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
    Tenés 20 segundos, si terminás antes podés apretar la tecla <i>espacio</i>.<br>
    Presioná la tecla <i>espacio</i> para iniciar el experimento.<br>
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
    Tenés 20 segundos, si terminás antes podés apretar la tecla <i>espacio</i>.<br>
    Presioá la tecla <i>espacio</i> para iniciar el experimento.<br>
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
    En el proximo experimento deberás:<br>
      1. Mover la mirada por toda la pantalla MOVIENDO LA CABEZA y además pestañeando 10 veces.  <br>
    Tenés 20 segundos, si terminás antes podés apretar la tecla <i>espacio</i>.<br>
    Presioná la tecla <i>espacio</i> para iniciar el experimento.<br>
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
  on_finish: function(data){
    experimentData = jsPsych.data.get().json()
    let url = `https://datapruebas.org/dj/api/v1/record_data/${run_id}/`;
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
})


//***************************** */
// EMPIEZAN ROTATION

timeline.push({
  type: jsPsychVideoKeyboardResponse,
  stimulus: ['derecha_hombro.mp4'],
  choices: [" "],
  prompt: "<p>Luego de apretar la tecla <i>espacio</i> girá la cabeza hacia tu hombro derecho como muestra el video.</p>",
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  choices: [" "],
  stimulus: "Luego de girar la cabeza, presioná espacio para continuar",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: 20000,
})

timeline.push({
  type: jsPsychVideoKeyboardResponse,
  stimulus: ['derecha.mp4'],
  choices: [" "],
  prompt: "<p>Luego de apretar la tecla <i>espacio</i> girá la cabeza hacia la derecha, a medio camino entre mirar hacia el frente y hacia el hombro, como muestra el video.</p>",
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  choices: [" "],
  stimulus: "Luego de girar la cabeza, presioná espacio para continuar",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: 20000,
})

timeline.push({
  type: jsPsychVideoKeyboardResponse,
  stimulus: ['izquierda_hombro.mp4'],
  choices: [" "],
  prompt: "<p>Luego de apretar la tecla <i>espacio</i> girá la cabeza hacia el hombro izquierdo como muestra el video.</p>",
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
  prompt: "<p>Luego de apretar la tecla <i>espacio</i> girá la cabeza hacia la izquierda, a medio camino entre mirar hacia el frente y hacia el hombro, como muestra el video.</p>",
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  choices: [" "],
  stimulus: "Luego de girar la cabeza, presioná espacio para continuar",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: 20000,
})

timeline.push({
  type: jsPsychVideoKeyboardResponse,
  stimulus: ['arriba.mp4'],
  choices: [" "],
  prompt: "<p>Luego de apretar la tecla <i>espacio</i> suba la cabeza mirando al techo como muestra el video.</p>",
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  choices: [" "],
  stimulus: "Luego de girar la cabeza, presioná espacio para continuar",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: 20000,
})

timeline.push({
  type: jsPsychVideoKeyboardResponse,
  stimulus: ['arriba2.mp4'],
  choices: [" "],
  prompt: "<p>Luego de apretar la tecla <i>espacio</i> suba la cabeza levemente, fijando la mirada por encima del monitor, como muestra el video.</p>",
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  choices: [" "],
  stimulus: "Luego de girar la cabeza, presioná espacio para continuar",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: 20000,
})

timeline.push({
  type: jsPsychVideoKeyboardResponse,
  stimulus: ['abajo.mp4'],
  choices: [" "],
  prompt: "<p>Luego de apretar la tecla <i>espacio</i> baje la cabeza mirando a su ombligo como muestra el video.</p>",
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  choices: [" "],
  stimulus: "Luego de girar la cabeza, presioná espacio para continuar",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: 20000,
})

timeline.push({
  type: jsPsychVideoKeyboardResponse,
  stimulus: ['abajo2.mp4'],
  choices: [" "],
  prompt: "<p>Luego de apretar la tecla <i>espacio</i> baje la cabeza levemente, fijando la mirada por encima del monitor, como muestra el video.</p>",
})

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  choices: [" "],
  stimulus: "Luego de girar la cabeza, presioná espacio para continuar",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
  trial_duration: 20000,

})
timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>
      Fin del experimento. Presioná la tecla <i>espacio</i> y esperá unos segundos hasta ser redirigido a la página de datapruebas. Luego podrás cerrar la pestaña. <br>
      Muchas gracias por participar!
    </p>
    `,
  choices: [" "],
})

timeline.push({ type: rastocJSPsych.EventsTrackingStop });

// Start the experiment
jsPsych.run(timeline);