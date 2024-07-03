
document.getElementById("uploadButton").onclick = async () => {
  let fileElement = document.getElementById('fileInputCalibrate')
  let jsonElement = document.getElementById('jsonInputCalibrate')

    // check if user had selected a json file
    if (jsonElement.files.length === 0) {
      alert('please choose a json')
      return
    }

  // check if user had selected a video file
  if (fileElement.files.length === 0) {
    alert('please choose a video')
    return
  }

  let json = await parseJsonFile(jsonElement.files[0])

  console.log(json)
  //rastoc.resetVideoFrameData();
  rastoc.setPointForCalibration(json.point);
  rastoc.setframesForCalibration(json.calibration);
  //rastoc.setPredictionLapse(json.predict);
  let ctx = canvasEl.getContext("2d");

  let file = fileElement.files[0]
  let videoUrl = URL.createObjectURL(file);
  var frameqty = 0;
  console.log("file loaded " + videoUrl)
  var i=0;
  rastoc.startTrackingVideoCalibration(
    videoUrl,
    async (frame) => {  // `frame` is a VideoFrame object: https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame
      ctx.drawImage(frame, 0, 0, canvasEl.width, canvasEl.height);
      console.log("frame: " + i++);
      var j=0;
      while( j<10) {
        j++;
      }
      //frame.close();
      frameqty++
    },
    (config) => {
      canvasEl.width = config.codedWidth;
      canvasEl.height = config.codedHeight;
    },
  );

  URL.revokeObjectURL(file); // revoke URL to prevent memory leak

}


document.getElementById("predictButton").onclick = async () => {
  let fileElement = document.getElementById('fileInputCalibrate')
  let jsonElement = document.getElementById('jsonInputCalibrate')

    // check if user had selected a json file
    if (jsonElement.files.length === 0) {
      alert('please choose a json')
      return
    }

  // check if user had selected a video file
  if (fileElement.files.length === 0) {
    alert('please choose a video')
    return
  }

  let json = await parseJsonFile(jsonElement.files[0])

  console.log(json)
  rastoc.resetVideoFramePredictionData();
  rastoc.setPredictionLapse(json.predict);
  let ctx = canvasEl.getContext("2d");

  let file = fileElement.files[0]
  let videoUrl = URL.createObjectURL(file);
  var frameqty = 0;
  console.log("file loaded " + videoUrl)
  var i=0;
  rastoc.startTrackingVideoPrediction(
    videoUrl,
    async (frame) => {  // `frame` is a VideoFrame object: https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame
      ctx.drawImage(frame, 0, 0, canvasEl.width, canvasEl.height);
      console.log("frame: " + i++);
      var j=0;
      while( j<10) {
        j++;
      }
      //frame.close();
      frameqty++
    },
    (config) => {
      canvasEl.width = config.codedWidth;
      canvasEl.height = config.codedHeight;
    },
  );

  URL.revokeObjectURL(file); // revoke URL to prevent memory leak

}

document.getElementById("savePrediction").onclick = async () => {
  var fileInput = document.getElementById('fileInputCalibrate');   
  var filename = fileInput.files[0].name;
  var predictionData = rastoc.getVideoFramePredictionData()
  downloadObjectAsJson(predictionData, filename + "-wgData")

}
async function parseJsonFile(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = event => resolve(JSON.parse(event.target.result))
    fileReader.onerror = error => reject(error)
    fileReader.readAsText(file)
  })
}

function downloadObjectAsJson(exportObj, exportName){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}