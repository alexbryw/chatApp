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
    setCurrentRoom("main")
    listAllRooms()

    //Socket io events
    socket.on('newRoomList', getNewRoomList)
    socket.on('onPasswordTry', PasswordTry)
    socket.on('onCreateNewRoomTry', tryCreateNewRoom)
    socket.on('post userlist', postUserlist)
    socket.on('set currentRoom', settingCurrentRoom)
    socket.on('clean up', cleanUp)
    socket.on('writing', someoneIsWriting)
    socket.on('message', writeMessage)
}

function getNewRoomList(inRoomList){
    console.log("from newRoomList")
    console.log(inRoomList)
    rooms = inRoomList
    listAllRooms()
}

function changeOpacity(className) {
    var elems = document.querySelectorAll(className);
    var index = 0, length = elems.length;
    for ( ; index < length; index++) {
        elems[index].style.transition = "opacity 0.5s linear 0s";
        elems[index].style.opacity = 0.5;
    }
}

function PasswordTry(data) {
    const passwordInput = document.querySelectorAll('input.passwordInput')
    const passwordButton = document.querySelectorAll('button.passwordButton')
    
    if(!data.isPasswordCorrect){
        applyErrorStyleInput(passwordInput)
        applyErrorStyleButton(passwordButton)
    } 
}

function applyErrorStyleInput(passwordInput){
    let index = 0, length = passwordInput.length;
    for ( ; index < length; index++) {
        passwordInput[index].style.border = ('2px solid red')
    }
}

function applyErrorStyleButton(passwordButton){
    let index = 0, length = passwordButton.length;
    for ( ; index < length; index++) {
        passwordButton[index].innerText = 'Wrong Password!'
    }
    console.log('Knappen rullar')
}

function tryCreateNewRoom( data ){
    const NewRoomTakenError = document.querySelector('#newRoomNameIn')
    const newRoomButton = document.querySelector('#newRoomButton')
    if(!data.isRoomCreated){   
        NewRoomTakenError.style.border = '2px solid red'
        newRoomButton.innerText = 'Room name taken'
        //newRoomButton.style.background = 'red'
        //newRoomButton.style.color = 'red'
    }
    else{
        NewRoomTakenError.style.border = '1px solid yellowgreen'
        NewRoomTakenError.value = ''
        newRoomButton.innerText = 'Create and join'
    }
}

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
// OSKAR CLAIMED THIS FUNCTION NAME MOAHAHAHAHHAHAHA
/* function setCurrentRoom(user){
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
}*/


function getUserList(event){
    event.preventDefault()
    socket.emit('get userlist', true)
}

function settingCurrentRoom(newRoom){
    setCurrentRoom(newRoom)
}

function setCurrentRoom(newRoom){
    currentRoom = newRoom
}

function postUserlist(data){
    onJoinRoom(data)
}

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
        document.querySelector('.usernameTaken').innerText = "Username Taken"
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
    // event.preventDefault()
    // const roomInputEl = document.querySelector('.changeRoomForm input')
    // const roomName = roomInputEl.value
    
    //change room. enter username and new room name.
    //(username is maybe not be needed, server is using socket.id).
    socket.emit("change room", { username: nameOfUser , room: newRoomInfo.roomName, password: newRoomInfo.password})
}


function cleanUp(cleanup){
        let messageContainer = document.querySelector('.chatMessages')
        messageContainer.innerHTML = ''
    
}

function someoneIsWriting (writes){
    document.querySelector('.someoneIsTyping').innerText = writes
}
setInterval(function(){ 
    document.querySelector('.someoneIsTyping').innerText = ""
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
    //inputNewRoomEl.value = ""
    inputNewRoomPassword.value = ""
}
