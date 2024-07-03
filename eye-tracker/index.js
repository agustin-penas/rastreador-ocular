import { Point, BBox, MultiBBox } from './lib/types/index.js';
import getVideoFrames from "./lib/video/index.js";

class EyesFeatures {
  constructor(bboxes) {
    this.bboxes = {
      left: bboxes.left,
      right: bboxes.right,
    }
  }
  static fromWGEyesFeatures(wgEyesFeature) {
    const bboxes = {};
    ['left', 'right'].forEach(side => {
      const {
        imagex, imagey, width, height
      } = wgEyesFeature[side];
      bboxes[side] = new BBox(
        new Point(imagex, imagey),
        width,
        height
      );
    })
    return new EyesFeatures(bboxes);
  }
}

const STILLNESS_RESIZE_FACTOR = 2.3;
class StillnessChecker {
  constructor(calibrationEyesFeatures) {
    const calibrationBBoxes = calibrationEyesFeatures.map(ef => ef.bboxes)

    this.stillnessMultiBBoxes = {};
    ['left', 'right'].forEach(side => {
      const sideBBoxes = calibrationBBoxes.map(ftr => ftr[side]).filter(x => !!x);
      if (sideBBoxes.length === 0) {
        throw new Error(`Missing bboxes for ${side} eye.`);
      }

      this.stillnessMultiBBoxes[side] = new MultiBBox(sideBBoxes.map((
        bbox
      ) => BBox.createResizedFromCenter(bbox, STILLNESS_RESIZE_FACTOR)));
    });
  }
  areEyesInOriginalPosition(eyesFeatures) {
    return ['left', 'right'].every((
      side
    ) => this.stillnessMultiBBoxes[side].contains(eyesFeatures.bboxes[side]));
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  if (typeof webgazer === 'undefined' || !window.webgazer) {
    console.error(
      'WebGazer was not found. Make sure the js file has been loaded.'
    );
    document.dispatchEvent(new Event('rastoc:webgazer-not-found'));
    return;
  }
  document.dispatchEvent(new Event('rastoc:webgazer-found'));
});

const state = {
  calibrating: false,
  // list of features corresponding to the ones from last frame each time a
  // calibration point was added
  calibrationEyesFeatures: [],
  // eye features from last frame
  lastFrameEyesFeatures: null,
  calibrationIsNeeded: true,
  events: null,
  //list of elements {frame: a, x: b, y: c} where a is a frame for calibration, (b,c)
  framesForCalibration: [],
  pointForCalibration: { x:0, y:0},
  //object {from:x0, to:x1} where x0 and x1 are the frames from and to to predict
  videoPredictionLapse: null,
  videoFrameIndex: 0,
  videoFramePredictionData: [],
  videoFrameCount: 0
};

const mapCoordinateToGaze = ({ x, y }) => {
  if (!state.calibrating) {
    console.warn('Can not calibrate outside of calibration phases');
    return;
  }
  if (!state.lastFrameEyesFeatures) {
    console.warn('Calibration was not performed due to missing eye features.');
    return;
  }
  webgazer.recordScreenPosition(x, y, 'click');
  state.calibrationEyesFeatures.push(state.lastFrameEyesFeatures);
  document.dispatchEvent(new CustomEvent('rastoc:point-calibrated', {
    detail: { x, y },
  }));
};

document.addEventListener('webgazer:eye-features-update', ({
  detail: wgEyesFeature,
}) => {
  const eyeFeaturesJustWereAvailable = !!state.lastFrameEyesFeatures;
  state.lastFrameEyesFeatures = null;
  if (wgEyesFeature) {
    const eyesFeatures = EyesFeatures.fromWGEyesFeatures(wgEyesFeature);
    state.lastFrameEyesFeatures = eyesFeatures;
    document.dispatchEvent(new CustomEvent('rastoc:eye-features-update', {
      detail: eyesFeatures,
    }))
  }

  if (wgEyesFeature && !eyeFeaturesJustWereAvailable) {
    document.dispatchEvent(new Event('rastoc:eye-features-went-available'));
  }
  if (!wgEyesFeature && eyeFeaturesJustWereAvailable) {
    document.dispatchEvent(new Event('rastoc:eye-features-went-unavailable'));
  }
});

const startDecalibrationCriteriaCheck = () => {
  state.calibrationIsNeeded = false;
  const decalibrationDetectedHandler = () => {
    state.calibrationIsNeeded = true;
    document.removeEventListener('rastoc:stillness-position-lost', decalibrationDetectedHandler);
    document.removeEventListener('rastoc:resetting-calibration', calibrationResetHandler);
    document.dispatchEvent(new Event('rastoc:decalibration-detected'));
  };
  const calibrationResetHandler = () => {
    state.calibrationIsNeeded = true;
    document.removeEventListener('rastoc:stillness-position-lost', decalibrationDetectedHandler);
    document.removeEventListener('rastoc:resetting-calibration', calibrationResetHandler);
  };
  document.addEventListener('rastoc:stillness-position-lost', decalibrationDetectedHandler);
  document.addEventListener('rastoc:resetting-calibration', calibrationResetHandler);
};

