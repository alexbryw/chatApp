const socket = io()
let nameOfUser = ""



/* const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
}) */

window.addEventListener('load', () =>{
    init()
})

function init(){
    const userForm = document.querySelector('.join.ui')
    userForm.addEventListener('submit', onJoinRoom)
    const messageForm = document.querySelector('.messageInput')
    messageForm.addEventListener('submit', onSendMessage)
/*     const changeRoomForm = document.querySelector('.changeRoomForm button')
    changeRoomForm.addEventListener('click', changeRoom) */

    listAllRooms()
}

//socket.emit('joinRoom', {username, room})

socket.on('message', (message) => {
    const list = document.querySelector('.chatMessages')

    const listItem = document.createElement('li')
    listItem.innerText = message

    list.appendChild(listItem)
} )

function onJoinRoom(event){
    event.preventDefault()
    const joinModal = document.querySelector('.joinChatModal')
    joinModal.classList.add('hidden')
    const usernameInput = document.querySelector('#username')
    const username = usernameInput.value
    nameOfUser = usernameInput.value

    const room = 'main'

    socket.emit('join room', { username, room })
    console.log(room)
}

function onSendMessage(event) {
    event.preventDefault()
    console.log('I am clicked!')
    
    const input = document.querySelector('.messageInput input')
    socket.emit('message', input.value)
    input.value = ""
}

//Det här är allt som behövs för att skicka ett meddelande (client-side)
function sendMessage(){
    let input = document.getElementById("messageInput")
    let message = input.value

    //skickar meddelande
    socket.emit('message', message)

    input.value = ""
}

function changeRoom(event){
    event.preventDefault()
    const roomInputEl = document.querySelector('.changeRoomForm input')
    const roomName = roomInputEl.value
    //leave old room.
    socket.emit("leave room", { username: nameOfUser , room: roomName})

    //join new room.
    socket.emit("join room", { username: nameOfUser , room: roomName})
}