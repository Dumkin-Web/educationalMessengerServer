const { v4: uuidv4 } = require('uuid');

module.exports = class Dialog{
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