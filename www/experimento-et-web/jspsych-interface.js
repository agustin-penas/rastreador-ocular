/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BBox": () => (/* binding */ BBox),
/* harmony export */   "MultiBBox": () => (/* binding */ MultiBBox),
/* harmony export */   "Point": () => (/* binding */ Point)
/* harmony export */ });
class Point {
  constructor(x, y) {
    if (isNaN(x) || isNaN(y)) {
      throw new Error(
        `Input coordinates are not numbers. Got x=${
          JSON.stringify(x)
        } and y=${
          JSON.stringify(y)
        }`
      );
    }
    this.x = x;
    this.y = y;
  }
  add(xDelta, yDelta) {
    return new Point(this.x + xDelta, this.y + yDelta);
  }
}

class BBox {
  constructor(origin, width, height) {
    this.origin = origin;  // `origin` is the top left coordinate of the bbox,
                           //  not the center of it
    this.width = width;
    this.height = height;
  }
  get center() {
    return this.origin
      .add(
        Math.round(this.width / 2),
        Math.round(this.height / 2)
      );
  }
  static createResizedFromCenter(bbox, scalingFactor) {
    const { width, height } = bbox;
    const newOrigin = bbox.center.add(
        -(Math.round(scalingFactor * width / 2)),
        -(Math.round(scalingFactor * height / 2))
      );
    return new BBox(
      newOrigin,
      width * scalingFactor,
      height * scalingFactor
    );
  }
  contains(point) {
    const { origin: { x, y }, width, height } = this;
    return (
      x       <= point.x &&
      point.x <= x + width
    ) && (
      y       <= point.y &&
      point.y <= y + height
    );
  }
  get corners() {
    return [
      this.origin,
      this.origin.add(this.width, 0),
      this.origin.add(0, this.height),
      this.origin.add(this.width, this.height),
    ];
  }
}

class MultiBBox {
  constructor(bboxes) {
    if (bboxes.length === 0) {
      throw new Error(
        `Can not create a multi bbox without bboxes.`
      );
    }
    this.bboxes = bboxes;
  }
  contains(inputBBox) {
    return inputBBox.corners.every((
      corner
    ) => this.bboxes.some(bbox => bbox.contains(corner)));
  }
} 



/***/ }),
/* 2 */,
/* 3 */,
/* 4 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shuffle": () => (/* binding */ shuffle)
/* harmony export */ });
const shuffle = (array) => {
  let currentIndex = array.length
  let randomIndex
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [
      array[currentIndex], array[randomIndex]
    ] = [
      array[randomIndex], array[currentIndex]
    ];
  }
  return array;
};


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_types_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _lib_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);



const getPsychophysicsCanvasCenter = () => {
  // This assumes the canvas is always present. Note that if you run multiple
  // psychophysics stimulus in the same jspsych trial, then the canvas will be a
  // different one each time.
  const psychophysicsCanvas = document.getElementById('myCanvas');
  if (!psychophysicsCanvas) {
    // Canvas is not yet present
    throw new Error('psychophysics canvas not found.');
  }
  const { left, top } = psychophysicsCanvas.getBoundingClientRect();
  const { width, height } = psychophysicsCanvas;
  
  // And this assumes the canvas has not been scaled
  const x = Math.round(left + (width / 2));
  const y = Math.round(top + (height / 2));
  return new _lib_types_index_js__WEBPACK_IMPORTED_MODULE_0__.Point(x, y);
}

class EventsTrackingStart {
  static info = {
    name: 'events-tracking-start',
    parameters: {},
  }
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }
  trial() {
    rastoc.startTrackingEvents();
    this.jsPsych.finishTrial({
      jspsych_start_time: this.jsPsych.getStartTime().toISOString(),
    })
  }
}

class EventsTrackingStop {
  static info = {
    name: 'events-tracking-stop',
    parameters: {},
  }
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }
  trial() {
    this.jsPsych.finishTrial({
      events: rastoc.stopTrackingEvents(),
    });
  }
}

const thirdOfVerticalSpace = () => Math.round((1 / 3) * window.innerHeight);
const quarterOfVerticalSpace = () => Math.round((1 / 4) * window.innerHeight);
const sixthOfVerticalSpace = () => Math.round((1 / 6) * window.innerHeight)
const thirdOfHorizontalSpace = () => Math.round((1 / 3) * window.innerWidth);
const quarterOfHorizontalSpace = () => Math.round((1 / 4) * window.innerWidth);

