
document.getElementById("uploadButton").onclick = async () => {
  let fileElement = document.getElementById('fileInput')
  let jsonElement = document.getElementById('jsonInput')

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
  rastoc.setframesForCalibration(json.calibration);
  rastoc.setPredictionLapse(json.predict);
  rastoc.resetVideoFrameData();
  let ctx = canvasEl.getContext("2d");

  let file = fileElement.files[0]
  let videoUrl = URL.createObjectURL(file);

  console.log("file loaded " + videoUrl)
  var i=0;
  rastoc.startTrackingVideo(
    videoUrl,
    async (frame) => {  // `frame` is a VideoFrame object: https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame
      ctx.drawImage(frame, 0, 0, canvasEl.width, canvasEl.height);
      console.log("frame: " + i++);
      var j=0;
      while( j<10) {
        j++;
      }
      frame.close();
    },
    (config) => {
      canvasEl.width = config.codedWidth;
      canvasEl.height = config.codedHeight;
    },
  );

  URL.revokeObjectURL(file); // revoke URL to prevent memory leak

  console.log(rastoc.getVideoFramePredictionData());

}

async function parseJsonFile(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = event => resolve(JSON.parse(event.target.result))
    fileReader.onerror = error => reject(error)
    fileReader.readAsText(file)
  })
}