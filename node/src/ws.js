const WebSocket = require('ws');

module.exports =
{
    wss: null,
    config: (obj) => {
        this.wss = {
            _channels: {},
            Channel: {
                sendTo: (rec, msg) => {
                    return module.exports.channel.sendTo(this.wss, rec, msg);
                },
                addTo: (rec, client) => {
                    return module.exports.channel.addTo(this.wss, rec, client);
                },
                create: (rec) => {
                    return module.exports.channel.create(this.wss, rec);
                }
            },
            srv: new WebSocket.Server({
                server: obj.server
            })
        };
        this.wss.srv.on('connection', (ws) => {
            ws.isAlive = true;
            ws.on('pong', () => ws.isAlive = true);
            obj.handler({
                ws,
                wss: this.wss
            });
        });
        setInterval(() => {
            this.wss.srv.clients.forEach(function each(ws) {
                if (!ws.isAlive) return ws.terminate();

                ws.isAlive = false;
                ws.ping();
            });
        }, 5000);
    },
    channel:
    {
        create: (wss, rec) => {
            wss._channels[rec] = [];
        },
        addTo: (wss, rec, client) => {
            if (!wss._channels[rec])
                wss.Channel.create(rec);
            wss._channels[rec].push(client);
        },
        sendTo(wss, rec, msg) {
            console.log(rec)
            try {
                wss._channels[rec].forEach(client => {
                    client.send(msg);
                })
            }
            catch (err) {
                console.error(err)
                console.error('no clients in channel')
            }
        }
    }
}