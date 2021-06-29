let socket = new WebSocket(config.wss);
const peer = new RTCPeerConnection({
  iceServers: [
    {
      urls: 'turn:numb.viagenie.ca',
      credential: 'ygZLQaRAs7Dqc8w',
      username: 'zergal@zergal.net'
    },
  ]
});

// Room/Role selector, specifies both
let selector = config.selector.split('/');
selector = {
  room: selector[0],
  role: selector[1]
}

let helpers = {
  // RECV-trimming function
  trim: (s) => s.slice(`RECV.${selector.room}_x `.length),
  offer: (o) => socket.send(`SEND.${selector.room}_o ${JSON.stringify(o)}`),
  answer: (a) => socket.send(`SEND.${selector.room}_a ${JSON.stringify(a)}`),
  ice: (i) => socket.send(`SEND.${selector.room}_i ${JSON.stringify(i)}`)
}

// Local video <element>
let video = document.querySelector(`${config.namespace} > video`)

switch (selector.role) {
  case 'caller':
    socket.onopen = async () => {
      socket.send(`JOIN.${selector.room}_a`)

      let offer = await peer.createOffer({
        'offerToReceiveVideo': 1
      })
      peer.setLocalDescription(new RTCSessionDescription(offer))

      helpers.offer(offer)
    }
    break;
  case 'callee':
    socket.onopen = async () => {
      socket.send(`JOIN.${selector.room}_o`)
    }
    break;
}

peer.addEventListener('icecandidate', event => {
  console.log(event)
  if (event.candidate) {
    helpers.ice(event.candidate);
  }
});


socket.onmessage = async (e) => {
  offer = helpers.trim(e.data)
  offer = JSON.parse(offer)

  console.log(peer)

  await peer.setRemoteDescription(new RTCSessionDescription(offer))
  switch (selector.role) {
    case 'callee':
      let answer = await peer.createAnswer();
      await peer.setLocalDescription(new RTCSessionDescription(answer));
      helpers.answer(answer)
      break;
  }
  if (peer.remoteDescription) {
    socket.send(`JOIN.${selector.room}_i`)
    socket.onmessage = async (se) => {
      icec = helpers.trim(se.data)
      icec = JSON.parse(icec)

      icec.usernameFragment = null;
      try {
        await peer.addIceCandidate(icec);
      } catch (e) {
        console.error('Error adding received ice candidate', e, icec);
      }
    }
  }
}

navigator.mediaDevices.getUserMedia(config.constraints).then((streamlet) => {
  if (selector.role == 'caller') {
    video.srcObject = streamlet;
  }
  peer.oniceconnectionstatechange = function (event) {
   // console.log(`EFFECT:`, peer)
  };
  peer.ontrack = async (event) => {
    console.log(event)
    video.srcObject = event.streams[0];
  };
  if (selector.role == 'caller') {
    streamlet.getVideoTracks().forEach(track => {
      peer.addTrack(track)
    })
  }
})
