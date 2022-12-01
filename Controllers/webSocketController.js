const WebSocket = require( "ws");

class webSocketServer{
    constructor(server){
        this.wsServer = new WebSocket.Server({ server });

        this.wsServer.on('connection', ws => {

            console.log('new connection')

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

module.exports = webSocketServer