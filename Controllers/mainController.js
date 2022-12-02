const dbController = require('../dbFiles/dbController')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {secret} = require('../config')
const { changeUserData } = require('../dbFiles/dbController')

const jsonVerify = (token) =>{ //проверка токена
    if(!token){
        throw new Error('Токен отсутствует')
    }
    return decodeData = jwt.verify(token, secret)
}

class mainController{

    async changeSettings(req, res){//изменение данных профиля пользователя
        try{
            const decodeData = jsonVerify(req.headers.authorization.split(' ')[1])
            
            try{
                dbController.changeUserData(req.body, decodeData)
                return res.status(200).json({message: 'Данные успешно изменены'})
            }
            catch(e){
                console.log(e)
                return res.status(500).json({message: "Ошибка при изменении данных"})
            }

        } catch(e){
            
            return res.status(401).json({message: "Пользователь не авторизован"})
        }
    }

    async addNewContacts(req, res){//добавление нового контакта
        try{
            //проверка токена
            const token = req.headers.authorization.split(' ')[1];
            if(!token){
                return res.status(401).json({message: "Пользователь не авторизован"})
            }
            const decodeData = jwt.verify(token, secret)


            dbController.addNewContact(decodeData, req.body.contact)

            return res.status(200).json({message: 'Контакт добавлен'})
        } catch(e){
            return res.status(401).json({message: "Пользователь не авторизован"})
        }
    }

    async getStatusOfContacts(req, res){
        try{
            const token = req.headers.authorization.split(' ')[1];
            if(!token){
                return res.status(401).json({message: "Пользователь не авторизован"})
            }
            const decodeData = jwt.verify(token, secret)

            dbController.getStatusOfContacts(decodeData)

            return res.status(200).json({message: 'Данные успешно изменены'})//change
        } catch(e){
            return res.status(401).json({message: "Пользователь не авторизован"})
        }
    }
}

module.exports = new mainController()