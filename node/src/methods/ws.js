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
                addTo: (rec, id) => {
                    return module.exports.channel.addTo(this.wss, rec, id);
                },
                has: (rec, id) => {
                    return module.exports.channel.has(this.wss, rec, id);
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
        has: (wss, rec, id) => {
            if (!wss._channels[rec])
                wss.Channel.create(rec);
            return wss._channels[rec].includes(id);
        },
        create: (wss, rec) => {
            wss._channels[rec] = [];
        },
        addTo: (wss, rec, id) => {
            if (!wss._channels[rec])
                wss.Channel.create(rec);
            wss._channels[rec].push(id);
        },
        sendTo(wss, rec, msg) {
            [...wss.srv.clients].filter(client => {
                let id = client._socket.server.sessionIdContext
                return rec == "all" ? true : wss.Channel.has(rec, id);
            }).forEach(client => {
                if (client.readyState === require('ws').OPEN) {
                    client.send(msg);
                }
            })
        }
    }
}