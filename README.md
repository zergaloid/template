## Syncia Monorepo

1. node/ is for the websocket sync node:
    
    SEND.\<channel>
    
    JOIN.\<channel>

    Messages arrive in the following format:
    
    RECV.\<channel> \<message>

Setup requires an .env and snakeoil certs in /var/snakeoil:
```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
```
2. web/ is for the web interface, at the moment it is just WebRTC testing grounds
