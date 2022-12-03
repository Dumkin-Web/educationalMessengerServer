const WebSocket = require( "ws");
const MessageHandler = require('./WSMessageHandlers')
const dbController = require('../db/dbController')

module.exports = class webSocketServer{
    constructor(server){
        this.wsServer = new WebSocket.Server({ server });

        this.wsServer.on('connection', (ws,req) => {

            MessageHandler.jwtVerify(req, ws) //проверка токена и выдача нового
            .then((phone) => {
                dbController.savePhoneAndWS(phone, ws); //сохранение ассоциации телефона и соккета в статическую переменную 


                ws.on('message', (message) => {
                    message = String(message) //преобрахование сообщение
                    const data = JSON.parse(message); //
    
                    MessageHandler.handler(data, ws, req) //обработка сообщения
    
                })
            })
            .catch( e => {
                ws.close(1013, "Пользователь не авторизован")
            })
         
            ws.on("error", e =>  ws.send(response.response("onError", "serverError")));
            
            ws.on('close', e =>{
                dbController.deletePhoneAndWS(ws);
            })

        });
    }
}