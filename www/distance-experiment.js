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
  resize_units: "none",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
});

timeline.push({
  type: jsPsychVirtualChinrest,
  blindspot_reps: 3,
  resize_units: "none",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
});

timeline.push({
  type: jsPsychVirtualChinrest,
  blindspot_reps: 3,
  resize_units: "none",
  extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
});

timeline.push({ type: rastocJSPsych.EventsTrackingStop });

// Start the experiment
jsPsych.run(timeline);