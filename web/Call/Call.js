navigator.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
const stream = navigator.mediaDevices.getUserMedia(
    config.constraints
);
stream.then(streamlet => {
    document.querySelector(`${config.namespace} > #call`).srcObject = streamlet;
})
pc1 = new RTCPeerConnection(null);
pc2 = new RTCPeerConnection(null);


pc1.createOffer({
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
}).then(
    (desc1) => {

        pc1.setLocalDescription(desc1)
        pc2.setRemoteDescription(desc1);

        pc2.createAnswer((desc2) => {
            pc2.setLocalDescription(desc2);
            pc1.setRemoteDescription(desc2)
        })
        pc1.onicecandidate = (candidate) => {
            console.log(candidate)
            pc1.addIceCandidate(candidate.candidate)
        };
        pc2.onicecandidate = (candidate) => {
            console.log(candidate)
            pc2.addIceCandidate(candidate.candidate)
        };
    }
)