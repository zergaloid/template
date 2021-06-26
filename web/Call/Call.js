let socket = new WebSocket(config.wss);
let selector = config.selector.split('/');
selector = {
  room: selector[0],
  role: selector[1]
}
let video = document.querySelector(`${config.namespace} > video`)

socket.onopen = async () => {
    socket.send(`JOIN.${selector.room}`)
    switch(selector.role)
    {
      case "caller":
        break;
      case "callee":
        break;
    }
}

navigator.mediaDevices.getUserMedia(config.constraints).then((streamlet) => {
    video.srcObject = streamlet;
})
