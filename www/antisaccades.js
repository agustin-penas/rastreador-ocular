const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const getRandomBoolean = () => {
  return Math.random() < 0.5;
}

const displayMsg = (msg, ms) => {
  return {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: msg,
    choices: "NO_KEYS",
    trial_duration: ms,
  }
}

const jsPsych = initJsPsych({
  on_finish: function() {
    jsPsych.data.get().localSave('json', 'antisaccades.json');
  },
  extensions: [{ type: jsPsychExtensionWebgazer }],
});

const saccade = ({ anti }) => {
  const showVisualCueAtLeft = getRandomBoolean();
  const durations = {
    interTrial: 925,
    fixation: getRandomIntInclusive(900, 1500),
    intraTrial: 75,
    visualCue: 150,
    responseAwait: 650,
    get total() {
      return this.responseEnd;
    },
    get itiEnd() {
      return this.interTrial;
    },
    get fixEnd() {
      return this.itiEnd + this.fixation;
    },
    get intraEnd() {
      return this.fixEnd + this.intraTrial;
    },
    get visualEnd() {
      return this.intraEnd + this.visualCue;
    },
    get responseEnd() {
      return this.visualEnd + this.responseAwait;
    },
  }

  const fixationMarker = {
      obj_type: 'manual',
      drawFunc: (stim, canvas, ctx, elapsedTime, sumOfStep) => {
        // cx = canvas' center
        const cx = Math.round(canvas.width / 2);
        const cy = Math.round(canvas.height / 2);

        ctx.beginPath();
        ctx.lineWidth = 6;
        const size = 15
        if (anti) {
          ctx.moveTo(cx - size, cy - size);
          ctx.lineTo(cx + size, cy + size);
          ctx.moveTo(cx - size, cy + size);
          ctx.lineTo(cx + size, cy - size);
        } else {
          ctx.arc(cx, cy, size, 0, 2 * Math.PI, false);
        }
        ctx.stroke();
      }
  }
  const placeholder = {
    obj_type: 'rect',
    origin_center: true,
    line_color: 'black',
    width: 45,
    height: 45,
    startY: 0,
  }
  const visualCue = {
    obj_type: 'circle',
    origin_center: true,
    fill_color: 'black',
    radius: 20,
    startY: 0,
  }
  const delta = () => Math.round(2 * window.innerWidth / 6);
  return {
    type: jsPsychPsychophysics,
    stimuli: [{
      show_start_time: durations.itiEnd,
      show_end_time: durations.fixEnd,
      ...fixationMarker
    }, {
      show_start_time: durations.intraEnd,
      show_end_time: durations.responseEnd,
      ...fixationMarker
    }, {
      // left placeholder
      show_start_time: durations.itiEnd,
      show_end_time: durations.fixEnd,
      ...placeholder,
      get startX() {
        return - delta();
      },
    }, {
      // left placeholder
      show_start_time: durations.intraEnd,
      show_end_time: durations.responseEnd,
      ...placeholder,
      get startX() {
        return - delta();
      },
    }, {
      // right placeholder
      show_start_time: durations.itiEnd,
      show_end_time: durations.fixEnd,
      ...placeholder,
      get startX() {
        return delta();
      },
    }, {
      // right placeholder
      show_start_time: durations.intraEnd,
      show_end_time: durations.responseEnd,
      ...placeholder,
      get startX() {
        return delta();
      },
    }, {
      show_start_time: durations.intraEnd,
      show_end_time: durations.visualEnd,
      ...visualCue,
      get startX() {
        return (showVisualCueAtLeft ? -1 : 1) * delta();
      },
    }],
    response_ends_trial: false,
    trial_duration: durations.total,
    extensions: [{ type: jsPsychExtensionWebgazer, params: { targets: [] } }],
    on_finish(data) {
      data.isSaccadeExperiment = true;
      data.typeOfSaccade = anti ? 'antisaccade' : 'prosaccade';
      data.cueShownAtLeft = showVisualCueAtLeft;

      data.itiEnd = durations.itiEnd;
      data.fixEnd = durations.fixEnd;
      data.intraEnd = durations.intraEnd;
      data.visualEnd = durations.visualEnd;
      data.responseEnd = durations.responseEnd;

      // viewport dimensions to check if the size of the screen changed since
      // last calibration
      data.viewportWidth = window.innerWidth;
      data.viewportHeight = window.innerHeight;

      data.systemIsStillCalibrated = rastoc.isCorrectlyCalibrated;
    },
  }
};

const REPETITIONS_PER_BLOCK = 20;
const nSaccades = (options) => {
  options.n = options.n || REPETITIONS_PER_BLOCK;

  let saccades = [];
  for (let i = 0; i < options.n; ++i) {
    saccades.push(saccade({ anti: options.anti }));
  }
  return saccades
};

const htmlCross  = `<span style="font-size:48px;"><b>&#10799;</b></span>`;
const htmlCircle = `<span style="font-size:28px;"><b>&#9711;</b></span>`;

