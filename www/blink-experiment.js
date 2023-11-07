const jsPsych = initJsPsych({
  on_finish: function() {
		jsPsych.data.displayData();
    jsPsych.data.get().localSave(
      'csv',
      `blink-experiment-${(new Date).toISOString()}.csv`
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

  // Create the trial
  var trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: dot_html,
    choices: [correct_response],
    trial_duration: dot_duration,
    data: {
      correct_response: correct_response
    },
		extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
    on_start: function(trial){
      // Change the color of the dot
      jsPsych.pluginAPI.setTimeout(function(){
        trial.stimulus = '<div style="width:50px;height:50px;border-radius:50%;background-color:green;"></div>';
      }, dot_duration/2);
    },
    on_finish: function(data){
      // Check if the correct response was made
      data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
    }
  };

  // Create the blink interval
  var blink_interval = {
    type: jsPsychCallFunction,
		extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
    func: function(){
      // Blink
      document.body.style.backgroundColor = 'white';
      jsPsych.pluginAPI.setTimeout(function(){
        document.body.style.backgroundColor = 'black';
      }, blink_duration/2);
    },
    timing_post_trial: dot_duration - blink_duration
  };

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
			maxRetries: 1,
		})
  );
  // Add the trial and interval to the timeline
 // for (var i = 0; i < trial_duration/dot_duration; i++){
   // timeline.push(trial);
    //timeline.push(blink_interval);
  //}
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
		extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
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
	for(let i=0 ; i<20 ; i++) {
	timeline.push({
		type: jsPsychHtmlKeyboardResponse,
		choices: "NO_KEYS",
		stimulus: dot_html,
		extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
		trial_duration: 1000,
	})

	timeline.push({
		type: jsPsychHtmlKeyboardResponse,
		choices: "NO_KEYS",
		stimulus: dot_green_html,
		extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
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