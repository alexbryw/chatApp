let rooms = [
    {
        roomName: "grejer",
        password: "korv"
    },{
        roomName: "saker",
        password: ""
    },{
        roomName: "bös",
        password: "korv"
    },{
        roomName: "ting",
        password: ""
    },{
        roomName: "stuff",
        password: "korv"
    },{
        roomName: "mojs",
        password: ""
    }
]

function listAllRooms(){
    let publicRoomArray = []
    let privateRoomArray = []

    // Checks if there is a password then split the code
    for(let i = 0; i < rooms.length; i++){
        if(rooms[i].password === ""){
            publicRoomArray.push(rooms[i])
        } else {
            privateRoomArray.push(rooms[i])
        }
    }
    const publicRoomList = document.querySelector('.publicRoomList')
    const privateRoomList = document.querySelector('.privateRoomList')

    for(let i = 0; i < publicRoomArray.length; i++){
        data = JSON.stringify(publicRoomArray[i])
        let li = document.createElement("li")
        li.innerHTML = publicRoomArray[i].roomName
        li.setAttribute("onClick", `selectPublicRoom(${ data })`)
        publicRoomList.appendChild(li)
    }

    for(let i = 0; i < privateRoomArray.length; i++){
        data = JSON.stringify(privateRoomArray[i])
        let li = document.createElement("li")
        li.innerHTML = privateRoomArray[i].roomName
        li.setAttribute("onClick", `selectPrivateRoom(${ data })`)
        privateRoomList.appendChild(li)
    }
}




function selectPublicRoom(korv){
    console.log(korv)
}

function selectPrivateRoom(korv){
    //titta på lösenord-kod här
    console.log(korv)
}

