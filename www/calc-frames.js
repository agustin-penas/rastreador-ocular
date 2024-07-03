
document.getElementById("uploadButton").onclick = async () => {
  let fileElement = document.getElementById('fileInput')

  // check if user had selected a video file
  if (fileElement.files.length === 0) {
    alert('please choose a video')
    return
  }

  let file = fileElement.files[0]
  let videoUrl = URL.createObjectURL(file);
  console.log("file loaded " + videoUrl)
  rastoc.clearFrameCount();
  rastoc.calcVideoFrameCount(videoUrl).then( function() {
    console.log("el video calc con videoframe tenia: " + rastoc.getVideoFrameCount() + " frames");
  });
  URL.revokeObjectURL(file); // revoke URL to prevent memory leak

}

document.getElementById("getButton").onclick = async () => {
  console.log("el video calc con videoframe tenia: " + rastoc.getVideoFrameCount() + " frames");
}
