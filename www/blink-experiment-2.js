const jsPsych = initJsPsych({
  on_finish: function() {
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
  
  timeline.push({
    type: jsPsychInitializeCamera
  });
	timeline.push({
    type: jsPsychWebgazerInitCamera
  });
	timeline.push({
    type: rastocJSPsych.EventsTrackingStart
  });
	timeline.push({
    type: jsPsychFullscreen
	});
	timeline.push(
		rastocJSPsych.ensureCalibration({
			performValidation: true,
			forceCalibration: true,
			maxRetries: 0,
		})
  );

	timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>
    In the next experiment you have to:<br>
      1. Blink five times in quick succession.<br>
      2. Wait 2 seconds.<br>
      3. Blink five times in quick succession. <br>
    You have 20 seconds, if finish early hit the spacebar<br>
    Press <i>continue</i> to start experiment.<br>
    </p>
    `,
    choices: ["continue"],
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
    In the next experiment you have to:<br>
      1. Blink five times in a row in a relaxed manner.<br>
      2. Wait 2 seconds.<br>
      3. Blink five times in a row in a relaxed manner. <br>
    You have 20 seconds, if finish early hit the spacebar<br>
    Press <i>continue</i> to start experiment.<br>
    </p>
    `,
    choices: ["continue"],
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
    In the next experiment you have to:<br>
      1. Blink for 1 second.<br>
      2. Wait 2 seconds.<br>
      3. Blink for 1 second.  <br>
    You have 20 seconds, if finish early hit the spacebar<br>
    Press <i>continue</i> to start experiment.<br>
    </p>
    `,
    choices: ["continue"],
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
    In the next experiment you have to:<br>
      1. Look at the camera for 10 seconds.<br>
      2. Look around without head motions for 10 seconds.<br>
      3. Look around with head motions for 10 seconds.  <br>
    You have 20 seconds, if finish early hit the spacebar<br>
    Press <i>continue</i> to start experiment.<br>
    </p>
    `,
    choices: ["continue"],
  })

	timeline.push({
		type: jsPsychHtmlKeyboardResponse,
		choices: " ",
		stimulus: dot_html,
		extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
		trial_duration: 32000,
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