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
        publicRoomList.appendChild(li)
        
        let hoverListDiv = document.createElement('div')
        hoverListDiv.setAttribute("class", "hoverListText")
        let nameUl = document.createElement('ul')
        for (const user of publicRoomArray[i].users) { //loop out all users in room.
           // console.log(user.name + " " + publicRoomArray[i].roomName)
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
        const enterPasswordDiv = document.createElement('div')
        enterPasswordDiv.classList.add('passwordCheckContainer', 'hidden')
        enterPasswordDiv.addEventListener('click', (event) => {
            event.stopPropagation()
        })
        const passwordInput = document.createElement('input')
        passwordInput.type = 'text'
        passwordInput.placeholder = 'enter password'
        
        const passwordButton = document.createElement('button')
        passwordButton.innerText = 'enter room'
        passwordButton.addEventListener('click', () => checkPassword(passwordInput.value,  enterPasswordDiv))
    
        enterPasswordDiv.appendChild(passwordInput)
        enterPasswordDiv.appendChild(passwordButton)
        li.addEventListener('click', () => {
            enterPasswordDiv.classList.toggle('hidden')        
        })
        
        privateRoomList.append(li)
        li.append(enterPasswordDiv)
    }
}


function selectPublicRoom(room){
    changeRoom(room)
}

//THIS FUNCTION NOT FUNCTIONAL, NEED CORRECT PASSWORD-VALUE TO COMPARE WITH

function checkPassword(passwordInput, room){

    //Need to compare with right value
    if(passwordInput === room.password){
        const passwordDiv = document.querySelector('.passwordCheckContainer')
        passwordDiv.classList.add('hidden')
        changeRoom(room)
    }
    else{
        passwordInput.style.border = ('2px solid red')
        passwordInput.placeholder = 'Wrong Password!'
    }
}
