let socket = new WebSocket(config.wss);
const peer = new RTCPeerConnection();

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

switch (selector.role) {
  case 'caller':
    socket.onopen = async () => {
      let offer = await peer.createOffer()
      offer = JSON.stringify(offer)

      socket.send(`SEND.${selector.room} ${offer}`)
    }
    break;
  case 'callee':
    socket.onopen = async () =>{
      socket.send(`JOIN.${selector.room}`)
    }
    break;
}

socket.onmessage = async (e) => {
  // offer = trim(e.data)
  // offer = JSON.parse(offer)
  
  console.log(e)

  // peer.setRemoteDescription(offer)
}

navigator.mediaDevices.getUserMedia(config.constraints).then((streamlet) => {
  video.srcObject = streamlet;
})
