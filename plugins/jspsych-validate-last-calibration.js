jsPsych.plugins['validate-last-calibration'] = (function(){
  return {
    info: {
      name: 'validate-last-calibration',
    },
    trial: async function(display_element, trial) {
      const estimator = await eyeTracking.switchTo.estimating()

      estimator.showVisualization()

      let stimulus
      const measurements = await estimator.runValidationRound(
        (xPercentage, yPercentage) => {
          stimulus = drawer.appendValidationVisualization();
          drawer.moveToPercentages(stimulus, xPercentage, yPercentage)
          return drawer.getCenterInPixels(stimulus)
        },
        () => {
          drawer.erasePoint(stimulus)
        }
      )
      const metrics = measurements.map(({
        groundTruthPercentages, groundTruthPixels: [xGTPix, yGTPix], estimations
      }) => {
        const linearErrors = estimations.map(({ coordinate: [x, y] }) => {
          const xErr = Math.abs(x - xGTPix)
          const yErr = Math.abs(y - yGTPix)
          return xErr + yErr
        }).reduce((acc, cur) => acc + cur, 0)
        const squareErrors = estimations.map(({ coordinate: [x, y] }) => {
          const xErr = Math.abs(x - xGTPix)
          const yErr = Math.abs(y - yGTPix)
          return xErr * xErr + yErr * yErr
        }).reduce((acc, cur) => acc + cur, 0)
        return {
          groundTruthPercentages,
          meanLinearError: linearErrors / estimations.length,
          meanSquareError: squareErrors / estimations.length,
        }
      })
      display_element.innerHTML = `
        <table>
          <tr>
            <th> estímulo (en porcentajes) </th>
            <th> MSE (en píxeles) </th>
            <th> error lineal (en píxeles) </th>
          </tr>
          ${metrics.map(({
            groundTruthPercentages: [x, y], meanSquareError, meanLinearError
          }) => `<tr>
            <td> (${x}, ${y}) </td>
            <td> ${meanSquareError.toFixed(2)} </td>
            <td> ${meanLinearError.toFixed(2)} </td>
          </tr>`).join('')}
        </table>
        <p>
          Presioná cualquier tecla para terminar
        </p>
      `;
      await new Promise((res) => document.body.addEventListener('keypress', () => {
        display_element.innerHTML = ''
        estimator.hideVisualization()
        eyeTracking.switchTo.idle()
        jsPsych.finishTrial();
        res()
      }, { once: true }))
    },
  }
})();