const interestRegions = (dir) => {
  // If [virtual-chinrest](https://www.jspsych.org/7.0/plugins/virtual-chinrest/)
  // was run
  // then
  //    the pixel values of the interest regions will take degrees of vision
  //    into account
  // otherwise
  //    fractions of the screen will be used
  const px2degs = jsPsych.data.get().trials
    .filter(t => typeof t["px2deg"] === "number")
    .map(t => t["px2deg"])
  let delta = dir === "horizontal"
    ? thirdOfHorizontalSpace()
    : thirdOfVerticalSpace();
  if (px2degs.length > 0) {
    delta = Math.round(Math.min(
      10 * px2degs[px2degs.length - 1],
      0.75 * window[dir === "horizontal" ? "innerWidth" : "innerHeight"] / 2
    ));
  }
  return [0, - delta, delta];
}
const horizontalInterestRegions = () => interestRegions("horizontal");
const verticalInterestRegions = () => interestRegions("vertical");

const getCalibrationStimulusCoordinates = () => {
  let l = [];
  horizontalInterestRegions().forEach((
    x
  ) => verticalInterestRegions().forEach((
    y
  ) => l.push(new _lib_types_index_js__WEBPACK_IMPORTED_MODULE_0__.Point(x, y))));
  return (0,_lib_index_js__WEBPACK_IMPORTED_MODULE_1__.shuffle)(l);
}

let calibrationId = 0
const calibrate = {
  assistedly: (calibrationType) => {
    if (false) {}

    let calibrationPointsCount, calibrationStimulusCoordinates;
    let centerCoordinates;
    let mapCoordinateToGaze;
    return {
      on_timeline_start() {
        calibrationPointsCount = 0;
        if (calibrationType === "middleStrip") {
          calibrationStimulusCoordinates = [
            new _lib_types_index_js__WEBPACK_IMPORTED_MODULE_0__.Point(0, - quarterOfVerticalSpace()),
            new _lib_types_index_js__WEBPACK_IMPORTED_MODULE_0__.Point(0, quarterOfVerticalSpace()),
          ];
          (0,_lib_index_js__WEBPACK_IMPORTED_MODULE_1__.shuffle)([
            0,
            - quarterOfHorizontalSpace() / 4,
            quarterOfHorizontalSpace() / 4,
          ]).forEach((
            d
          ) => horizontalInterestRegions().forEach((
            x
          ) => calibrationStimulusCoordinates.push(new _lib_types_index_js__WEBPACK_IMPORTED_MODULE_0__.Point(d + x, 0))));
        } else {
          calibrationStimulusCoordinates = getCalibrationStimulusCoordinates();
          calibrationStimulusCoordinates = (0,_lib_index_js__WEBPACK_IMPORTED_MODULE_1__.shuffle)(
            calibrationStimulusCoordinates
          ).concat(calibrationStimulusCoordinates);
        }
      },
      timeline: [{
        type: jsPsychHtmlButtonResponse,
        stimulus: `
        <h3>Calibration Session</h3>

        Sit comfortably, from now on try to keep your head as still as
        possible.
        <br>
        <br>
        
        Next you will see a <b>series of markers</b> in the screen.
        <br>

        As they appear <b>fix your gaze</b> on them.
        <br>

        Once they turn orange, press the <b>space bar</b>.
        <br>
      `,
        choices: ["Continue"],
        on_finish() {
          mapCoordinateToGaze = rastoc.startCalibrationPhase("external");
        },
      }, {
        timeline: [{
          type: jsPsychPsychophysics,
          background_color: '#d3d3d3',
          stimuli: [{
            obj_type: 'circle',
            origin_center: true,
            fill_color: 'blue',
            radius: 20,
            get startY() {
              return calibrationStimulusCoordinates[calibrationPointsCount].y;
            },
            get startX() {
              const {
                x,
                y,
              } = calibrationStimulusCoordinates[calibrationPointsCount];
              // The canvas won't be opened until after this current callback ends
              setTimeout(() => {
                let center;
                try {
                  center = getPsychophysicsCanvasCenter();
                } catch (e) {
                  console.error(e)
                  throw new Error("Failed to store center coordinate of canvas");
                }
                centerCoordinates = center;
                const fn = ({ key }) => {
                  if (key !== ' ') {
                    return;
                  }
                  mapCoordinateToGaze(center.add(x, y));
                  document.removeEventListener('keydown', fn);
                };
                document.addEventListener('keydown', fn);
              }, 0)
              return x;
            },
            show_start_time: 50,
            show_end_time: 550,
          }, {
            obj_type: 'circle',
            origin_center: true,
            fill_color: 'orange',
            radius: 20,
            get startY() {
              return calibrationStimulusCoordinates[calibrationPointsCount].y;
            },
            get startX() {
              return calibrationStimulusCoordinates[calibrationPointsCount].x;
            },
            show_start_time: 550,
          }],
          response_type: 'key',
          response_start_time: 550,
          choices: [' '],
          on_start() {
            document.body.style.cursor = "none";
          },
          on_finish(data) {
            document.body.style.cursor = "auto";
            data["rastoc-type"] = "calibration-stimulus";
            const {
              x,
              y,
            } = calibrationStimulusCoordinates[calibrationPointsCount];
            let trueCoord = centerCoordinates.add(x, y);
            data["stimulus-coordinate"] = {
              x: calibrationStimulusCoordinates[calibrationPointsCount].x,
              y: calibrationStimulusCoordinates[calibrationPointsCount].y,
            };
            data["absolute-stimulus-coordinate"] = {
              x: trueCoord.x,
              y: trueCoord.y,
            };
            data["calibration-id"] = calibrationId
            data["calibration-point-id"] = calibrationPointsCount;
            data["inner-width"] = window.innerWidth;
            data["inner-height"] = window.innerHeight;
            calibrationPointsCount++;
          }
        }],
        loop_function() {
          const keep_looping =
            calibrationPointsCount < calibrationStimulusCoordinates.length;
          if (!keep_looping) {
            rastoc.endCalibrationPhase("external");
          }
          return keep_looping;
        },
      }],
      on_timeline_finish() {
        calibrationId++;
      },
    }
  },
  // Calibrate system by clicking freely over the screen and until space is
  // pressed.
  freely: () => {
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
          rastoc.startCalibrationPhase("click");
        },
      }, {
        type: jsPsychHtmlKeyboardResponse,
        choices: [' '],
        stimulus: '',
        on_finish() {
          rastoc.endCalibrationPhase("click");
        },
      }],
      loop_function() {
        return !rastoc.isCorrectlyCalibrated;
      },
    };
  },
  fullscreen: () => {
    return {
      timeline: [],
    }
  },
}

