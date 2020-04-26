function checkForDashes(message){
    requestsAPI = message.includes('/')
    if(requestsAPI){
        let wordCheck
        wordCheck = message.split(" ")
        for (let i = 0; i < wordCheck.length; i++) {
            let ifcludesDash = wordCheck[i].charAt(0)
            if(ifcludesDash == '/'){
                wordCheck[i] = sendForAPI(wordCheck[i].substring(1))
            }
        }

        message = wordCheck.join(' ')
    }
    
    return message
}

function sendForAPI(word){
    word = 'korv'
    return word
}