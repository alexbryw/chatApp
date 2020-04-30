
function checkForDashes(message){
    requestsAPI = message.includes('/')
    if(requestsAPI){
        let wordCheckArray = message.split(" ")
        sendForAPI(wordCheckArray)
    } else {
        sendMessage(message)
    } 
}

async function sendForAPI(wordCheck){
    for (let i = 0; i < wordCheck.length; i++) {
        let includesDash = wordCheck[i].charAt(0)
        if(includesDash == '/'){
            try{    
                let response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=LG8XDGkXtIyyZNJyMUjroUYM1G9wDnMP&q=`+
                            `${wordCheck[i].substring(1)}&limit=1&offset=0&rating=G&lang=en`)
                    .then(res => res.json())
                //The added code tells the reciver that it's a image
                //It's also EttSkeppKommerLastat in L33T-speak
                wordCheck[i] = "3775k3PPk0Mm3rl45747" + response.data[0].images.downsized.url
            }
            catch(error) {
                console.warn(`ERROR: ${error}`)
                wordCheck[i] = "3775k3PPk0Mm3rl45747" + "https://giffiles.alphacoders.com/354/35481.gif"
            }
            finally {
            }
        }
    }
    sendMessage(wordCheck.join(' '))
}

function sendMessage(message){
    const newMessage = message.replace(/<[^>]*>/g, '');
    socket.emit('message', newMessage)
    const input = document.querySelector('.messageInput input')
    input.value = ""
}


function writeMessage(message) {
    let newMessage = message.message
    const requestsAPI = newMessage.includes('3775k3PPk0Mm3rl45747')
    if(requestsAPI){
        newMessage = addImagesToMessage(newMessage)
    }
    const list = document.querySelector('.chatMessages')
    const listItem = document.createElement('li')
    listItem.setAttribute('class', `${message.color}Text`)
    listItem.innerText = newMessage

    list.appendChild(listItem)
}



function addImagesToMessage(message){
    let messageArray = message.split(" ")
    for (let i = 0; i < messageArray.length; i++) {
        if(messageArray[i].includes('3775k3PPk0Mm3rl45747')){
            const imgURL = messageArray[i].substring(20)
            messageArray[i] = `<img class="importedImage" src="${imgURL}" alt="Image from Giphy">`
        }
    }
    
    return messageArray.join(' ')
}
