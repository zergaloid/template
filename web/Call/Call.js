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
}

socket.onmessage = async(e) => {
    message = trim(e.data).split('/')
    message = {
      to: message[0],
      content: message[1]
    }
    if(message.to == selector.role)
    {
      vp8 = JSON.parse(message.content)
      console.log(vp8)
    }
}

navigator.mediaDevices.getUserMedia(config.constraints).then((streamlet) => {
    let recorder = new MediaRecorder(streamlet);
    recorder.start(30)
    if(selector.role == 'caller')
    recorder.ondataavailable = async (e) => {
      data = await e.data.arrayBuffer()
      data = new Uint8Array(data)
      data = JSON.stringify(data)
      socket.send(`SEND.${selector.room} callee/${data}`)
    }
})
