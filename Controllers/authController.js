const dbController = require('../db/dbController')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { changeUserData } = require('../db/dbController')

const generateAccesToken = (phone) => {
    const payload = {
        phone
    }
    return jwt.sign(payload, process.env.JWT_ACCES_SECRET, {expiresIn: "24h"})
}

class authController{
    async reg(req, res){
        try{
            const {username, name, surname, password, phone, imageBASE64} = req.body

            //проверка данных
            if(!password || !phone || !username || !name || !surname) return res.status(400).json({message: "Ошибка данных"});

            const hashPassword = bcryptjs.hashSync(password, 7)

            if(dbController.newUser(username, name, surname, phone, hashPassword, imageBASE64)){
                const token = generateAccesToken(phone)
                return res.status(201).json({message: "Пользователь успешно зарегестрирован!", token: token});
            }

            return res.status(400).json({message: "Похоже, вы уже зарегистрированы в системе"});
        } catch(e){
            console.log(e);
            return res.status(500).json({message: 'Ошибка сервера'})
        }
    }

    async login(req, res){
        try{
            const {phone, password} = req.body
            const user = dbController.userExistence(phone);
            if(user && bcryptjs.compareSync(password, user.password)){
                const token = generateAccesToken(phone)
                return res.status(200).json({message: "Авторизация прошла успешно", token: token})
            }
            return res.status(400).json({message: "Invailid phone number or password", token: "none"})
        } catch(e){
            return res.status(500).json({message: 'Ошибка сервера', token: "none"})
        }
    }

    async verifyJWT(req, res){
        try{
            const token = req.headers.authorization.split(" ")[1]

            jwt.verify(token, process.env.JWT_ACCES_SECRET)

            return res.status(200).json({message: "User is authorized"})
        } catch(e){
            return res.status(401).json({message: 'User is not authorized'})
        }
    }
}

module.exports = new authController()