const startMovementDetection = (stillnessChecker) => {
  let calibrationLost = false;
  let previousFrameWasOutOfPlace = false;
  const frameHandler = ({ detail: eyesFeatures }) => {
    const currentFrameIsOutOfPlace = !stillnessChecker.areEyesInOriginalPosition(
      eyesFeatures
    );

    if (previousFrameWasOutOfPlace && !currentFrameIsOutOfPlace) {
      document.dispatchEvent(new Event('rastoc:stillness-position-recovered'));
    } else if (!previousFrameWasOutOfPlace && currentFrameIsOutOfPlace) {
      document.dispatchEvent(new Event('rastoc:stillness-position-lost'));
    }
    previousFrameWasOutOfPlace = currentFrameIsOutOfPlace;
  }
  document.addEventListener('rastoc:eye-features-update', frameHandler);
  const finishUpHandler = () => {
    document.removeEventListener('rastoc:eye-features-update', frameHandler);
    document.removeEventListener('rastoc:resetting-calibration', finishUpHandler);
  }
  document.addEventListener('rastoc:resetting-calibration', finishUpHandler);
}

const showGazeEstimation = () => {
  webgazer.showPredictionPoints(true);
}
const hideGazeEstimation = () => {
  webgazer.showPredictionPoints(false);
}

const clickToGazeCalibrationHandler = ({ clientX, clientY }) => {
  mapCoordinateToGaze({
    x: clientX,
    y: clientY,
  })
};

const getPayloadLessHandler = (eventName) => () => {
  state.events.push({
    timestamp: (new Date).toISOString(),
    event_name: eventName,
  });
}
const eventsHandlers = [
  'rastoc:decalibration-detected',
  'rastoc:stillness-position-recovered',
  'rastoc:stillness-position-lost',
  'rastoc:resetting-calibration',
  'rastoc:calibration-started',
  'rastoc:calibration-succeeded',
  'rastoc:calibration-failed',
  'rastoc:validation-started',
  'rastoc:validation-failed',
  'rastoc:validation-succeeded',
].map((eventName) => [eventName, getPayloadLessHandler(eventName)]).concat([
  [
    'rastoc:point-calibrated',
    ({ detail: { x, y } }) => state.events.push({
      timestamp: (new Date).toISOString(),
      event_name: 'rastoc:point-calibrated',
      x,
      y,
    }),
  ]
]);
const startTrackingEvents = () => {
  if (state.events !== null) {
    throw new Error('Events are already being tracked.');
  }
  state.events = [];
  eventsHandlers.forEach(([eventName, handler]) => {
    document.addEventListener(eventName, handler);
  })
};
const stopTrackingEvents = () => {
  eventsHandlers.forEach(([eventName, handler]) => {
    document.removeEventListener(eventName, handler);
  })
  const events = state.events;
  state.events = null;
  return events;
};

const setPointForCalibration = (point) => {
  state.pointForCalibration = point
}

const setframesForCalibration = (frames) => {
  console.log("setting frames to calibrate: " + frames)
  console.log("where 2nd element is: " + frames[2].frame + " " + frames[2].x + " " + frames[2].y)
  state.framesForCalibration = frames
}

const setPredictionLapse = (lapse) => {
  console.log("setting lapse to predict from: " + lapse.from + ", to: " + lapse.to)
  state.videoPredictionLapse = lapse
}

const resetVideoFrameData = () => {
  state.videoFrameIndex = 0;
  state.videoPredictionLapse = null;
  state.framesForCalibration = [];
  state.calibrationIsNeeded = true;
}

const resetVideoFramePredictionData = () => {
  state.videoFramePredictionData = [];
}

const onFrameCalibrationLoop = async (frame) => {
  const index = state.videoFrameIndex;
  const calibrationFrame = getCalibrationFrame(index);
  console.log("index: " + index);
  if ( calibrationFrame != undefined ) {
    console.log("calibrationFrame: " + state.pointForCalibration.y);
    state.calibrationIsNeeded = true;
    await webgazer.eyePatchesForFrame(frame)
    await webgazer.recordScreenPosition(state.pointForCalibration.x, state.pointForCalibration.y, 'click')
  }

  frame.close();
  state.videoFrameIndex++;
}

const onFramePredictionLoop = async (frame) => {
  const index = state.videoFrameIndex;

  console.log("state.videoPredictionLapse.from" + state.videoPredictionLapse.from)
  console.log("state.videoPredictionLapse.to" + state.videoPredictionLapse.to)

  if (index >= state.videoPredictionLapse.from && index < state.videoPredictionLapse.to) {
    //si ya terminamos de calibrar y es empieza prediction lapse, calculamos regressionCoefficients
    if(state.calibrationIsNeeded) {
      await webgazer.computeRegressionCoefficients();
      //calibracion terminada
      state.calibrationIsNeeded = false;
    }

    console.log("entering eyePatchesForFrame")
    await webgazer.eyePatchesForFrame(frame)
    const gazeData = await webgazer.getCurrentPrediction()
    var d = {
      x: Math.round(gazeData.x),
      y: Math.round(gazeData.y),
      t: 0,
      b: gazeData.eyeFeatures.isBlink,
      oLR: gazeData.eyeFeatures.outOfPlaneLR,
      oTB: gazeData.eyeFeatures.outOfPlaneTB,
      dz: gazeData.eyeFeatures.distanceToCamera,
      f: index,
    };
    state.videoFramePredictionData.push(d);
  }
  frame.close();
  state.videoFrameIndex++;
}

