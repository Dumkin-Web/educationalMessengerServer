const express = require('express');
const dotenv = require('dotenv');
const http = require("http");
const webSocketServer = require('./Controllers/webSocketController');
const dbController = require('./dbFiles/dbController');
const authRouter = require('./Routers/authRouter');
const mainRouter = require('./Routers/mainRouter');


dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app); //creating http Server

const wsServer = new webSocketServer(server); //creating WebSocket Server

app.use(express.json());
app.use('/auth', authRouter) //роутер для регистрации и авторизации
app.use('/api', mainRouter) //роутер для доступа к функциям сервера

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

init();
function init(){
    //initialization of database
    //and list of id's and phones
}