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
let link = ''
var xhr = new XMLHttpRequest();

socket.onopen = async () => {
    socket.send(`JOIN.${selector.room}`)
    if(selector.role == 'caller')
      socket.send(`SEND.${selector.room} callee/test`)
}

socket.onmessage = async(e) => {
    message = trim(e.data).split('/')
    message = {
      to: message[0],
      content: message[1]
    }
    if(message.to == selector.role)
      console.log(message)
}

navigator.mediaDevices.getUserMedia(config.constraints).then((streamlet) => {
    let recorder = new MediaRecorder(streamlet);
    recorder.start(300)
    recorder.ondataavailable = async (e) => {
      data = e.data
      console.log(data)
    }
})
