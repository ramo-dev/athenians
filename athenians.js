const express = require("express");
const http = require("http");
const app = express();

app.use(express.json());
const server = http.createServer(app);


server.listen(3001, ()=>{
    console.log('Its alive')
})