// TODO: Export rastoc events
//         . create an object which captures rastoc events on an array and allow
//           them to be retrieved later on
//         . after each trial, add ocurred rastoc events to last trial so that
//           behavior is more consistent with the current webgazer events
// TODO: Check how to match js Date timestamps against JSP "time_elapsed" values
const createFreeCalibrationNode = () => {
  return {
    timeline: [{
      type: jsPsychHtmlKeyboardResponse,
      choices: [' '],
      stimulus: `
        <div>
          <h3>Free calibration</h3>
          <p>
            On the next screen you will be allowed to freely calibrate WebGazer.
            Each click you make will map your gaze to the coordinate of the
            click. <br>
            As many times as you want, stare at your cursor and perform a click. Do
            this in the regions of the screen you want WebGazer to estimate your
            gaze.
          </p>
          <p>
            You will be shown the gaze estimation while you add calibration
            points. Press <i>Space</i> to start. When you are satisfied press
            <i>Space</i> again to finish the calibration process.
          </p>
        </div>
        `,
      on_finish() {
        rastoc.startCalibrationPhase();
      },
    }, {
      type: jsPsychHtmlKeyboardResponse,
      choices: [' '],
      stimulus: '',
      on_finish() {
        rastoc.endCalibrationPhase();
      },
    }],
    loop_function() {
      return !rastoc.isCorrectlyCalibrated;
    },
  };
};

const createCalibrationBarrierNode = () => {
  return {
    conditional_function() {
      return !rastoc.isCorrectlyCalibrated;
    },
    timeline: [{
      type: jsPsychHtmlKeyboardResponse,
      choices: [' '],
      stimulus: `
      <p>
        Decalibration detected.
        Press <i>Space</i> to proceed with calibration
      <p>
      `,
    }, createFreeCalibrationNode()],
    loop_function() {
      return !rastoc.isCorrectlyCalibrated;
    }
  }
};

// TODO: Add side to side calibration
//         . allow calibration method to be chosen via a parameter
window.rastocJSPsych = {
  createFreeCalibrationNode,
  createCalibrationBarrierNode,
};

