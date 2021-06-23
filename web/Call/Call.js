const socket = new WebSocket('wss://localhost:8000')

const stream = navigator.mediaDevices.getUserMedia(
    config.constraints
).then(streamlet => {
    let video = document.querySelector(`${config.namespace} > #call`);
    
})