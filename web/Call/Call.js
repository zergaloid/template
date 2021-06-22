const socket = new WebSocket('wss://localhost:8000')

socket.onmessage = e => console.log(e)

const stream = navigator.mediaDevices.getUserMedia(
    config.constraints
).then(streamlet => {
    var recorder = new MediaRecorder(streamlet);
    let video = document.querySelector(`${config.namespace} > #call`);

    // recorder.start(30);
    // setInterval(() => {
    //     recorder.requestData()
    // }, 3000);
    // recorder.ondataavailable = function (e) {
    //     console.log(e.data)
    // }

    socket.send('JOIN.stream')
    socket.send('SEND.stream A')

    video.srcObject = streamlet;
})