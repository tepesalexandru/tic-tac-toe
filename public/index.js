const socket = io.connect("http://localhost:3000");

// DOM Elements, they start with '__' for convention
const __playerCount = document.querySelector("#playerCount");
const __username = document.querySelector("#username");
const __userInput = document.querySelector("#userInput");
const __userBTN = document.querySelector("#sendUsername");
const __newRoomName = document.querySelector("#roomName");
const __activeRooms = document.querySelector("#activeRooms");
const __createBTN = document.querySelector("#createRoomBtn");

// Update the user's handle by clicking on the button
__userBTN.addEventListener("click", () => {
  __username.innerHTML = __userInput.value;
});

// Update the href link value based on the input field value
__newRoomName.addEventListener("keyup", () => {
  //__createHREF.href = `./game.html?room='${__newRoomName.value}'`;
});

__createBTN.addEventListener("click", () => {
  // Send request to create room
  socket.emit("roomCreated", {
    name: __newRoomName.value
  });
  // Send a request to join the room
  joinRoom(__newRoomName.value);
});

// Function to join a room
function joinRoom(roomName) {
  socket.emit("join_room", roomName);
  window.location.href = `./game.html?room='${roomName}'`;
}

// Players online count
socket.on("playerCount", count => {
  __playerCount.innerHTML = `Players online: ${count}`;
});

/// Display active rooms from Socket.io

// NOT WORKING: This should show the new rooms without having to refresh the page.
socket.on("createRoom", () => {
  let activeRooms;
  fetch("http://localhost:3000/rooms")
    .then(response => response.json())
    .then(data => {
      activeRooms = data;
      //console.log(activeRooms);
      for (let i = 0; i < activeRooms.length; i++) {
        const newRoom = document.createElement("div");
        newRoom.innerHTML = `Room #${i}: ${
          activeRooms[i]
        } | Players: ${0} / ${2}`;
        //newRoom.addEventListener("click", joinRoom(activeRooms[i]));
        __activeRooms.appendChild(newRoom);
        __activeRooms.appendChild(document.createElement("hr"));
      }
    });
});

// When the landing page loads, also load all the rooms.
let activeRooms;
fetch("http://localhost:3000/rooms")
  .then(response => response.json())
  .then(data => {
    activeRooms = data;
    for (let i = 0; i < activeRooms.length; i++) {
      const newRoom = document.createElement("div");
      newRoom.innerHTML = `Room #${i}: ${
        activeRooms[i]
      } | Players: ${0} / ${2}`;
      //newRoom.addEventListener("click", joinRoom(activeRooms[i]));
      //newRoom.onclick = joinRoom(activeRooms[i]);
      __activeRooms.appendChild(newRoom);
      __activeRooms.appendChild(document.createElement("hr"));
    }
  });
