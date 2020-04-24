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
    const newRoomForm = document.querySelector('.newRoomForm button')
    newRoomForm.addEventListener('click', newRoom)

    listAllRooms()
}

//New user/room list sent here on every change in list.
socket.on('roomList', (data) => {
    rooms = [] //Empty rooms array and fill with roomList from server.
    if(data.userList === false){
        console.log("Empty userList")
        const newRoom = {roomName: "main", password: ""}
        rooms.push(newRoom)
    } else {
        console.log("from userList")
        console.log(data)
        for (const user of data.userList) {
            console.log("User: "+ user.username + "  Room: " + user.room)
            const newRoom = {roomName: user.room, password: ""}
            rooms.push(newRoom)

        }
        listAllRooms() //Update ul list when rooms has been updated.
    }

    //TODO sort list to remove duplicate room names.

})

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

function changeRoom(newRoomInfo){
    // event.preventDefault()
    // const roomInputEl = document.querySelector('.changeRoomForm input')
    // const roomName = roomInputEl.value
    
    //change room. enter username and new room name.
    //(username is maybe not be needed, server is using socket.id).
    socket.emit("change room", { username: nameOfUser , room: newRoomInfo.roomName})
}

function newRoom(event){
    event.preventDefault()
    const inputNewRoomEl = document.getElementById('newRoomNameIn')
    console.log(inputNewRoomEl.value)
    if(inputNewRoomEl.value){
        const newRoomInfo = {roomName: inputNewRoomEl.value, password: ""}
        changeRoom(newRoomInfo)
    } else{
        console.log("Enter new room name")
    }
}