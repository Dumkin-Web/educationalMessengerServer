const { v4: uuidv4 } = require('uuid');

module.exports = class Message{
    constructor(user_id, message_text, type, read, edited, media, tags){
        this.message_id = uuidv4();
        this.user_id = user_id
        this.message_text = message_text
        this.type = type
        this.read = read
        this.edited = edited
        this.media = media
        this.time = (new Date()).getTime()
        this.tags = tags
    }
}