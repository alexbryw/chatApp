const socket = io()

window.addEventListener('load', () =>{
    init()
})

function init(){
    const userForm = document.querySelector('.join.ui')
    userForm.addEventListener('submit', onJoinRoom)

}

socket.on('message', (incoming) => {
    const list = document.getElementById("chatMessages")

    const listItem = document.createElement('li')
    listItem.innerText = incoming.name + ": " + incoming.message

    list.appendChild(listItem)
} )

function onJoinRoom(event){
    event.preventDefault()
    const joinModal = document.querySelector('.joinChatModal')
    joinModal.classList.add('hidden')
}

//Det här är allt som behövs för att skicka ett meddelande (client-side)
function sendMessage(){
    let input = document.getElementById("messageInput")
    let message = input.value
    input.value = ""

    //skickar meddelande
    socket.emit('message', {name, message})
}