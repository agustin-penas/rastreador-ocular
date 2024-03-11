    // Define locations for stimuli
    var stimulusLocations = [
      { x: 100, y: 100 },
      { x: 300, y: 100 },
      { x: 100, y: 300 },
      { x: 300, y: 300 }
  ];
  const jsPsych = initJsPsych({
    on_finish: function() {
      jsPsych.data.displayData();
      jsPsych.data.get().localSave(
        'csv',
        `blink-experiment-${(new Date).toISOString()}.csv`
      );
    },
    //extensions: [{ type: jsPsychExtensionWebgazer }],
  });


  // Initialize jsPsych timeline
  var timeline = [];

  timeline.push({
    type: jsPsychInitializeCamera
  });

  // Add webcam recording trial
  timeline.push({
      type: jsPsychHtmlVideoResponse,
      stimulus: '<div id="jspsych-html-video-response-stimulus" class="jspsych-html-video-response-stimulus" style="display: none;"></div>',
      choices: ['space'],
      prompt: "<p>Please click on the red circles while looking into the webcam.</p>",
      save_video_url: true,
      on_finish: function(data) {
          //var response = JSON.parse(data.response);
          //console.log("Video recorded:", response.filename);
      }
  });

  // Add trials for clicking on stimuli
  for (var i = 0; i < 4; i++) {
      timeline.push({
          type: jsPsychHtmlKeyboardResponse,
          stimulus: '<div class="stimulus" id="stimulus' + i + '"></div>',
          choices: "NO_KEYS",
          trial_duration: 2000, // Time for each stimulus presentation
          on_start: function(trial) {
              var index = parseInt(trial.stimulus.substr(-1)); // Extract stimulus index from stimulus ID
              var location = stimulusLocations[index];
              trial.stimulus += '<style>#stimulus' + index + '{top:' + location.y + 'px;left:' + location.x + 'px;}</style>';
          },
          on_finish: function(data) {
              console.log("Clicked stimulus:", data.stimulus.substr(-1));
          }
      });
  }

  // Start the experiment
	jsPsych.run(timeline);