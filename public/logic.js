const socket = io()

let name = ""

window.onload = () => {
    name = prompt("Vad heter du?")
}

socket.on('message', (incoming) => {
    const list = document.getElementById("chatMessages")

    const listItem = document.createElement('li')
    listItem.innerText = incoming.name + ": " + incoming.message

    list.appendChild(listItem)
} )

//Det här är allt som behövs för att skicka ett meddelande (client-side)
function sendMessage(){
    let input = document.getElementById("messageInput")
    let message = input.value
    input.value = ""

    //skickar meddelande
    socket.emit('message', {name, message})
}