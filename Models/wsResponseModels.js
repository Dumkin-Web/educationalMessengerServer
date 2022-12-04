class wsResponse{
    constructor(route, payload){
        this.route = route
        this.payload = payload
    }

    #stringifyRespons(){
        return JSON.stringify(this)
    }

    static response(route, payload){
        return (new wsResponse(route, payload)).#stringifyRespons()
    }
}

module.exports = wsResponse