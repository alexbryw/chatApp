const socket = io()
let nameOfUser = ""
let currentRoom = ""


/**************** ON LOAD ********************/
window.addEventListener('load', () =>{
    init()
})

function init(){
    //Handle events
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

// Updates var rooms in roomList.js
function getNewRoomList(inRoomList){
    rooms = inRoomList
    listAllRooms()
}

function PasswordTry(data) {
    const passwordInput = document.querySelector('.passwordInput')
    const passwordButton = document.querySelector('.passwordButton')

    if(!data.isPasswordCorrect){
        passwordInput.style.border = ('2px solid red')
        passwordButton.innerText = 'Wrong Password!'
    }
}

function tryCreateNewRoom( data ){
    const NewRoomTakenError = document.querySelector('#newRoomNameIn')
    const newRoomButton = document.querySelector('#newRoomButton')
    if(!data.isRoomCreated){   
        NewRoomTakenError.style.border = '2px solid red'
        newRoomButton.innerText = 'Room name taken'
    }
    else{
        NewRoomTakenError.style.border = '1px solid yellowgreen'
        NewRoomTakenError.value = ''
        newRoomButton.innerText = 'Create and join'
    }
}

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
        document.querySelector('.usernameTaken').innerHTML = "Username Taken"
    } else {
        const joinModal = document.querySelector('.joinChatModal')
        joinModal.classList.add('hidden')
        nameOfUser = usernameInput.value

        const room = 'main'
        socket.emit('join room', { username, color, room })
    }
}

// Sends messages, handled in handleMessage.js
function onSendMessage(event) {
    event.preventDefault()    
    const input = document.querySelector('.messageInput input')
    checkForDashes(input.value)
}


function changeRoom(newRoomInfo){
    socket.emit("change room", { username: nameOfUser , room: newRoomInfo.roomName, password: newRoomInfo.password})
}

/**************** CLEAN UP ********************/
//Resets the chat when needed, server controlled
function cleanUp(cleanup){
    let messageContainer = document.querySelector('.chatMessages')
    messageContainer.innerHTML = ''
}


/**************** DETECTS WRITING ********************/
function detectWriting() {
    socket.emit('someone writes', true)
}

function someoneIsWriting (writes){
    document.querySelector('.someoneIsTyping').innerHTML = writes
}
setInterval(function(){ // Resets when no one writes
    document.querySelector('.someoneIsTyping').innerHTML = ""
 }, 2000);


function onGoToNewRoom(event){
    event.preventDefault()
    const inputNewRoomEl = document.getElementById('newRoomNameIn')
    const inputNewRoomPassword = document.getElementById('newRoomPasswordIn')
    if(inputNewRoomEl.value){
        const newRoomInfo = {roomName: inputNewRoomEl.value, password: inputNewRoomPassword.value}
        socket.emit("new room", { username: nameOfUser , room: newRoomInfo.roomName, password: newRoomInfo.password})
    }
    inputNewRoomPassword.value = ""
}
