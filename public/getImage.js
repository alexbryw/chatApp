
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
        
                let imgURL = response.data[0].images.downsized.url
                let imgTitle = response.data[0].images.downsized.title
                imgHTML = `<img class="importedImage" src="${imgURL}" alt="${imgTitle}">`
                wordCheck[i] = imgHTML
            }
            catch(error) {
                console.warn(`ERROR: ${error}`)
                wordCheck[i] = `<img class="importedImage" src="https://giffiles.alphacoders.com/354/35481.gif" alt="error image">`
            }
            finally {
            }
        }
    }
    sendMessage(wordCheck.join(' '))
}

function sendMessage(message){
    const newMessage = message.replace(/(<((?!img)[^>]+)>)/ig, '');
    socket.emit('message', newMessage)
    const input = document.querySelector('.messageInput input')
    input.value = ""
}