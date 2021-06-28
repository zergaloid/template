let sg = new WebSocket('wss://srgl.cc:8000');
const channel = config.channel
const peerConnection = new RTCPeerConnection(
    { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
);

var trimRecv = (recv) => recv.slice(`RECV.${channel} `.length)

async function callTo(channel) {
    const offer = await peerConnection.createOffer({
        'offerToReceiveAudio': true,
        'offerToReceiveVideo': true
    });
    await peerConnection.setLocalDescription(offer);

    sg.send(`SEND.${channel} ${JSON.stringify(offer)}`);
    sg.onmessage = async (message) => {
        message = trimRecv(message.data)
        if(message.startsWith('ice'))
        {
            message = message.slice('ice '.length)
            message = JSON.parse(message)
            await peerConnection.addIceCandidate(message);
        }
        else if (message !== JSON.stringify(offer)) {
            message = JSON.parse(message)

            await peerConnection.setRemoteDescription(new RTCSessionDescription(message));
        }
    };
}

var answer = ""

sg.onmessage = async (message) => {
    message = message.data
    message = trimRecv(message)
    if(message.startsWith('ice'))
    {
        message = message.slice('ice '.length)
        message = JSON.parse(message)
        await peerConnection.addIceCandidate(message);
    }
    else if (message !== JSON.stringify(answer)) {
        message = JSON.parse(message)

        peerConnection.setRemoteDescription(new RTCSessionDescription(message));
        answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        sg.send(`SEND.${channel} ${JSON.stringify(answer)}`);
        sg.send(`JOIN.${channel}/ice`)
    }
};

peerConnection.addEventListener('icecandidate', event => {
    if (event.candidate) {
        sg.send(`SEND.${channel}/ice ${JSON.stringify(event.candidate)}`);
    }
});

if(answer == "")
peerConnection.addEventListener('iceconnectionstatechange', event => {
    switch(peerConnection.iceConnectionState)
    {
      case 'connected':
        let dc = peerConnection.createDataChannel("dc");
      dc.onopen = function(event) {
        channel.send('Hi you!');
      }
      dc.onmessage = function(event) {
        console.log(event.data);
      }
        break;
    }
});

peerConnection.ondatachannel = function(event) {
  var dc = event.channel;
    dc.onopen = function(event) {
    dc.send('Hi back!');
  }
  dc.onmessage = function(event) {
    console.log(event.data);
  }
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