const proReminder = `${htmlCircle} = mirar en la MISMA dirección`;
const antiReminder = `${htmlCross} = mirar en la dirección OPUESTA`;

const saccadesBlocksPair = (options) => {
  options = options || {};
  return {
    timeline: [
      rastocJSPsych.ensureCalibration({
        performValidation: true,
        forceCalibration: options.forceCalibration,
        maxRetries: 1,
      }),
      displayMsg(`
        <h3>Bloque de prosacada</h3>
        <p>${proReminder}<p>
      `, 3000),
      ...nSaccades({ anti: false, n: options.n }),
      rastocJSPsych.ensureCalibration({
        performValidation: true,
        maxRetries: 1,
      }),
      displayMsg(`
        <h3>Bloque de antisacadas</h3>
        <p>${antiReminder}<p>
      `, 3000),
      ...nSaccades({ anti: true, n: options.n }),
    ]
  }
}

const gifsInstructions = `
  <style>
    .tasks-gifs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 20px;
    }
    .gif-instruction {
      border: 2px solid black;
      padding-right: 10px;
      padding-left: 10px;
      margin-bottom: 10px;
    }
    .gif-instruction > img {
      width: 70%;
      height: auto;
      display: block;
      margin-left: auto;
      margin-right: auto;
      border: 1px solid black;
    }
  </style>

  <div class="tasks-gifs">
    <div class="gif-instruction">
      <h4>Prosacada</h4>
      <img src="prosaccade.gif" alt="prosaccade instructions" /> 
      <p>Mirar hacia el mismo lado</p>
    </div>
    <div class="gif-instruction">
      <h4>Antisacada</h4>
      <img src="antisaccade.gif" alt="antisaccade instructions" /> 
      <p>Mirar hacia el lado contrario</p>
    </div>
  </div>
`;

const tutorial = () => {
  let retry = false;
  const retryChoices = {
    html: `
      <div style="text-align: left">
        <p>
          Ahí terminamos el tutorial. Querés hacerlo de vuelta?
        </p>
      </div>`,
    yes: "sí, quiero hacer nuevamente el tutorial",
    no: "no, ya quedó claro",
    get choices() {
      return [this.yes, this.no];
    },
    check(r) {
      return this.yes === this.choices[r]
    },
  };
  return {
    timeline: [{
      type: jsPsychHtmlButtonResponse,
      stimulus: `
      <div style="text-align: left">
        <h2>Tutorial</h2>
  
        <h3>Prosacadas y antisacadas</h3>
        <p>
          Vas a realizar tareas de prosacadas y antisacadas. En ambas tareas va a
          aparecer un estímulo central y luego un estímulo lateral. La diferencia
          entre ambas es que en la tarea de <b>ANTISACADAS tenés que mirar en la
          dirección OPUESTA</b> a la que aparece el estímulo. En la tarea de
          <b>PROSACADAS tenés que mirar en la MISMA dirección</b>.
        </p>
        <p>
          Vamos a usar un círculo (${htmlCircle}) para referirnos a las tareas de
          prosacadas y una cruz (${htmlCross}) para las tareas de antisacadas.
          Al principio de cada bloque te vamos a recordar qué tarea toca hacer.
        </p>
        ${gifsInstructions}
      </div>`,
      choices: ["continuar"],
    }, {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
      <div style="text-align: left">
        <h2>Tutorial</h2>
  
        <h3>Calibración y validación</h3>
        <p>
          El sistema en cuestión requiere ser inicialmente calibrado para
          poder estimar la mirada. Además, cada vez que detectemos demasiado
          movimiento procederemos a recalibrar. Tené en cuenta que <b>rotar
          la cabeza también cuenta como movimiento</b>. Idealmente durante
          los experimentos tendrías que estar <b>moviendo únicamente tus
          ojos</b>.
        </p>
        <p>
          La calibración consiste en fijar la mirada en <b>círculos</b> que van
          a aparecer en la pantalla.
          <br>
          Cada vez que aparezca uno tenés que
        </p>
        <ol>
          <li>fijar la mirada en él</li>
          <li>esperar que cambie de color mientras seguís mirándolo</li>
          <li>presionar la <b>barra de espacio</b></li>
        </ol>
      </div>`,
      choices: ["continuar"],
    }, {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
      <div style="text-align: left">
        <p>
          Así que acordate
          <ul>
            <li>prosacada = ${proReminder}</li>
            <li>antisacada = ${antiReminder}</li>
            <li>para calibrar, fijá la mirada en el círculo y presioná la barra
            de espacio</li>
          </ul>
        </p>
      </div>`,
      choices: ["continuar"],
    },
    saccadesBlocksPair({
      n: 10,
      forceCalibration: true,
    }),
    {
      type: jsPsychHtmlButtonResponse,
      stimulus: retryChoices.html,
      choices: retryChoices.choices,
      on_finish(data) {
        retry = retryChoices.check(data.response);
      },
    }],
    loop_function() {
      return retry;
    }
  };
};

