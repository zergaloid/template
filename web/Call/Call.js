navigator.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
const stream = navigator.mediaDevices.getUserMedia(
    config.constraints
);
stream.then(streamlet => {
    document.querySelector(`${config.namespace} > #call`).srcObject = streamlet;
})
pc = new RTCPeerConnection();
sg = new WebSocket('ws://128.0.128.26:8000');
sg.onmessage = (msg) => {
    console.log(msg)
};
sg.onopen = (e) => {
    console.log(e)
    sg.send('JOIN.conn');
    sg.send(`SEND.conn A`);
}