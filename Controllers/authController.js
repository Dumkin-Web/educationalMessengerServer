const dbController = require('./dbController')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {secret} = require('../config')
const { changeUserData } = require('./dbController')

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

            const hashPassword = bcryptjs.hashSync(password, 7)

            const response = dbController.newUser(username, name, surname, phone, hashPassword, imageBlob)

            response ? res.status(201).json({message: "Пользователь успешно зарегестрирован!"}) : res.status(400).json({message: "Похоже, вы уже зарегистрированы в системе"});
        } catch(e){

        }
    }

    async login(req, res){
        try{
            const {phone, password} = req.body
            const user = dbController.userExistence(phone);
            if(user && bcryptjs.compareSync(password, user.password)){
                const token = generateAccesToken(phone, user.name)
                res.status(200).json({message: "Авторизация прошла успешно", token: token})
            }
            res.status(400).json({message: "Invailid phone number or password"})
        } catch(e){
            
        }
    }

    async settings(req, res){
        try{
            const token = req.headers.authorization.split(' ')[1];
            if(!token){
                res.status(401).json({message: "Пользователь не авторизован"})
            }
            const decodeData = jwt.verify(token, secret)
            
            if(dbController.changeUserData(req.body, decodeData)){
                res.status(200).json({message: 'Данные успешно изменены'})
            }

            res.status(500).json({message: "Ошибка при изменении данных"})
        } catch(e){
            
            res.status(401).json({message: "Пользователь не авторизован"})
        }
    }
}

module.exports = new authController()