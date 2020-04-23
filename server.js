const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const port = 3000

const {userJoin, removeUserOnLeave} = require('./utils/users')

app.use(express.static('public'))

io.on('connection', (socket) => {
    console.log('User connected')

    socket.on('join room', ({username, room}) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)
        console.log(username)

        socket.emit('message', `Welcome ${username}`)

        socket.broadcast.to(user.room).emit('message', `${username} has joined the chat`)
    })

    socket.on('message', (message) => {
        io.emit('message', message)
    })

    //runs when clientdisconnect
    socket.on('disconnect', () => {
        //Check which user that leaves
        const user = removeUserOnLeave(socket.id)

        if(user){
            io.to(user.room).emit('message', `${user.username} has left the chat`)
        }

    })
})

http.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
})