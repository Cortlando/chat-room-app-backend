const express = require('express')
const http = require('http');
const { Server } = require("socket.io");

// const express = require('express'),
//     app = express(),
//     server = require('http').createServer(app),
//     io = require('socket.io').listen(server)

const INDEX = '/index.html';

//server.listen(process.env.PORT || 3000);

const app = express()
const server = http.createServer(app);

// app.use((req, res) => res.sendFile(INDEX, {root: __dirname}))
// .listen(process.env.PORT || 4000)
const corsOptions={
    cors: true,
    origins:["https://cortlando.github.io/chat-room-app-frontend/"],
   }
   

app.use((req, res) => res.sendFile(INDEX, {root: __dirname}))   
const io = new Server(server, corsOptions);

const port = process.env.PORT || "4000"

function getRandomInt() {
    return Math.floor(Math.random() * 1000);
  }

let guestNum = getRandomInt()

io.on('connection', (socket) => {
    console.log('a user connected')

   socket.emit(io.sockets.adapter.rooms)

    console.log(io.sockets.adapter.rooms)
    socket.on('connect', () => {
        console.log("This happened")
    })

    socket.on('disconnect', () =>{
        console.log('User Disconnected')
    })

    socket.on('join room', (roomName) => {
        console.log("Joined Room")
        console.log(roomName)
    })

    //This one is the one that actually adds people to a room, depsite not being join room
    socket.on('create', function(room) {
        socket.join(room + "+")
        console.log(room)
    })

    socket.on('sendMessage', ({message, user, roomName}) => {
       
        console.log('message: ' + message)
        let nickname = ''
        user === undefined ? nickname = `Guest ${guestNum}` : nickname = user.nickname
        
        
        
        socket.broadcast.to(`${roomName + '+'}`).emit('recieveMessage', {message, nickname})
    })


    let rooms = io.sockets.adapter.rooms
    console.log(rooms + "THese the rooms")
    socket.emit("sentRooms", {roomList: JSON.stringify(Array.from(rooms))})
})




server.listen(port, () => {
    console.log('listening on *:' + port);
  });