const getCalibrationFrame = (index) => {
  return state.framesForCalibration.find(calibrationFrame => calibrationFrame.frame == index);
}

const getVideoFramePredictionData = () => {
  return state.videoFramePredictionData;
}

window.rastoc = {
  showGazeEstimation,
  hideGazeEstimation,
  startCalibrationPhase(calibrationType) {
    calibrationType = calibrationType || "click";
    if (!["click", "external"].includes(calibrationType)) {
      throw new Error(`calibration type (${calibrationType}) is not valid.`);
    }

    state.calibrating = true;
    document.dispatchEvent(new Event('rastoc:resetting-calibration'));
    webgazer.clearData();
    state.calibrationEyesFeatures = [];
    webgazer.resume();
    hideGazeEstimation();

    // If this action was started by a click event (eg, clicking a start button)
    // then the events being added here will be called once. Because of that,
    // the click listeners have to be added after this click event finishes.
    // Ideally something like setImmediate could be used here but it does not
    // yet seem to be supported by most browsers.
    setTimeout(() => {
      if (calibrationType === "click") {
        document.addEventListener('click', clickToGazeCalibrationHandler);
      }

      document.dispatchEvent(new Event('rastoc:calibration-started'));
    }, 0);

    let res;
    if (calibrationType === "external") {
      res = ({ x, y }) => {
        mapCoordinateToGaze(new Point(x, y));
      };
    }
    return res;
  },
  endCalibrationPhase(calibrationType) {
    calibrationType = calibrationType || "click";
    if (!["click", "external"].includes(calibrationType)) {
      throw new Error(`calibration type (${calibrationType}) is not valid.`);
    }

    if (calibrationType === "click") {
      document.removeEventListener('click', clickToGazeCalibrationHandler);
    }

    let stillnessChecker;
    let correctlyCalibrated = false;
    if (state.calibrationEyesFeatures.length === 0) {
      console.error('calibration failed: no training points were provided')
    } else {
      try {
        webgazer.computeRegressionCoefficients();
        stillnessChecker = new StillnessChecker(state.calibrationEyesFeatures);
        correctlyCalibrated = true;
      } catch (e) {
        console.error('calibration failed:', e);
      }
    }

    if (correctlyCalibrated) {
      startMovementDetection(stillnessChecker);
      startDecalibrationCriteriaCheck();
      document.dispatchEvent(new CustomEvent('rastoc:calibration-succeeded', {
        detail: {
          stillnessMultiBBoxes: stillnessChecker.stillnessMultiBBoxes,
        },
      }));
    } else {
      document.dispatchEvent(new Event('rastoc:calibration-failed'));
    }
    state.calibrating = false;
  },
  get isCorrectlyCalibrated() {
    return !state.calibrationIsNeeded;
  },
  get calibrationPointsCount() {
    return state.calibrationEyesFeatures.length;
  },
  startTrackingEvents,
  stopTrackingEvents,
  startTrackingVideoCalibration(videoUrl, onFrameCall, onConfigCall) {
    state.videoFrameIndex = 0;
    getVideoFrames({
      videoUrl,
      async onFrame(frame) {  // `frame` is a VideoFrame object: https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame
        //onFrameCall(frame);
        await onFrameCalibrationLoop(frame);
      },
      onConfig(config) {
        onConfigCall(config);
      },
    });
  },
  startTrackingVideoPrediction(videoUrl, onFrameCall, onConfigCall) {
    state.videoFrameIndex = 0;
    getVideoFrames({
      videoUrl,
      async onFrame(frame) {  // `frame` is a VideoFrame object: https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame
        //onFrameCall(frame);
        await onFramePredictionLoop(frame);
      },
      onConfig(config) {
        onConfigCall(config);
      },
    });
  },
  clearFrameCount() {
    state.videoFrameCount=0;
  },
  async calcVideoFrameCount(videoUrl) {
   await getVideoFrames({
      videoUrl,
      onFrame(frame) {  // `frame` is a VideoFrame object: https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame
        //onFrameCall(frame);
       state.videoFrameCount++
       console.log("llevamos: "+ state.videoFrameCount + " frames")
       frame.close();
      },
      onConfig(config) {
        
      },
    });
  },
  getVideoFrameCount(){
    return state.videoFrameCount;
  },
  setframesForCalibration,
  setPointForCalibration,
  setPredictionLapse,
  resetVideoFrameData,
  resetVideoFramePredictionData,
  getVideoFramePredictionData
};
