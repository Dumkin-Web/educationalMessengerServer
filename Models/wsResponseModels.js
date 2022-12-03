class wsResponse{
    constructor(header, payload){
        this.header = header
        this.payload = payload
    }

    #stringifyRespons(){
        return JSON.stringify(this)
    }

    static response(header, payload){
        return (new wsResponse(header, payload)).#stringifyRespons()
    }
}

module.exports = wsResponse