const express = require('express');
const dotenv = require('dotenv');
const http = require("http");
const webSocketServer = require('./Controllers/webSocketController');
const dbController = require('./Controllers/dbController');
const authRouter = require('./Routers/authRouter');


dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app); //creating http Server

const wsServer = new webSocketServer(server); //creating WebSocket Server

app.use(express.json());
app.use('/auth', authRouter) //using router

const start = () =>{
    try{
        server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
        dbController.init();
    }
    catch(e){
        console.log(e);
    }
}

start();

init(); //
function init(){
    //initialization of database
    //and list of id's and phones
}