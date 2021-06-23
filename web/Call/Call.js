navigator.mediaDevices.getUserMedia(config.constraints).then((streamlet) => {
    let video = document.querySelector(`${config.namespace} > #call`)
    video.srcObject = streamlet;
}).catch(function (err) {
    alert("Camera not found")
});
