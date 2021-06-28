let socket = new WebSocket(config.wss);

// Room/Role selector, specifies both
let selector = config.selector.split('/');
selector = {
  room: selector[0],
  role: selector[1]
}
// RECV-trimming function
let trim = (s) => s.slice(`RECV.${selector.room} `.length)
// Local video <element>
let video = document.querySelector(`${config.namespace} > video`)

socket.onopen = async () => {
    socket.send(`JOIN.${selector.room}`)
}
navigator.mediaDevices.getUserMedia(config.constraints).then((streamlet) => {
  video.srcObject = streamlet;
})
