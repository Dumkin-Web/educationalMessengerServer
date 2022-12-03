const jwt = require('jsonwebtoken')
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
                    case 'newMessage':
                        this.newMessage(data, ws)
                        break;
                    
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

    static disconnect(phone, ws){ // доделать

    }

    static newMessage({payload}, ws){
        //обработка сообщения
    }
}