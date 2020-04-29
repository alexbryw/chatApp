const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const port = 3000

const {userJoin, removeUserOnLeave, getCurrentUser, getUsers} = require('./utils/users')

let roomPasswordList = [{roomName: "main", password: ""}] 
let roomList = [] //not used only backup

app.use(express.static('public'))


io.on('connection', (socket) => {
    console.log('User connected')
    socket.leaveAll() //All new users leave all current rooms on first connection.

    //List of users to see if user name is available.
    socket.on('get userlist', (checkRequest) => { 
        socket.emit('post userlist', getUsers())
    })

    //First login you join the main room.
    socket.on('join room', ({username, color, room}) => {
        const user = userJoin(socket.id, username, color, room) //Add new user to utils/users.
        socket.leaveAll()// User leaves all current rooms before joining a new room.
        socket.join(user.room)
        io.emit('newRoomList', getAllRoomsWithClients())
        socket.emit('set currentRoom', user.room)
        socket.emit('message', {color: 'green', message: `Hello ${username}! Welcome to the ${user.room} room `})
        socket.broadcast.to(user.room).emit('message', {color: 'green', message: `${username} has joined the chat`})
    })

    //Leave old room and join the new room and update room in users.
    socket.on('change room', ({username, room, password}) => {
        // console.log(username, room, password)
        const user = getCurrentUser(socket.id)
        if(user.room !== room){
            if(user){
                const pwdRoom = roomPasswordList.find( ({ roomName }) => roomName === room)
                if(pwdRoom){
                    console.log("Room found will check if password is needed.")
                    if(pwdRoom.password){
                        console.log("password found , check password: ", pwdRoom.roomName, pwdRoom.password)
                        if(pwdRoom.password === password){
                            console.log("Password is correct , joining room: ")
    
                            socket.broadcast.to(user.room).emit('message', {color: 'green', message: `${username} has left the chat`})
                            socket.leaveAll()// User leaves all rooms.
                            user.room = room
                            socket.join(user.room) //User joins new room.
                            socket.emit('onPasswordTry', {isPasswordCorrect: true}) //Send message password is correct.
                            socket.emit('set currentRoom', user.room)
                            socket.emit('clean up', true)
                            socket.emit('message', {color: 'green', message: `${username}, you have now entered the ${user.room} room`})
                            socket.broadcast.to(user.room).emit('message', {color: 'green', message: `${username} has joined the chat`})
                        } else {
                            console.log("Wrong Password try again.")
                            socket.emit('onPasswordTry', {isPasswordCorrect: false}) //Send message password is wrong.
                        }
                    } else {
                        console.log("password not found, join room")
                        
                        socket.broadcast.to(user.room).emit('message', {color: 'green', message: `${username} has left the chat`})
                        socket.leaveAll()// User leaves all rooms.
                        user.room = room
                        socket.join(user.room) //User joins new room.
                        socket.emit('clean up', true)
                        socket.emit('set currentRoom', user.room)
                        socket.emit('message', {color: 'green', message: `${username}, you have now entered the ${user.room} room`})
                        socket.broadcast.to(user.room).emit('message', {color: 'green', message: `${username} has joined the chat`})
                    }
                } else {
                    console.log("pwd room not found join without password.")
                    
                    socket.broadcast.to(user.room).emit('message', {color: 'green', message: `${username} has left the chat`})
                    socket.leaveAll()// User leaves all rooms.
                    user.room = room
                    socket.emit('set currentRoom', user.room)
                    socket.join(user.room) //User joins new room.
                    socket.broadcast.to(user.room).emit('message', {color: 'green', message: `${username} has joined the chat`})
                }
    
                io.emit('newRoomList', getAllRoomsWithClients())
            }
        }
    })

    socket.on('new room', ({username, room, password}) => {
        if(room){
            const roomFound = roomPasswordList.find(({ roomName }) => roomName === room)
            if(roomFound){
                console.log("room already exists will not add new room or password")
                //extra TODO send error: cant add room that already exists
                socket.emit('onCreateNewRoomTry', {isRoomCreated: false}) //Send message new room is not created.
            } else {
                const user = getCurrentUser(socket.id) //use old users , can use roomList also.
                console.log("room not found, will add new room and maybe password")
                
                //Add new room to roomPasswordList array.
                let newRoom
                if(room !== "main"){
                    newRoom = {roomName: room, password: password}
                } else {
                    newRoom = {roomName: room, password: ""} //To stop people from adding password to default main room.
                }
                roomPasswordList.push(newRoom)

                socket.emit('onCreateNewRoomTry', {isRoomCreated: true}) //Send message new room is created.
                
                //Join the new room that was created.
                socket.broadcast.to(user.room).emit('message', {color: 'green', message: `${username} has left the chat`})
                socket.leaveAll()
                socket.join(room)
                user.room = room    //Need to set to transmit messages to new room.
                socket.emit('clean up', true)
                socket.emit('set currentRoom', user.room)
                socket.emit('message', {color: 'green', message: `${username}, you have now entered the ${user.room} room`})             
                io.emit('newRoomList', getAllRoomsWithClients())

            }
            console.log(roomPasswordList)
        }
    })

    //Send message to users room only.
    socket.on('message', (message) => {
        const user = getCurrentUser(socket.id)

        io.to(user.room).emit('message', {color: user.color, message: `${user.username}: ${message}`})
    })

    socket.on('someone writes', (writing) => {
        const user = getCurrentUser(socket.id)
        socket.broadcast.to(user.room).emit('writing', `${user.username} writes...`)

    })

    //Runs when client disconnects.
    socket.on('disconnect', () => {
        //Check which user that leaves
        const user = removeUserOnLeave(socket.id)

        if(user){
            io.to(user.room).emit('message', {color: 'green', message: `${user.username} has left the chat`})
            //Update all connected clients of the new user/room list.
            io.emit('newRoomList', getAllRoomsWithClients())
        }
        console.log("someone disconnected.")
    })
})