const pause = () => {
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <h3>descanso</h3>
    <p>
      Tomate unos segundos para descansar los ojos y cuando estés listx hacé
      click en <i>continuar</i>.
    </p>
    ${gifsInstructions}
    `,
    choices: ["continuar"],
  }
}

let breakEarlier = false;
const earlyFinish = {
  html: `
    <div style="text-align: left">
      <p>
        Ahí llegamos a la mitad del experimento. <br>
        Si todavía estás con energías hacemos una segunda ronda y si no podés
        cortar acá.
      </p>
    </div>`,
  yes: "cortar ahora",
  no: "seguir con otra ronda",
  get choices() {
    return [this.yes, this.no];
  },
  check(r) {
    return this.yes === this.choices[r]
  },
};
jsPsych.run([
  {
    type: jsPsychSurveyHtmlForm,
    button_label: 'comenzar',
    html: `
    <div style="text-align: left">
      <p>
        Bienvenidx a este experimento de eye tracking.
      </p>
  
      <p>
        Utilizando tu cámara web, vamos a intentar estimar dónde estás mirando
        en la pantalla. El experimento va durar aproximadamente 20 minutos
        aunque por la mitad tendrás la opción de cortar tempranamente.
        <br>
        El sistema que armamos es muy vulnerable a movimientos de cabeza, por lo 
        que es importante que te sientes cómodx.
      </p>

      <p>
        Para arrancar te pedimos este par de datos tuyos y de tu compu.
      </p>
      <ul>
        <li>
          Vas a estar usando anteojos ahora durante el experimento? (si usás no
          es necesario que te los saques)<br>

          <label for="no-anteojos-input">No</label>
          <input
            type="radio"
            name="anteojos"
            id="no-anteojos-input"
            value="no"
            checked
          >
          &nbsp;

          <label for="anteojos-input">Sí</label>
          <input
            type="radio"
            name="anteojos"
            id="anteojos-input"
            value="si"
          >
          &nbsp;

          <label for="lentes-de-contacto-input">Voy a usar lentes de contacto</label>
          <input
            type="radio"
            name="anteojos"
            id="lentes-de-contacto-input"
            value="contacto"
          >
        </li>
        <li>
          Qué datos de hardware sabés de tu compu? Este campo es informal y
          opcional pero cualquier dato sirve: notebook o compu de escritorio?
          cuánto RAM tenés? tenés placa de video externa? qué CPU? tu cámara web
          es de la notebook o la tenés aparte? dónde está localizada (a un
          costado, arriba del monitor, abajo del monitor)?<br>

          <input
            type="text"
            name="hardware"
            id="hardware-input"
            size="80"
          >
        </li>
      </ul>
    </div>
    `,
  }, {
    type: rastocJSPsych.EventsTrackingStart
  }, {
    type: jsPsychWebgazerInitCamera,
    instructions: `
    <div style="text-align: left;">
      <p>
        Corregí la posición de la webcam para que se alinie con tus ojos y estos
        queden bien enfocados. Tu cabeza debería quedar en el centro del
        recuadro que aparece acá arriba.
        <br>
        Itentá que tus ojos se distingan correctamente. Si tenés luces atrás
        tuyo probá apagarlas.
      </p>
      <p>
        Cuando el recuadro se pinte de verde podés hacer click en
        <i>"continuar"</i>.
      </p>
    </div>
    `,
    button_text: "continuar"
  }, {
    type: jsPsychFullscreen,
    message: `
    <div style="text-align: left;">
      <p>
        Para evitar distracciones te pedimos también que en la medida de lo
        posible durante la duración del experimento cierres aplicaciones que
        generen notificaciones y pongas el teléfono en modo no molestar.
        <br>
        Además vamos a cambiar a pantalla completa.
      </p>
    </div>`,
    button_label: "continuar"
  },
  tutorial(),
  {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <div style="text-align: left">
      <p>
        Ahora arrancan las tareas reales. Presioná "comenzar" cuando estés
        listx.
      </p>
    </div>
    `,
    choices: ["comenzar"],
  },
  saccadesBlocksPair(),
  saccadesBlocksPair(),
  pause(),
  saccadesBlocksPair(),
  saccadesBlocksPair(),
  {
    type: jsPsychHtmlButtonResponse,
    stimulus: earlyFinish.html,
    choices: earlyFinish.choices,
    on_finish(data) {
      breakEarlier = earlyFinish.check(data.response);
    },
  },
  {
    conditional_function() {
      return !breakEarlier;
    },
    timeline: [
      displayMsg("Seguimos entonces :)", 2000),
      saccadesBlocksPair(),
      saccadesBlocksPair(),
      pause(),
      saccadesBlocksPair(),
      saccadesBlocksPair(),
    ],
  },
  {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>
      Fin del experimento. Presioná <i>finalizar</i> y esperá a que la pantalla
      quede en blanco. Luego podés cerrar la pestaña. <br>
      Muchas gracias por participar c:
    </p>
    `,
    choices: ["finalizar"],
  },
  { type: rastocJSPsych.EventsTrackingStop },
])