const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const User = require('../Models/UserModel')
const Message = require('../Models/MessageModel')
const Dialog = require('../Models/DialogModel')

class dbController{

    static dialogs = {}
    static users = {}
    static usernamePhone = {} //need to init
    static phoneWS = {}


    //Работа с файлами бд
    static init(){ //extracting actual db information in variables

        const initUsernamesAndPhone = () =>{
            const temp = {}
            Object.keys(this.users).forEach((phone) =>{
                const nickname = this.users[phone].username
                temp[nickname] = phone
            })
            return temp
        }

        const initSetOffline = () => {
            Object.keys(this.users).forEach((phone) => {
                this.users[phone].isOnline = false;
                this.users[phone].lastTimeOnline = Date();
            })
            //this.#saveData() //enable on prod
        }

        try{
            //INIT USERS
            this.users = JSON.parse(fs.readFileSync(path.join(__dirname, '../db/users.json')));
            //INIT DIALOGS
            this.dialogs = JSON.parse(fs.readFileSync(path.join(__dirname, '../db/dialogs.json')));
            //INIT MATCH DB BETWEEN USERNAMES AND PHONE NUMBERS
            this.usernamePhone = initUsernamesAndPhone();

            initSetOffline()
            console.warn("\nDb was successefully initiated\n");
        }
        catch(e)
        {
            throw new Error('Db loading problem')
        }
    }

    static #saveData(){ //saving actual db information in files
        try{
            //SAVING USERS
            fs.writeFileSync(path.join(__dirname, '../db/users.json'), JSON.stringify(this.users));
            //SAVING DIALOGS
            fs.writeFileSync(path.join(__dirname, '../db/dialogs.json'), JSON.stringify(this.dialogs));
        }
        catch(e){
            // throw new Error('Db saving problem') //СПОРНОЕ РЕШЕНИЕ
        }
    }

    //
    static newUser(username, name, surname, phone, password, imageBASE64) { //creating new user
        try{
            if(!this.users[phone]){
                this.users[phone] = new User(username, name, surname, password, imageBASE64);
                console.log("new user created");
                this.#saveData();
                return true
            }
            else{
                console.log("User is already exists");
                return false
            }
        }
        catch(e){
            console.log(e);
            throw new Error('Creating new user provided an error')
        }

    }

    static userExistence(phone){
        try{
            if(this.users[phone]) return this.users[phone]
            return false
        }catch(e){
            throw new Error('Error via searching of user')
        }
    }


    //Действия с аккаунтом пользователя
    static setOnline(phone){
        try{
            this.users[phone].isOnline = true;
        }catch(e){
            throw new Error('')
        }
    }

    static setOffline({userPhonePrivateProperty}){
        try{
            this.users[userPhonePrivateProperty].isOnline = false;
            this.users[userPhonePrivateProperty].lastTimeOnline = Date();
        }catch(e){
            console.log(e)
        }
    }

    static changeUserData(body, {phone}){
        try{
            Object.assign(this.users[phone], body)
            this.#saveData();

        }catch(e){
            throw new Error('Error via changing data')
        }
    }

    static addNewContact({phone}, contact){ //change
        try{
            if(this.userExistence(contact) && contact != phone && !this.users[phone].contacts.includes(contact)){
                this.users[phone].contacts.push(contact)
                this.users[contact].inContacts.push(phone)
                this.#saveData();
                return true
            }
            return false
        }catch(e){
            throw new Error('Error via adding new contact')
        }
    }

    static getStatusOfContacts({phone}){
        try{
            const data = this.users[phone].contacts.sort((a, b) =>{
                if(this.users[a].isOnline){
                    if(this.users[b].isOnline){
                        return 0;
                    }
                    return -1;
                }
                else{
                    if(this.users[b].isOnline){
                        return 1;
                    }

                    return (new Date(this.users[b].lastTimeOnline)).getTime() - (new Date(this.users[a].lastTimeOnline)).getTime()
                }
            })

            return data.map((contact) => {
                return Object.assign({"phone": contact}, User.getNonPrivateInfo(this.users[contact]))
            })
        }catch(e){
            throw new Error('Error getting and sorting contacts')
        }
    }

    static getUserData(phone){
        return User.getNonPrivateInfo(this.users[phone])
    }

    //WS
    static savePhoneAndWS(phone, ws){
        try{
            ws.userPhonePrivateProperty = phone
            this.phoneWS[phone] = ws;
        }
        catch(e)
        {
            
        }
    }

    static deletePhoneAndWS({userPhonePrivateProperty}){
        try{
            delete this.phoneWS[userPhonePrivateProperty]
        }
        catch(e)
        {

        }
    }

    static newDialog(phone, {dialog_name, type, members, imageBASE64, admin_id}){
        try{
            const newMembers = new Set();
            newMembers.add(phone)
            members.forEach((member) => {
                if(!this.userExistence(member)) throw new Error('Пользователь не существует')
                newMembers.add(member)
            })
            
            if(newMembers.size == 1){
                throw new Error('Нельзя создать диалог с самим собой')
            }
            console.log(newMembers);
            members = Array.from(newMembers)

            const newDialog = new Dialog(dialog_name, type, members, imageBASE64, admin_id)
            this.dialogs[newDialog.dialog_id] = newDialog

            members.forEach((phone) =>{
                this.users[phone].dialogsIds.push(newDialog.dialog_id)
            })

            this.#saveData()

            return newDialog
        }catch(e){
            throw new Error('Пользователь не существует')
        }
    }

    static newMessage({dialog_id, user_id, message_text, type, media, tags}){
        try{
            const newMessage = new Message(user_id, message_text, type, media, tags)
            this.dialogs[dialog_id].messages[newMessage.message_id] = newMessage
            this.dialogs[dialog_id].lastMessageTime = newMessage.time

            this.#saveData()

            return newMessage
        }catch(e){
            throw new Error('')
        }
    }

    static getDialog(dialog_id){
        try{
            return this.dialogs[dialog_id]
        }catch(e){
            throw new Error('')
        }
    }

    static getAllDialogs(phone){
        try{
            const allDialogs = []
            this.users[phone].dialogsIds.forEach((dialog_id) => {
                allDialogs.push(this.dialogs[dialog_id])
            })

            allDialogs.sort((a, b) => {
                return +b.lastMessageTime - +a.lastMessageTime
            })


            console.log("Sorting");
            console.log(allDialogs.length)
            allDialogs.forEach((dialog) => {
                console.log(new Date(dialog.lastMessageTime))
            })

            return allDialogs
        }catch(e){
            throw new Error('')
        }
    }

    static getMessages({dialog_id}){
        
        return Object.values(this.dialogs[dialog_id].messages)
    }
}

module.exports = dbController