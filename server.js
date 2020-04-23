const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const port = 3000

const {userJoin, removeUserOnLeave, getCurrentUser, getUsers} = require('./utils/users')

app.use(express.static('public'))

io.on('connection', (socket) => {
    console.log('User connected')

    socket.on('join room', ({username, room}) => {
        console.log("from join room")
        const user = userJoin(socket.id, username, room)
        console.log(getUsers())
        socket.join(user.room)
        console.log(socket.rooms)
        console.log(username)

        socket.emit('message', `Welcome ${username}`)

        socket.broadcast.to(user.room).emit('message', `${username} has joined the chat`)
    })

    socket.on('leave room', ({username, room}) => {
        console.log("from leave room")
        console.log(socket.rooms)
        console.log(getUsers())
        const user = removeUserOnLeave(socket.id)

        if(user){
            io.to(user.room).emit('message', `${user.username} has left the chat`)
        }
        socket.leaveAll()

        console.log("leave room " + room)
        console.log(getUsers())
    })
/* 
    socket.on('message', (message) => {
        io.emit('message', message)
    }) */

    //Listen for chat-message
    socket.on('message', (message) => {
        const user = getCurrentUser(socket.id)

        io.to(user.room).emit('message', `${user.username}: ${message}`)
    })

    //runs when clientdisconnect
    socket.on('disconnect', () => {
        //Check which user that leaves
        const user = removeUserOnLeave(socket.id)

        if(user){
            io.to(user.room).emit('message', `${user.username} has left the chat`)
            console.log("User disconnected.")
        }

    })
})

http.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
})