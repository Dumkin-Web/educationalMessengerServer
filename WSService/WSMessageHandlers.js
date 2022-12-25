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
                        this.getMessages(data, ws)
                        break;
                    case 'getDialogs':
                        this.getDialogs(data, ws)
                        break;

                    //DEFAULT
                    default:
                        ws.send(response.response("onError", "routeNotFound"))
                        break;
                }
            }
            catch(e){
                console.log(e)
                ws.send(response.response("onError", "wsRouteError"))
            }
        })
        .catch(e => {
            ws.close(1013, "Пользователь не авторизован")
        })

    }

    static newMessage({payload}, ws){
        try{
            console.log("New message");
            const newMessage = dbController.newMessage(payload)
            const dialog = dbController.getDialog(payload.dialog_id)
            
            dialog.members.forEach((phone) => {

                const responsePayload = {
                    newMessage,
                    dialog,
                    allDialogs: dbController.getAllDialogs(phone)
                }

                try{
                    dbController.phoneWS[phone].send(response.response("newMessage", responsePayload))
                }
                catch(e){

                }
            })
        }catch(e){
            console.log(e)
            ws.send(response.response("onError", "newMessageNotSended"))
        }
    }

    static newDialog({payload}, ws){
        try{
            console.log("New dialog");
            let dialogExists = false//Если создается диалог, то проверяется наличие такового в БД
            dbController.users[ws.userPhonePrivateProperty].dialogsIds.forEach( dialog_id => {
                if(dbController.users[payload.members[0]].dialogsIds.includes(dialog_id)) dialogExists = true
            })

            if(!dialogExists) //Если диалог существует, то новый не создается
            {
                const newDialog = dbController.newDialog(ws.userPhonePrivateProperty, payload)

                newDialog.members.forEach((phone) => {

                    const responsePayload = {
                        newDialog: newDialog,
                        allDialogs: dbController.getAllDialogs(phone)
                    }

                    try{
                        dbController.phoneWS[phone].send(response.response("newDialog", responsePayload))
                    }
                    catch(e){
                        
                    }
                })
            }
            else{
                ws.send(response.response("onError", "dialogExists"))
            }
        }catch(e){
            console.log(e)
            ws.send(response.response("onError", "userIsNotExisting"))
        }
    }

    static getMessages({payload}, ws){
        ws.send(response.response("getMessages", dbController.getMessages(payload)))
    }

    static getDialogs({payload}, ws){
        try{
            console.log("Get all dialogs");
            ws.send(response.response("getDialogs",dbController.getAllDialogs(ws.userPhonePrivateProperty)))
        }
        catch(e){

        }
    }


    //NETWORK STATUS CHANGING //TODO
    static onOnline(){

    }

    static onOffline(){

    }
}