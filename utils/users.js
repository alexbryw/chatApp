const users = []

//Join user to chat, (Room can be set later?)
function userJoin( id, username, room){
    const user = { 
        id, 
        username,
        room 
    }

    users.push(user)

    return user
}

//Get current user
function getCurrentUser(id){
    return users.find(user => user.id === id)
}

//User leaves chat
function removeUserOnLeave(id){
    const index = users.findIndex(user => user.id === id)

    if(index !== -1){
        return users.splice(index, 1)[0]
    } 
}

function getUsers(){
    return users
}

//Get room users
/* function getUsersRoom(room){
    return users.filter(user => user.room === room)
} */

module.exports = {
    userJoin,
    getCurrentUser,
    removeUserOnLeave,
    getUsers,
   // getRoomUsers
}