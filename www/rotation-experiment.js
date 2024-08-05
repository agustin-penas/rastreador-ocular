const jsPsych = initJsPsych({
  on_finish: function() {
		jsPsych.data.displayData();
    jsPsych.data.get().localSave(
      'csv',
      `rotation-experiment-expose-points${(new Date).toISOString()}.csv`
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
  

	timeline.push({
    type: jsPsychWebgazerInitCamera
  });
	timeline.push({
    type: rastocJSPsych.EventsTrackingStart
  });
	timeline.push({
    type: jsPsychFullscreen
	});
	/*timeline.push(
		rastocJSPsych.ensureCalibration({
			performValidation: true,
			forceCalibration: true,
			maxRetries: 0,
		})
  );*/

	timeline.push({
    type: jsPsychVideoButtonResponse,
    stimulus: ['video/derecha_hombro.mp4'],
    choices: ["continuar"],
    prompt: "<p>Luego de apretar el boton continuar gire la cabeza hacia su hombro derecho como muestra el video.</p>",
  })

	timeline.push({
		type: jsPsychHtmlKeyboardResponse,
		choices: " ",
		stimulus: dot_html,
		extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
		trial_duration: 20000,
	})

	timeline.push({
    type: jsPsychVideoButtonResponse,
    stimulus: ['video/derecha.mp4'],
    choices: ["continuar"],
    prompt: "<p>Luego de apretar el boton continuar gire la cabeza hacia la derecha como muestra el video.</p>",
  })

	timeline.push({
		type: jsPsychHtmlKeyboardResponse,
		choices: " ",
		stimulus: dot_html,
		extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
		trial_duration: 20000,
	})

	timeline.push({
    type: jsPsychVideoButtonResponse,
    stimulus: ['video/izquierda_hombro.mp4'],
    choices: ["continuar"],
    prompt: "<p>Luego de apretar el boton continuar gire la cabeza hacia el hombro izquierdo como muestra el video.</p>",
  })

	timeline.push({
		type: jsPsychHtmlKeyboardResponse,
		choices: " ",
		stimulus: dot_html,
		extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
		trial_duration: 20000,
	})

	timeline.push({
    type: jsPsychVideoButtonResponse,
    stimulus: ['video/izquierda.mp4'],
    choices: ["continuar"],
    prompt: "<p>Luego de apretar el boton continuar gire la cabeza hacia la izquierda como muestra el video.</p>",
  })

	timeline.push({
		type: jsPsychHtmlKeyboardResponse,
		choices: " ",
		stimulus: dot_html,
		extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
		trial_duration: 20000,
	})

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