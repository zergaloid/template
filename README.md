## Syncia Monorepo

1. node/ is for the websocket sync node:
    
    SEND.<\channel>
    
    JOIN.<\channel>

    Messages arrive in the following format:
    
    RECV.<\channel> <\message>
2. web/ is for the web interface, at the moment it is just WebRTC testing grounds