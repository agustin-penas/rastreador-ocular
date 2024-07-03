//ESTO YA NO SIRVE
document.getElementById("uploadButton").onclick = async () => {
  let fileElement = document.getElementById('fileInput')
  //console.log(fileElement.value);
  // check if user had selected a video file
  let ctx = canvasEl.getContext("2d");
  const byteCharacters = atob(fileElement.value);
  console.log(byteCharacters.substring(0,50))

  const blob = b64toBlob(fileElement.value, "video/mp4");
  const myFile = new File(
    [blob],
    "demo.mp4",
    { type: 'video/mp4' }
);
  const blobUrl = URL.createObjectURL(myFile);

  var frameqty = 0;
  console.log("file loaded " + blobUrl)
  var i=0;
  rastoc.startTrackingVideo(
    blobUrl,
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

  URL.revokeObjectURL(blobUrl); // revoke URL to prevent memory leak
  console.log("el video tenia: " + frameqty + " frames");

}

async function parseJsonFile(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = event => resolve(JSON.parse(event.target.result))
    fileReader.onerror = error => reject(error)
    fileReader.readAsText(file)
  })
}

const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
    
  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}
