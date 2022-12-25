const WebSocket = require( "ws");
const MessageHandler = require('./WSMessageHandlers')
const dbController = require('../db/dbController')

module.exports = class webSocketServer{
    constructor(server){
        this.wsServer = new WebSocket.Server({ server });

        this.wsServer.on('connection', (ws,req) => {

            const params = new URLSearchParams(req.url.replace("/", ""));
            const token = params.get("token")
            if(token){
                req.headers.authorization = "Bearer " + token
            }

            MessageHandler.jwtVerify(req, ws) //проверка токена и выдача нового
            .then((phone) => {
                dbController.savePhoneAndWS(phone, ws); //сохранение ассоциации телефона и соккета в статическую переменную 
                dbController.setOnline(phone); //изменение стевого статуса

                ws.on('message', (message) => {
                    try{
                        message = String(message) //преобрахование сообщение
                        const data = JSON.parse(message); // парсинг сообщения
        
                        MessageHandler.handler(data, ws, req) //обработка сообщения
                    }
                    catch(e){
                        ws.send(JSON.stringify({"route": "onError", "payload": "jsonError"}))
                    }
                })
            })
            .catch( e => {
                ws.close(1013, "Пользователь не авторизован")
            })
         
            ws.on("error", e =>  ws.send(response.response("onError", "serverError")));
            
            ws.on('close', e =>{
                if(e != 1013){
                    dbController.setOffline(ws) //изменение сетевого статуса
                }
                dbController.deletePhoneAndWS(ws); //удаление ассоциации телефона и соккета в статическую переменную 
            })

        });
    }
}