const WebSocket = require( "ws");

module.exports = class webSocketServer{
    constructor(server){
        this.wsServer = new WebSocket.Server({ server });

        this.wsServer.on('connection', ws => {

            ws.on('message', (message) => {
                message = String(message)
                const data = JSON.parse(message);

                switch (data.header){
                    case 'message':
                        //handler
                        break;
                    case 'auth':
                        //handler
                        break;
                    case 'allMessages':
                        //handler
                        break;
                    default:
                        break;
                }

            })

            ws.on('message', m => {
                //handler
            });
         
            ws.on("error", e => ws.send(e));
            
            ws.on('close', e =>{
                console.log('connection lost')
            })

        });
    }
}