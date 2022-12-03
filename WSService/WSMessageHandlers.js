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

            ws.send(JSON.stringify(new response("newJwt", newJWT)))

            resolve(decodeData.phone)
        })
    }

    static handler(data, ws, req){

        this.jwtVerify(req, ws)

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

    }
}