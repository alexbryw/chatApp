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
    for(let i = 0; i < publicRoomArray.length; i++){
        data = JSON.stringify(publicRoomArray[i])
        let li = document.createElement("li")
        li.innerHTML = publicRoomArray[i].roomName
        li.addEventListener('click', () => {selectPublicRoom(data)})
        li.setAttribute("class", "hoverList")
        if(currentRoom === publicRoomArray[i].roomName){
            li.setAttribute("id", "usersCurrentRoom")
        }
        publicRoomList.appendChild(li)
        roomLi = document.createElement("li")
        roomLi.innerHTML = publicRoomArray[i].roomName
        roomLi.setAttribute("class", "hoverRoomName")
        let hoverListDiv = document.createElement('div')
        hoverListDiv.setAttribute("class", "hoverListText")
        let nameUl = document.createElement('ul')
        nameUl.appendChild(roomLi)
        for (const user of publicRoomArray[i].users) { //loop out all users in room.
            let nameLi = document.createElement("li")
            nameLi.innerHTML = user.name
            nameUl.appendChild(nameLi)
        }
        hoverListDiv.appendChild(nameUl)
        publicRoomList.appendChild(hoverListDiv)
    }

    for(let i = 0; i < privateRoomArray.length; i++){
        data = JSON.stringify(privateRoomArray[i])
        let li = document.createElement("li")
        li.innerHTML = privateRoomArray[i].roomName
        li.addEventListener('click', (event) => {selectPrivateRoom(data, li)})
        li.setAttribute("class", "hoverListPrivate")
        if(currentRoom === publicRoomArray[i].roomName){
            li.setAttribute("id", "usersCurrentRoom")
        }
        privateRoomList.append(li)
        roomLi = document.createElement("li")
        roomLi.innerHTML = privateRoomArray[i].roomName
        roomLi.setAttribute("class", "hoverRoomName")

        let hoverListDiv = document.createElement('div')
        hoverListDiv.setAttribute("class", "hoverListTextPrivate")
        let nameUl = document.createElement('ul')
        nameUl.appendChild(roomLi)
        for (const user of privateRoomArray[i].users) { //loop out all users in room.
            let nameLi = document.createElement("li")
            nameLi.innerHTML = user.name
            nameUl.appendChild(nameLi)
        }
        hoverListDiv.appendChild(nameUl)
        privateRoomList.appendChild(hoverListDiv)
    }
}




function selectPublicRoom(room){
    console.log(room)
    changeRoom(room)
}

function selectPrivateRoom(room, li){
    
    console.log('I am klickad!')
    //var passwordInput = prompt("Please enter your name", "");
    const enterPasswordDiv = document.createElement('div')
    enterPasswordDiv.setAttribute('class', 'passwordCheckContainer')
    enterPasswordDiv.addEventListener('click', (event) => {
        event.stopPropagation()
    })
    const passwordInput = document.createElement('input')
    passwordInput.type = 'text'
    passwordInput.placeholder = 'password'
    
    const passwordButton = document.createElement('button')
    passwordButton.innerText = 'enter room'
    passwordButton.addEventListener('click', () => checkPassword(passwordInput.value, room))

    enterPasswordDiv.appendChild(passwordInput)
    enterPasswordDiv.appendChild(passwordButton)

    li.appendChild(enterPasswordDiv)

/*     if (passwordInput === room.password) {
        console.log(room)
    } else {
        alert("Wrong password")
    } */
}

//THIS FUNCTION NOT FUNCTIONAL, NEED CORRECT PASSWORD-VALUE TO COMPARE WITH

function checkPassword(passwordInput, room){

    //Need to compare with right value
    if(passwordInput === room.password){
        changeRoom(room)
    }
    else{
        passwordInput.style.border = ('2px solid red')
        passwordInput.placeholder = 'Wrong Password!'
    }
}
