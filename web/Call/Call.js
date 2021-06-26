let sg = new WebSocket(config.wsHost);

sg.onopen = async () => {
    let callButton = document.querySelector(config.callButton)
    callButton.addEventListener('click', e => callTo(channel))
    sg.send(`JOIN.${channel}`)
}

navigator.mediaDevices.getUserMedia(config.constraints).then((streamlet) => {
    let video = document.querySelector(`${config.namespace} > #call`)
    video.srcObject = streamlet;
})
