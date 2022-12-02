const { v4: uuidv4 } = require('uuid');

module.exports = class User{
    constructor(name, surname, password, imageBlob){
        this.name = name
        this.surname = surname
        this.password = password
        this.imageBlob = imageBlob
        this.dialogsIds = []
        this.contacts = []
        this.lastTimeOnline = new Date()
        this.isOnline = false
    }
}

class Dialog{
    constructor(dialog_name, type, members, imageBlob, admin_id){
        this.dialog_id = uuidv4();
        this.dialog_name = dialog_name
        this.type = type
        this.members = members
        this.messages = {}
        this.settings = {}
        this.imageBlob = imageBlob
        this.tags = {}
        this.admin_id = admin_id
    }
}

class Message{
    constructor(user_id, message_text, type, read, edited, media, time, tags){
        this.message_id = uuidv4();
        this.user_id = user_id
        this.message_text = message_text
        this.type = type
        this.read = read
        this.edited = edited
        this.media = media
        this.time = time
        this.tags = tags
    }
}