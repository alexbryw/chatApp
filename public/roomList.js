let rooms = [
    // {
    //     roomName: "grejer",
    //     password: "korv"
    // },{
    //     roomName: "saker",
    //     password: ""
    // },{
    //     roomName: "bös",
    //     password: "korv"
    // },{
    //     roomName: "ting",
    //     password: ""
    // },{
    //     roomName: "stuff",
    //     password: "korv"
    // },{
    //     roomName: "mojs",
    //     password: ""
    // }
]

function listAllRooms(){
    let publicRoomArray = []
    let privateRoomArray = []

    // Checks if there is a password then split the code
    for(let i = 0; i < rooms.length; i++){
        if(rooms[i].roomPassword){
            privateRoomArray.push(rooms[i])
        } else {
            publicRoomArray.push(rooms[i])
        }
    }    
    const publicRoomList = document.querySelector('.publicRoomList')
    const privateRoomList = document.querySelector('.privateRoomList')
    publicRoomList.innerHTML = ""
    privateRoomList.innerHTML = ""

    /**************** PUBLIC ROOM ********************/

    for(let i = 0; i < publicRoomArray.length; i++){
        let li = document.createElement("li")
        li.innerText = publicRoomArray[i].roomName
        li.addEventListener('click', () => {selectPublicRoom(publicRoomArray[i])})
        li.setAttribute("class", "hoverList")
        if(currentRoom === publicRoomArray[i].roomName){
            li.setAttribute("id", "usersCurrentRoom")
        }
        publicRoomList.appendChild(li)
        roomLi = document.createElement("li")
        roomLi.innerText = publicRoomArray[i].roomName
        roomLi.setAttribute("class", "hoverRoomName")
        let hoverListDiv = document.createElement('div')
        hoverListDiv.setAttribute("class", "hoverListText")
        let nameUl = document.createElement('ul')
        nameUl.appendChild(roomLi)
        for (const user of publicRoomArray[i].users) { //loop out all users in room.
            let nameLi = document.createElement("li")
            nameLi.innerText = user.name
            nameUl.appendChild(nameLi)
        }
        hoverListDiv.appendChild(nameUl)
        publicRoomList.appendChild(hoverListDiv)
    }

    /*************** PRIVATE ROOM ********************/

    for(let i = 0; i < privateRoomArray.length; i++){
        
        data = JSON.stringify(privateRoomArray[i])
        let li = document.createElement("li")
        li.setAttribute("class", "hoverListPrivate")
        let roomText = document.createElement('p')
        roomText.innerText = privateRoomArray[i].roomName
        const enterPasswordDiv = document.createElement('div')
        enterPasswordDiv.classList.add('passwordCheckContainer', 'hiddenPasswordForm')
        enterPasswordDiv.addEventListener('click', (event) => {
            event.stopPropagation()
        })
        const passwordInput = document.createElement('input')
        passwordInput.setAttribute('class', 'passwordInput')
        passwordInput.type = 'text'
        passwordInput.placeholder = 'enter password'
        
        const passwordButton = document.createElement('button')

        passwordButton.innerText = 'enter room'
        passwordButton.addEventListener('click', () => checkPassword(passwordInput.value, privateRoomArray[i]))
        passwordButton.setAttribute('class', 'passwordButton')
        enterPasswordDiv.appendChild(passwordInput)
        enterPasswordDiv.appendChild(passwordButton)
        li.addEventListener('click', () => {
           if(currentRoom !== privateRoomArray[i].roomName){
                enterPasswordDiv.classList.toggle('hiddenPasswordForm')     
           }
        })
        
        if(currentRoom === privateRoomArray[i].roomName){
            li.setAttribute("id", "usersCurrentRoom")
        }

        privateRoomList.append(li)
        li.append(roomText)
        li.append(enterPasswordDiv)

        roomLi = document.createElement("li")
        roomLi.innerText = privateRoomArray[i].roomName
        roomLi.setAttribute("class", "hoverRoomName")

        let hoverListDiv = document.createElement('div')
        hoverListDiv.setAttribute("class", "hoverListTextPrivate")
        let nameUl = document.createElement('ul')
        nameUl.appendChild(roomLi)
        for (const user of privateRoomArray[i].users) { //loop out all users in room.
            let nameLi = document.createElement("li")
            nameLi.innerText = user.name
            nameUl.appendChild(nameLi)
        }
        hoverListDiv.appendChild(nameUl)
        privateRoomList.appendChild(hoverListDiv)
    }
}

 function toggleDiv(enterPasswordDiv){

    enterPasswordDiv.classList.toggle('hiddenPasswordForm')

} 

function selectPublicRoom(room){
    changeRoom(room)
}

//THIS FUNCTION NOT FUNCTIONAL, NEED CORRECT PASSWORD-VALUE TO COMPARE WITH

function checkPassword(passwordInput, room){
    console.log(room.roomName)
    const newRoomInfo = {roomName: room.roomName, password: passwordInput}
    changeRoom(newRoomInfo)
    // //Need to compare with right value
    // if(passwordInput === room.password){
    //     changeRoom(room)
    // }
    // else{
    //     passwordInput.style.border = ('2px solid red')
    //     passwordInput.placeholder = 'Wrong Password!'
    // }
}
