const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const User = require('../Models/dbModels')

class dbController{

    static dialogs = {}
    static users = {}

    static init(){ //extracting actual db information in variables
        try{
            this.users = JSON.parse(fs.readFileSync(path.join(__dirname, '../dbFiles/users.json')));
            this.dialogs = JSON.parse(fs.readFileSync(path.join(__dirname, '../dbFiles/dialogs.json')));
            console.log("Db was successefully initiated");
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
            console.log(e)
            throw new Error('Creating new user provided an error')
        }

    }

    static userExistence(phone){
        try{
            if(this.users[phone]) return this.users[phone]
            return false
        }catch(e){
            console.log(e)
        }
    }

    static newDialog(){
        try{

        }catch(e){

        }
    }

    static newMessage(){
        try{

        }catch(e){
            
        }
    }

    static setOnline(){
        try{

        }catch(e){
            
        }
    }

    static setOffline(){
        try{

        }catch(e){
            
        }
    }
}

module.exports = dbController