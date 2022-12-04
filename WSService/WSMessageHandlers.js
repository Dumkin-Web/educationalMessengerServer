const jwt = require('jsonwebtoken');
const dbController = require('../db/dbController');
const response = require('../Models/wsResponseModels')

module.exports = class MessageHandler{

    static async jwtVerify(req, ws){ //проверка токена
        const token = req.headers.authorization.split(' ')[1];

        return new Promise((resolve, reject) => {
            if(!token){
                 reject(new Error('Токен отсутствует'))
            }

            const decodeData = jwt.verify(token, process.env.JWT_ACCES_SECRET)

            const payload = {
                phone: decodeData.phone,
                creationTime: (new Date().getTime())
            }
            const newJWT = jwt.sign(payload, process.env.JWT_ACCES_SECRET, {expiresIn: "24h"})

            ws.send(response.response("newJwt", newJWT))

            resolve(decodeData.phone)
        })
    }

    static handler(data, ws, req){ //обработчик запросов соккета

        this.jwtVerify(req, ws)
        .then( phone => {
            try{
                switch (data.route){ // роуты соккета

                    //CREATE
                    case 'newMessage':
                        this.newMessage(data, ws)
                        break;
                    case 'newDialog':
                        this.newDialog(data, ws)
                        break;

                    //GET
                    case 'getMessages':
                        this.newMessage(data, ws)
                        break;
                    case 'getDialogs':
                        this.newDialog(data, ws)
                        break;

                    //DEFAULT
                    default:
                        ws.send(response.response("onError", "routeNotFound"))
                        break;
                }
            }
            catch(e){
                ws.send(response.response("onError", "wsRouteError"))
            }
        })
        .catch(e => {
            ws.close(1013, "Пользователь не авторизован")
        })

    }

    static newMessage({payload}, ws){
        try{
            const newMessage = dbController.newMessage(payload)
            const payload = {
                newMessage,
                //fullDialog here
            }
            ws.send(response.response("newMessage", ))
        }catch(e){
            ws.send(response.response("onError", "newMessageNotSended"))
        }
    }

    static newDialog({payload}, ws){
        try{
            const newDialog = dbController.newDialog(ws.userPhonePrivateProperty, payload)
        }catch(e){
            ws.send(response.response("onError", "userIsNotExisting"))
        }
    }




    //NETWORK STATUS CHANGING //TODO
    static onOnline(){

    }

    static onOffline(){

    }
}