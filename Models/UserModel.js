

module.exports = class User{
    constructor(username, name, surname, password, imageBlob){
        this.username = username ?? "Имя пользователя"
        this.name = name ?? "Имя"
        this.surname = surname ?? "Фамилия"
        this.password = password
        this.imageBlob = imageBlob ?? "none"
        this.dialogsIds = []
        this.contacts = []
        this.lastTimeOnline = new Date()
        this.isOnline = false
        this.inContacts = [] //
    }

    static getNonPrivateInfo({username, name, surname, imageBlob, lastTimeOnline, isOnline}){
        return {username, name, surname, imageBlob, lastTimeOnline, isOnline}
    }
}