// Validates current calibration by checking relative positioning of
// estimations.
let validationId = 0;
const validateCalibration = () => {
  let validationPointsCount, validationStimulusCoordinates;
  const responseStartTimeInMs = 750;
  const checkedTimeInMs = 250;
  return {
    on_timeline_start() {
      validationPointsCount = 0;
      validationStimulusCoordinates = [];
      [
        sixthOfVerticalSpace(),
        - sixthOfVerticalSpace()
      ].forEach((
        y
      ) => horizontalInterestRegions().forEach((
        x
      ) => validationStimulusCoordinates.push(new _lib_types_index_js__WEBPACK_IMPORTED_MODULE_0__.Point(x, y))));
      document.dispatchEvent(new Event('rastoc:validation-started'));
    },
    timeline: [{
      type: jsPsychHtmlButtonResponse,
      stimulus: `
        <h3>Validación</h3>
        <p>
          Para cada punto que aparezca
        </p>
        <ol>
          <li>fijá la mirada en él</li>
          <li>esperá a que cambie de color, manteniendo fija la mirada</li>
          <li>presioná la barra de espacio</li>
        </ol>
      `,
      choices: ["Continuar"],
    }, {
      timeline: [{
        type: jsPsychPsychophysics,
        background_color: '#d3d3d3',
        stimuli: [{
          obj_type: 'circle',
          origin_center: true,
          fill_color: 'blue',
          radius: 20,
          get startX() {
            return validationStimulusCoordinates[validationPointsCount].x;
          },
          get startY() {
            return validationStimulusCoordinates[validationPointsCount].y;
          },
          show_start_time: 50,
          show_end_time: 750,
        }, {
          obj_type: 'circle',
          origin_center: true,
          fill_color: 'black',
          radius: 20,
          get startX() {
            return validationStimulusCoordinates[validationPointsCount].x;
          },
          get startY() {
            return validationStimulusCoordinates[validationPointsCount].y;
          },
          show_start_time: responseStartTimeInMs,
        }],
        response_type: 'key',
        response_start_time: responseStartTimeInMs,
        choices: [' '],
        extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
        on_finish(data) {
          data["rastoc-type"] = "validation-stimulus";
          data["stimulus-coordinate"] = {
            x: validationStimulusCoordinates[validationPointsCount].x,
            y: validationStimulusCoordinates[validationPointsCount].y,
          };
          data["validation-id"] = validationId
          data["validation-point-id"] = validationPointsCount;
          data["last-estimations"] = data.webgazer_data.filter(({
            t
          }) =>
            // `data.rt` is relative to `response_start_time`
            // https://jspsychophysics.hes.kyushu-u.ac.jp/pluginParams/#data-generated
            responseStartTimeInMs + data.rt - checkedTimeInMs < t
            && t < responseStartTimeInMs + data.rt
          );
          data["inner-width"] = window.innerWidth;
          data["inner-height"] = window.innerHeight;
          validationPointsCount++;
        }
      }],
      loop_function() {
        return validationPointsCount < validationStimulusCoordinates.length;
      },
    }],
    on_timeline_finish() {
      const results = jsPsych.data.get().trials.filter((
        t
      ) => t["rastoc-type"] === "validation-stimulus" && t["validation-id"] === validationId);

      let relativePositionsAreCorrect = true;
      const avgX = (r) => (r['last-estimations'].reduce((
        acc, { x }
      ) => acc + x, 0)) / r['last-estimations'].length;
      results.forEach((r1, i) => results.forEach((r2, j) => {
        if (j <= i) {
          return;
        }
        const r1X = r1["stimulus-coordinate"].x;
        const r2X = r2["stimulus-coordinate"].x;
        if (r1X === r2X) {
          return;
        }

        const r1AvgX = avgX(r1);
        const r2AvgX = avgX(r2);
        let pairHasCorrectPosition;
        if (r1X > r2X) {
          pairHasCorrectPosition = r1AvgX > r2AvgX;
        } else {
          pairHasCorrectPosition = r1AvgX < r2AvgX;
        }
        if (!pairHasCorrectPosition) {
          console.warn(
            `Incorrect relative position detected (i=${i}, j=${j})`,
            r1,
            r2
          );
        }
        relativePositionsAreCorrect =
          relativePositionsAreCorrect && pairHasCorrectPosition;
      }))

      if (relativePositionsAreCorrect) {
        document.dispatchEvent(new Event('rastoc:validation-succeeded'));
      } else {
        document.dispatchEvent(new Event('rastoc:validation-failed'));
      }
      jsPsych.data.get().addToLast({
        "validation-results": {
          relativePositionsAreCorrect
        },
      });
      validationId++;
    },
  }
}

