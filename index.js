const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const corsOptions={
    cors: true,
    origins:["http://localhost:3000"],
   }
   
const io = new Server(server, corsOptions);

const port = process.env.PORT || "4000"

function getRandomInt() {
    return Math.floor(Math.random() * 1000);
  }



io.on('connection', (socket) => {
    console.log('a user connected')
    let guestNum = getRandomInt()
   // socket.emit(io.sockets.adapter.rooms)

   //io.emit(io.sockets.adapter.rooms)
   socket.emit(io.sockets.adapter.rooms)

    console.log(io.sockets.adapter.rooms)
    socket.on('connect', () => {
        console.log("This happened")
    })

    socket.on('disconnect', () =>{
        console.log('User Disconnected')
    })

    
    //Prints out the name of the room when someone join/creates room
    socket.on('join room', (roomName) => {
        console.log("Joined Room")
        console.log(roomName)
    })

    //This one is the one that actually adds people to a room, depsite not being join room
    socket.on('create', function(room) {
        socket.join(room + "+")
        console.log(room)
    })

    //Gets the message that was sent and sends the message to all the users
    socket.on('sendMessage', ({message, user, roomName}) => {
       // console.log("aaaaaaa")
        console.log('message: ' + message)
        //Gets the name of the person that sent the message(or gives them a guest name)
        let nickname = ''
        user === undefined ? nickname = `Guest ${guestNum}` : nickname = user.nickname
        
        
        //socket.to(`${roomName}`).emit('recieveMessage', {message})
        //Sends message and name to everyone but the sender of the message
        socket.broadcast.to(`${roomName + '+'}`).emit('recieveMessage', {message, nickname})
    })

    // socket.on('getRooms', ({rooms}) =>{
    //     rooms = io.sockets.adapter.rooms
        
        
    // })
    let rooms = io.sockets.adapter.rooms
    console.log(rooms + "THese the rooms")
    socket.emit("sentRooms", {roomList: JSON.stringify(Array.from(rooms))})
})

//setInterval(() => console.log(io.sockets.adapter.rooms), 5000)


server.listen(port, () => {
    console.log('listening on *:' + port);
  });