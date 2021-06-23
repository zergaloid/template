require('dotenv').config()

const fs = require('fs');
const https = require('https');
const ws = require('./methods/ws');

const server = https.createServer({

    // self-signed Certificate
    cert: fs.readFileSync(process.env.PATH_TO_CERT),
    key: fs.readFileSync(process.env.PATH_TO_KEY),
    passphrase: process.env.CERT_PASS
})

ws.config({
    server,
    // WS server handler
    handler: (sock) => {
        sock.ws.on('message', (message) => {
            if (Buffer.isBuffer(message)) {
                sock.wss.Channel.sendTo('stream', message)
            }
            else {
                let call = message.split(' ')[0]
                let cmd =
                {
                    call: call.split('.'),
                    arg: message.slice(call.length + 1)
                };
                switch (cmd.call[0]) {
                    case 'SEND':
                        sock.wss.Channel.sendTo(cmd.call[1], `RECV.${cmd.call[1]} ${cmd.arg}`)
                        break;
                    case 'JOIN':
                        sock.wss.Channel.addTo(cmd.call[1], sock.ws._socket.server.sessionIdContext)
                        break;
                }
            }
        });
    }
})



const port = process.env.WS_PORT || obj.port || 8080
server.listen(port)

if (process.env.NODE_ENV == 'development')
    console.info(`port: ${port}`, `server: '${server.address().address}'`)