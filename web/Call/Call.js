const sg = new WebSocket('ws://nc.zergal.net:8000');

async function callOther() {
    const peerConnection = new RTCPeerConnection(
        { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
    );
    signalingChannel.addEventListener('message', async message => {
        if (message.answer) {
            const remoteDesc = new RTCSessionDescription(message.answer);
            await peerConnection.setRemoteDescription(remoteDesc);
        }
    });
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    signalingChannel.send({ 'offer': offer });
}


navigator.mediaDevices.getUserMedia(config.constraints).then((streamlet) => {
    let video = document.querySelector(`${config.namespace} > #call`)
    video.srcObject = streamlet;
}).catch(function (err) {
    alert("Camera not found")
});
);
