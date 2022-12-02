const dbController = require('../dbFiles/dbController')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {secret} = require('../config')
const { changeUserData } = require('../dbFiles/dbController')

const generateAccesToken = (phone, name) => {
    const payload = {
        phone
    }

    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

class authController{
    async reg(req, res){
        try{
            const {username, name, surname, password, phone, imageBlob} = req.body

            //проверка данных
            if(!password || !phone || !username || !name || !surname) return res.status(400).json({message: "Ошибка данных"});

            const hashPassword = bcryptjs.hashSync(password, 7)

            if(dbController.newUser(username, name, surname, phone, hashPassword, imageBlob)) return res.status(201).json({message: "Пользователь успешно зарегестрирован!"});

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
                const token = generateAccesToken(phone, user.name)
                return res.status(200).json({message: "Авторизация прошла успешно", token: token})
            }
            return res.status(400).json({message: "Invailid phone number or password"})
        } catch(e){
            return res.status(500).json({message: 'Ошибка сервера'})
        }
    }
}

module.exports = new authController()