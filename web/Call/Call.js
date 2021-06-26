let socket = new WebSocket(config.wss);

let channel = config.channel;
let video = document.querySelector(`${config.namespace} > video`)

socket.onopen = async () => {
    socket.send(`JOIN.${channel}`)
}

navigator.mediaDevices.getUserMedia(config.constraints).then((streamlet) => {
    video.srcObject = streamlet;
})
