const socket = io()
let nameOfUser = ""
let listOfSortedRooms = [] //backup save list if needed later
let currentRoom = "" //TODO Set later from sortUserList, compare to nameOfUser


/* const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
}) */

window.addEventListener('load', () =>{
    init()
})

function init(){
    const userForm = document.querySelector('.join.ui')
    userForm.addEventListener('submit', getUserList)
    const messageForm = document.querySelector('.messageInput')
    messageForm.addEventListener('submit', onSendMessage)
    const messageFormInput = document.querySelector('.messageInput input')
    messageFormInput.addEventListener('input', detectWriting)
    const newRoomForm = document.querySelector('.newRoomForm button')
    newRoomForm.addEventListener('click', onGoToNewRoom)

    listAllRooms()
}

socket.on('newRoomList', (inRoomList) => {
    console.log("from newRoomList")
    console.log(inRoomList)
    rooms = inRoomList
    listAllRooms()

})

socket.on('onPasswordTry', ( data ) => {
    if(data.isPasswordCorrect){
        alert("Password is correct, you may enter.") //Alert just for testing.
    } else {
        alert("Password is wrong, try again.")
    }
})

socket.on('onCreateNewRoomTry', ( data ) => {
    if(data.isRoomCreated){
        // alert("Room is created.") //Alert just for testing when new room is created
    } else {
        alert("Room cannot be created. try another room name.") //Room name unavailable try another name.
    }
})

//New user/room list sent here on every change in list.
// socket.on('roomList', (data) => {
//     rooms = [] //Empty rooms array and fill with roomList from server.
//     if(data.userList === false){
//         const newRoom = {roomName: "main", password: ""}
//         rooms.push(newRoom)
//     } else {
//         for (const user of data.userList) {
//             const newRoom = {roomName: user.room, password: ""}
//             rooms.push(newRoom)

//         }
//         listAllRooms() //Update ul list when rooms has been updated.
//     }

//     //TODO sort list to remove duplicate room names.

// })

// function sortUserList(data){
//     const sortedRoomList = []
//     for (const user of data.userList) {
//         setCurrentRoom(user) //see if user has changed room and update currentRoom.
//         const room = sortedRoomList.find(room => room.roomName === user.room)
//         console.log(room)
//         if(room){
//             console.log("room found, will add user to room")
//             const newUsersInRoom = room.usersInRoom
//             newUsersInRoom.push(user.username)
//             room.usersInRoom = newUsersInRoom
//         } else {
//             console.log("room not found will add new room and user")
//             const usersInRoom = [user.username]
//             const room = user.room
//             const newRoom = {roomName: room, usersInRoom: usersInRoom, password: ""}
//             sortedRoomList.push(newRoom)
//         }
//         console.log("from Sorted room list")
//         console.log(sortedRoomList)
//     }
//     listOfSortedRooms = [...sortedRoomList] //backup, save sorted list.
//     return sortedRoomList

// }

//could use socket.id if multiple users have the same name.
function setCurrentRoom(user){
    if(user.username === nameOfUser){
        if(currentRoom !== user.room){
            currentRoom = user.room
            console.log("Updated current room: " + currentRoom)
            const chatListEl = document.querySelector(".chatMessages")
            const li = document.createElement('li')
            li.innerText = "Current Room: " + currentRoom
            chatListEl.append(li)
        }
    }
}


function getUserList(event){
    event.preventDefault()
    socket.emit('get userlist', true)
}

socket.on('post userlist', (data) => {
    onJoinRoom(data)
})

function onJoinRoom(data){
    const usernameInput = document.querySelector('#username')
    const username = usernameInput.value
    const selectedColor = document.querySelector('#selectedColor')
    color = selectedColor.value
    
    let usedName = false
    if(data === false){
        usedName = false
    } else {
        for (const otherUser of data) {
            if(otherUser.username === username){
                usedName = true
                break
            }
        }
    }
    
    if(usedName){
        document.querySelector('.usernameTaken').innerHTML = "Username Taken"
    } else {
        const joinModal = document.querySelector('.joinChatModal')
        joinModal.classList.add('hidden')
        nameOfUser = usernameInput.value

        const room = 'main'
        socket.emit('join room', { username, color, room })
    }
}

function onSendMessage(event) {
    event.preventDefault()    
    const input = document.querySelector('.messageInput input')
    checkForDashes(input.value)
}

function detectWriting() {
    socket.emit('someone writes', true)
}


//Det här är allt som behövs för att skicka ett meddelande (client-side)
/* function sendMessage(){
    let input = document.getElementById("messageInput")
    let message = input.value

    //skickar meddelande
    socket.emit('message', message)
    input.value = ""
} */

function changeRoom(newRoomInfo){
    console.log("from change room")
    console.log(newRoomInfo.roomName)
    let messageContainer = document.querySelector('.chatMessages')
    messageContainer.innerHTML = ''
    // event.preventDefault()
    // const roomInputEl = document.querySelector('.changeRoomForm input')
    // const roomName = roomInputEl.value
    
    //change room. enter username and new room name.
    //(username is maybe not be needed, server is using socket.id).
    socket.emit("change room", { username: nameOfUser , room: newRoomInfo.roomName, password: newRoomInfo.password})
}

socket.on('writing', (writes) => {
    console.log(writes)
    document.querySelector('.someoneIsTyping').innerHTML = writes
})

setInterval(function(){ 
    document.querySelector('.someoneIsTyping').innerHTML = ""
 }, 2000);

function onGoToNewRoom(event){
    event.preventDefault()
    const inputNewRoomEl = document.getElementById('newRoomNameIn')
    const inputNewRoomPassword = document.getElementById('newRoomPasswordIn')
    console.log(inputNewRoomEl.value)
    console.log(inputNewRoomPassword.value)
    console.log("new room name and password")
    if(inputNewRoomEl.value){
        const newRoomInfo = {roomName: inputNewRoomEl.value, password: inputNewRoomPassword.value}
        // changeRoom(newRoomInfo)
        socket.emit("new room", { username: nameOfUser , room: newRoomInfo.roomName, password: newRoomInfo.password})
        let messageContainer = document.querySelector('.chatMessages')
        messageContainer.innerHTML = ''
    } else{
        console.log("Enter new room name")
    }
    inputNewRoomEl.value = ""
    inputNewRoomPassword.value = ""
}
