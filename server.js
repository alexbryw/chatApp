const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const port = 3000

const {userJoin, removeUserOnLeave, getCurrentUser, getUsers} = require('./utils/users')

app.use(express.static('public'))


io.on('connection', (socket) => {
    console.log('User connected')

    socket.on('get userlist', (checkRequest) => {
        getUsers()
        socket.emit('post userlist', getUsers())
    })

    socket.on('join room', ({username, color, room}) => {
        console.log("from join room")
        const user = userJoin(socket.id, username, color, room)
        
        //Send userList to all users when new user joins.
        io.emit('roomList',{userList: getUsers()}) 
        console.log(getUsers())
        socket.join(user.room)
        console.log("userName: " + username)

        socket.emit('message', {color: 'green', message: `Welcome ${username}`})

        socket.broadcast.to(user.room).emit('message', {color: 'green', message: `${username} has joined the chat`})
    })

    //Leave old room and join the new room and update room in users.
    socket.on('change room', ({username, room}) => {
        console.log(username, room)
        const user = getCurrentUser(socket.id)

        if(user){
            io.to(user.room).emit('message', {color: 'green', message: `${user.username} has left the chat`})
            socket.leaveAll()// User leaves all rooms.
            user.room = room
            socket.join(user.room) //User joins new room.
            socket.broadcast.to(user.room).emit('message', {color: 'green', message: `${username} has joined the chat`})
            
            //Send updated room/user list to all clients on roomList.
            io.emit('roomList',{userList: getUsers()})
        }

    })
/* 
    socket.on('message', (message) => {
        io.emit('message', message)
    }) */

    //Listen for chat-message
    socket.on('message', (message) => {
        const user = getCurrentUser(socket.id)

        io.to(user.room).emit('message', {color: user.color, message: `${user.username}: ${message}`})
    })

    socket.on('someone writes', (writing) => {
        const user = getCurrentUser(socket.id)
        socket.broadcast.to(user.room).emit('writing', `${user.username} writes...`)

    })

    //runs when clientdisconnect
    socket.on('disconnect', () => {
        //Check which user that leaves
        const user = removeUserOnLeave(socket.id)

        if(user){
            io.to(user.room).emit('message', {color: 'green', message: `${user.username} has left the chat`})
            //Update all connected clients of the new user/room list.
            io.emit('roomList',{userList: getUsers()})
        }
        
        console.log("someone disconnected.")
    })

    //Send userList to all on connect.
    io.emit('roomList',{userList: getUsers()})
})

// let users = [
//     {
//         id: "97v9ds8f7fd89",
//         name: "Victor"
//     }
// ]

// function getAllRoomsWithClients() {
//     var availableRooms = [];
//     var rooms = io.sockets.adapter.rooms;
//     if (rooms) {
//         for (var room in rooms) {
//             if (!rooms[room].hasOwnProperty(room)) {

//                 let roomToPush = {
//                     name: "General",
//                     users: [
//                         "Victor",
//                         "Johan"
//                     ]
//                 }

//                 availableRooms.push(room);

//             }
//         }
//     }
//     return availableRooms;
// }

http.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
})