function getAllRoomsWithClients() {
    const availableRooms = []
    // console.log(Object.keys(io.sockets.adapter.rooms)) //Use Object.keys for dictionary key/value pair.
    const rooms = io.sockets.adapter.rooms  //Dictionary of all rooms with users socket.id
    if (rooms) {
        for (const room in rooms) {
            const usersInRoom = []
            for (const id in rooms[room].sockets) {
                if (rooms[room].sockets.hasOwnProperty(id)) {
                    const user = getUsers().find(user => user.id === id) //find user by socket.id. //bug if no users in list.
                    usersInRoom.push({id: id, name: user.username, color: user.color})
                }
            }

            //Check if room has password and set to true or false in newRoom object below.
            const roomFromPasswordList = roomPasswordList.find(({ roomName }) => roomName === room)
            let isPassword = false
            if(roomFromPasswordList){
                roomFromPasswordList.password ? isPassword = true : isPassword = false
            }
            
            const newRoom = {
                roomName: room, //Room name.
                roomPassword: isPassword, //Boolean true or false if room is password protected.
                users: usersInRoom //Array of users
            }
            availableRooms.push(newRoom)
        }
    }

    if(availableRooms.length > 0){
        roomList = availableRooms //not used only backup
        removeEmptyRoomsFromPasswordList(availableRooms)
        return availableRooms
    } else {
        roomList = availableRooms //not used only backup
        return false
    }
}

function removeEmptyRoomsFromPasswordList(availableRooms){

    //filter all rooms to new array if they exist in available rooms to remove empty rooms from password list.
    const newPasswordList = roomPasswordList.filter(pwdRoom => availableRooms.find(({ roomName }) => roomName === pwdRoom.roomName ))
    roomPasswordList = newPasswordList // update password list without empty rooms.
}

http.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
})