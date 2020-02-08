import { response } from "express";

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

__createBTN.addEventListener("click", () => {
  // Send request to create room
  socket.emit("roomCreated", {
    name: __newRoomName.value
    //player: socket.id
  });
  // Send a request to join the room
  joinRoom(__newRoomName.value);
});

// Function to join a room
function joinRoom(roomName) {
  /*let activeRooms = getRoomInfo(roomName);
  if (activeRooms.players.length >= 2) {
    console.log("Sorry, room is full.");
  }*/

  socket.emit("join_room", {
    roomName,
    player: socket.id
  });
  window.location.href = `./game.html?room='${roomName}'`;
}

// Players online count
socket.on("playerCount", count => {
  __playerCount.innerHTML = `Players online: ${count}`;
});

/// Display active rooms from Socket.io

// When the landing page loads, also load all the rooms.
let activeRooms;
fetch("http://localhost:3000/rooms")
  .then(response => response.json())
  .then(data => {
    activeRooms = data;
    for (let i = 0; i < activeRooms.length; i++) {
      const newRoom = document.createElement("div");
      newRoom.innerHTML = `<div onclick="joinRoom('${
        activeRooms[i].roomName
      }')">Room #${i}: ${activeRooms[i].roomName} | Players: ${
        activeRooms[i].players.length
      } / ${2}</div>`;
      __activeRooms.appendChild(newRoom);
      __activeRooms.appendChild(document.createElement("hr"));
    }
  });

function getRoomInfo(roomName) {
  fetch("http://localhost:3000/rooms")
    .then(response => response.json())
    .then(rooms => {
      let arrayIndex = rooms.findIndex(obj => obj.roomName === roomName);
      //allRooms[arrayIndex].players.push(data.player);
      return rooms[arrayIndex];
    });
}
