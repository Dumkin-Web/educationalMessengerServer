const dbController = require('../db/dbController')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const { changeUserData } = require('../db/dbController')

const jwtVerify = (token) =>{ //проверка токена
    if(!token){
        throw new Error('Токен отсутствует')
    }

    return decodeData = jwt.verify(token, process.env.JWT_ACCES_SECRET)
}

class mainController{

    async changeSettings(req, res){//изменение данных профиля пользователя
        try{
            const decodeData = jwtVerify(req.headers.authorization.split(' ')[1])
            
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
            const decodeData = jwtVerify(req.headers.authorization.split(' ')[1])

            if(dbController.addNewContact(decodeData, req.body.contact)) return res.status(200).json({message: 'Контакт добавлен'});

            return res.status(404).json({message: 'Пользователя с указанным номер телефона не существует или вы указали свой номер телефона'})
        } catch(e){
            return res.status(401).json({message: "Пользователь не авторизован"})
        }
    }

    getStatusOfContacts(req, res){
        try{
            const decodeData = jwtVerify(req.headers.authorization.split(' ')[1])

            const responseData = dbController.getStatusOfContacts(decodeData);

            return res.status(200).json({message: 'Статус пользователей в контактах', data: responseData})
        } catch(e){
            return res.status(401).json({message: "Пользователь не авторизован"})
        }
    }

    getUserData(req, res){
        try{
            console.log(req.query)
            //const decodeData = jwtVerify(req.headers.authorization.split(' ')[1])

            const responseData = dbController.getUserData(req.query["phone"]);
            responseData.phone = req.query["phone"]
            return res.status(200).json({message: 'Данные пользователя', data: responseData})
        } catch(e){
            return res.status(401).json({message: "Пользователь не авторизован"})
        }
    }
}

module.exports = new mainController()