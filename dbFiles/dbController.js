const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const User = require('../Models/dbModels')

class dbController{

    static dialogs = {}
    static users = {}


    //Работа с файлами бд
    static init(){ //extracting actual db information in variables
        try{
            this.users = JSON.parse(fs.readFileSync(path.join(__dirname, '../dbFiles/users.json')));
            this.dialogs = JSON.parse(fs.readFileSync(path.join(__dirname, '../dbFiles/dialogs.json')));
            console.warn("\nDb was successefully initiated\n");
        }
        catch(e)
        {
            throw new Error('Db loading problem')
        }
    }

    static saveData(){ //saving actual db information in files
        try{
            fs.writeFileSync(path.join(__dirname, '../dbFiles/users.json'), JSON.stringify(this.users));
            fs.writeFileSync(path.join(__dirname, '../dbFiles/dialogs.json'), JSON.stringify(this.dialogs));
        }
        catch(e){
            throw new Error('Db saving problem')
        }
    }


    //
    static newUser(username, name, surname, phone, password, imageBlob) { //creating new user
        try{
            if(!this.users[phone]){
                this.users[phone] = new User(name, surname, password, imageBlob);
                console.log("new user created");
                this.saveData();
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

    static newDialog(){
        try{

        }catch(e){
            throw new Error('')
        }
    }

    static newMessage(){
        try{

        }catch(e){
            throw new Error('')
        }
    }


    //Действия с аккаунтом пользователя
    static setOnline(){
        try{

        }catch(e){
            throw new Error('')
        }
    }

    static setOffline(){
        try{

        }catch(e){
            throw new Error('')
        }
    }

    static changeUserData(body, {phone}){
        try{
            Object.assign(this.users[phone], body)
            this.saveData();

        }catch(e){
            throw new Error('Error via changing data')
        }
    }

    static addNewContact({phone}, contact){ //change
        try{
            if(this.userExistence(contact)){
                this.users[phone].contacts.push(contact)
                this.saveData();
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
                    return 1;
                }
                else{
                    if(this.users[b].isOnline){
                        return -1;
                    }

                    return Date(this.users[a].lastTimeOnline) - Date(this.users[b].lastTimeOnline)
                }
            })

            console.log(data)
        }catch(e){
            throw new Error('Error getting and sorting contacts')
        }
    }
}

module.exports = dbController