// If the system is not calibrated, loops over calibration node until system is
// calibrated. Optionally, perform a validation after calibrating.
const ensureCalibration = (options) => {
  options = options || {};
  options.calibrationType = options.calibrationType || "middleStrip";
  options.forceCalibration = options.forceCalibration || false;
  options.performValidation = options.performValidation || false;
  options.maxRetries = options.maxRetries || 3;
  options.postCalibrationCb = options.postCalibrationCb || null;
  options.conditionCb = options.conditionCb || null;

  let unsucessfulCalibration = false;
  const body = [{
    conditional_function() {
      //no corramos muchas validaciones total solo nos importa exponer mpuntos
      return false;
    },
    timeline: [{
      type: jsPsychHtmlKeyboardResponse,
      stimulus: "Hubo un problema con la última calibración, reintentando.",
      choices: "NO_KEYS",
      trial_duration: 2000,
    }],
  }];
  if (options.calibrationType === "free") {
    body.push(calibrate.freely());
  } else {
    body.push(calibrate.assistedly(options.calibrationType));
  }
  if (options.performValidation) {
    body.push(validateCalibration());
  }

  if (options.postCalibrationCb !== null) {
    body.push({
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '<p style="font-size: 48px;">+</p>',
      choices: "NO_KEYS",
      trial_duration: 0,
      on_start: () => {
        options.postCalibrationCb()
      },
    })
  }

  let calibrationsCounts;
  return {
    conditional_function() {
      if (options.conditionCb !== null && !options.conditionCb()) {
        return false;
      }

      //return !rastoc.isCorrectlyCalibrated || options.forceCalibration;
      return false;
    },
    on_timeline_start() {
      calibrationsCounts = 0;
    },
    timeline: [{
      type: jsPsychHtmlKeyboardResponse,
      stimulus: "Calibrando",
      choices: "NO_KEYS",
      trial_duration: 2000,
    }, {
      timeline: body,
      loop_function() {
        calibrationsCounts++;

        unsucessfulCalibration = !rastoc.isCorrectlyCalibrated;
        if (options.performValidation) {
          const validationsResults = jsPsych.data.get().trials.filter((
            x
          ) => x["rastoc-type"] === 'validation-stimulus' && !!x["validation-results"]);
          const lastValidation =
            validationsResults[validationsResults.length - 1];
          unsucessfulCalibration = unsucessfulCalibration ||
            !lastValidation["validation-results"].relativePositionsAreCorrect;
        };

        return calibrationsCounts <= options.maxRetries && unsucessfulCalibration;
      },
    }],
  }
}


window.rastocJSPsych = {
  EventsTrackingStart,
  EventsTrackingStop,
  calibrate,
  ensureCalibration,
  getCalibrationStimulusCoordinates,
};

})();

/******/ })()
;