const jsPsych = initJsPsych({
  on_finish: function () {
    jsPsych.data.displayData();
    jsPsych.data.get().localSave(
      'csv',
      `distance-experiment-expose-points${(new Date).toISOString()}.csv`
    );
  },
  extensions: [{ type: jsPsychExtensionWebgazer }],
});

// Define the experiment timeline
var timeline = [];

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
  viewing_distance_report: "Según tus respuestas, estás sentado aproximadamente a <span id='distance-estimate' style='font-weight: bold;'></span> de la pantalla. ¿Te parece correcto?",
  blindspot_measurements_prompt: "Mediciones restantes.",
  blindspot_done_prompt: "Si",
  redo_measurement_button_label: "No, eso no está cerca. Intentar de nuevo.",
  blindspot_prompt: "Ahora mediremos rápidamente a qué distancia estás sentado. Coloca tu mano izquierda en la barra espaciadora. Cubre tu ojo derecho con tu mano derecha. Con tu ojo izquierdo, enfócate en el cuadrado negro. Mantén tu enfoque en el cuadrado negro. La bola roja desaparecerá mientras se mueve de derecha a izquierda. Presiona la barra espaciadora tan pronto como la bola desaparezca. Presiona la barra espaciadora cuando estés listo para comenzar.",
  adjustment_button_prompt: "Haz clic aquí cuando la imagen tenga el tamaño correcto.",
  adjustment_prompt: "Haz clic y arrastra la esquina inferior derecha de la imagen hasta que sea del mismo tamaño que una tarjeta de crédito sostenida frente a la pantalla. Puedes usar cualquier tarjeta que tenga el mismo tamaño que una tarjeta de crédito, como una tarjeta de membresía o una licencia de conducir. Si no tienes acceso a una tarjeta real, puedes usar una regla para medir el ancho de la imagen a 3.37 pulgadas o 85.6 mm.",
  resize_units: "none",
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
  adjustment_prompt: "Haz clic y arrastra la esquina inferior derecha de la imagen hasta que sea del mismo tamaño que una tarjeta de crédito sostenida frente a la pantalla. Puedes usar cualquier tarjeta que tenga el mismo tamaño que una tarjeta de crédito, como una tarjeta de membresía o una licencia de conducir. Si no tienes acceso a una tarjeta real, puedes usar una regla para medir el ancho de la imagen a 3.37 pulgadas o 85.6 mm.",
  resize_units: "none",
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
  adjustment_prompt: "Haz clic y arrastra la esquina inferior derecha de la imagen hasta que sea del mismo tamaño que una tarjeta de crédito sostenida frente a la pantalla. Puedes usar cualquier tarjeta que tenga el mismo tamaño que una tarjeta de crédito, como una tarjeta de membresía o una licencia de conducir. Si no tienes acceso a una tarjeta real, puedes usar una regla para medir el ancho de la imagen a 3.37 pulgadas o 85.6 mm.",
  resize_units: "none",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
});

timeline.push({ type: rastocJSPsych.EventsTrackingStop });

// Start the experiment
jsPsych.run(timeline);