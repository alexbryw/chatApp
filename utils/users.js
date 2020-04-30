const users = [] //List of all users.

//Join user to chat, (Room can be set later?)
function userJoin( id, username, color, room){
    const user = { 
        id, 
        username,
        color,
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

//Get all users if there are any.
function getUsers(){
    if(users.length > 0){
        return users
    } else {
        return false
    }
}

module.exports = {
    userJoin,
    getCurrentUser,
    removeUserOnLeave,
    getUsers,
}