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

    // console.log(rooms)

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
        // data = JSON.stringify(publicRoomArray[i])
        let li = document.createElement("li")
        li.innerHTML = publicRoomArray[i].roomName
        li.addEventListener('click', () => {selectPublicRoom(publicRoomArray[i])})
        li.setAttribute("class", "hoverList")
        publicRoomList.appendChild(li)
        
        let hoverListDiv = document.createElement('div')
        hoverListDiv.setAttribute("class", "hoverListText")
        let nameUl = document.createElement('ul')
        for (const user of publicRoomArray[i].users) { //loop out all users in room.
            console.log(user.name + " " + publicRoomArray[i].roomName)
            let nameLi = document.createElement("li")
            nameLi.innerHTML = user.name
            nameUl.appendChild(nameLi)
        }
        hoverListDiv.appendChild(nameUl)
        publicRoomList.appendChild(hoverListDiv)
    }

    for(let i = 0; i < privateRoomArray.length; i++){
        //data = JSON.stringify(privateRoomArray[i])
        let li = document.createElement("li")
        li.innerHTML = privateRoomArray[i].roomName
        li.addEventListener('click', (event) => {selectPrivateRoom(privateRoomArray[i], li)})
        privateRoomList.append(li)
    }
}




function selectPublicRoom(room){
    console.log("from public list")
    console.log(room)
    changeRoom(room)
}

function selectPrivateRoom(room, li){
    
    console.log('from private list')
    console.log(room)
    //var passwordInput = prompt("Please enter your name", "");
    const enterPasswordDiv = document.createElement('div')
    enterPasswordDiv.setAttribute('class', 'passwordCheckContainer')
    enterPasswordDiv.addEventListener('click', (event) => {
        event.stopPropagation()
    })
    const passwordInput = document.createElement('input')
    passwordInput.type = 'text'
    passwordInput.placeholder = 'enter password'
    
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
