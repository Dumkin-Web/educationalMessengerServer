const express = require('express');
const dotenv = require('dotenv');
const http = require("http");
const webSocketServer = require('./WSService/webSocketServer');
var cors = require('cors');
const dbController = require('./db/dbController');
const authRouter = require('./Routers/authRouter');
const mainRouter = require('./Routers/mainRouter');


dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app); //creating http Server

const wsServer = new webSocketServer(server); //creating WebSocket Server

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cors({
    "origin": "*",
}))
app.use('/auth', authRouter) //роутер для регистрации и авторизации
app.use('/api', mainRouter) //роутер для доступа к функциям сервера

const start = () =>{
    try{
        server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
        dbController.init();
        initForTesting(); //убрать в проде
    }
    catch(e){
        console.log(e);
    }
}

start()//запуск сервера

function initForTesting(){
    //console.log(Object.keys(dbController.users))
}