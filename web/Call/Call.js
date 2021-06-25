let sg = new WebSocket('wss://d8b42d423a13.ngrok.io');
const channel = 'stream'
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
            console.log(message)
            await peerConnection.addIceCandidate(message);
        }
        else if (message !== JSON.stringify(offer)) {
            message = JSON.parse(message)
            console.log(message)
            
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
        console.log(message)
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

peerConnection.addEventListener('connectionstatechange', event => {
    console.log(peerConnection.connectionState)
});

sg.onopen = async () => {
    let callButton = document.querySelector(`${config.namespace} > #callButton`)
    callButton.addEventListener('click', e => callTo(channel))
    sg.send(`JOIN.${channel}`)
}

navigator.mediaDevices.getUserMedia(config.constraints).then((streamlet) => {
    let video = document.querySelector(`${config.namespace} > #call`)
    video.srcObject = streamlet;
}).catch