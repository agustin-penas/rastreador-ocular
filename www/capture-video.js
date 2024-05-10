  const jsPsych = initJsPsych({
    on_finish: function() {
      jsPsych.data.displayData();
      jsPsych.data.get().localSave(
        'csv',
        `capture-video-${(new Date).toISOString()}.csv`
      );
    },
    extensions: [
      { type: jsPsychExtensionRecordVideo}
    ]
  });

  const init_camera = {
    type: jsPsychInitializeCamera
  };

  const trial = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<div id="target" style="width:250px; height: 250px; background-color: #333; position: relative; margin: 2em auto;">
        <div class="orbit" style="width:25px; height:25px; border-radius:25px;background-color: #f00; position: absolute; top:calc(50% - 12px); left:calc(50% - 12px);"></div>
      </div>
      <style>
        .orbit {
          transform: translateX(100px);
          animation: orbit 4s infinite;
        }
        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(100px);
          }
          100% {
            transform: rotate(360deg) translateX(100px);
          }
        }
      </style>`,
    choices: ['Done'],
    prompt: "<p>Video is recording. Click done after a few seconds.</p>",
    extensions: [
      {type: jsPsychExtensionRecordVideo}
    ]
  };

  const trialNoExt = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<div id="target" style="width:250px; height: 250px; background-color: #333; position: relative; margin: 2em auto;">
        <div class="orbit" style="width:25px; height:25px; border-radius:25px;background-color: #f00; position: absolute; top:calc(50% - 12px); left:calc(50% - 12px);"></div>
      </div>
      <style>
        .orbit {
          transform: translateX(100px);
          animation: orbit 4s infinite;
        }
        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(100px);
          }
          100% {
            transform: rotate(360deg) translateX(100px);
          }
        }
      </style>`,
    choices: ['Done'],
    prompt: "<p>Video is recording. Click done after a few seconds.</p>",
  };

  const timeline = [init_camera, trialNoExt, trial, trialNoExt];

  // Start the experiment
	jsPsych.run(timeline);