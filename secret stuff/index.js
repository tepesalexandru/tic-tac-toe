var env = 1;
let link;
if (env == 1) {
  link = "http://localhost:3000";
} else {
  link = "https://ultimatexoxo.herokuapp.com";
}

const socket = io.connect(link);

// DOM Elements, they start with '__' for convention
const __playerCount = document.querySelector("#playerCount");
const __username = document.querySelector("#username");
const __userInput = document.querySelector("#userInput");
const __userBTN = document.querySelector("#sendUsername");
const __newRoomName = document.querySelector("#roomName");
const __activeRooms = document.querySelector("#activeRooms");
const __createBTN = document.querySelector("#createRoom");
const __header = document.querySelector("#headerID");

let themeIndex = 0;
let currentTheme;
let numberOfThemes = themes.length;

const root = document.documentElement;

if (localStorage.getItem("USERNAME") != null) {
  __userInput.value = localStorage.getItem("USERNAME");
}

__userInput.addEventListener("input", () => {
  localStorage.setItem("USERNAME", __userInput.value);
});

// Update the user's handle by clicking on the button
__userBTN.addEventListener("click", () => {
  __username.innerHTML = __userInput.value;
});

__header.addEventListener("click", () => {
  changeTheme();
  errors();
});

__createBTN.addEventListener("click", async () => {
  // Send request to create room
  if (localStorage.getItem("USERNAME") == "") {
    errors();
    return;
  }
  const __passwordCheck = document.querySelector(".check");
  const __passwordFieldC = document.querySelector("#passwordFieldC");
  let isPrivate = __passwordCheck.classList.contains("checked");
  socket.emit("roomCreated", {
    name: __newRoomName.value,
    private: isPrivate,
    password: __passwordFieldC.value
    //player: socket.id
  });
  // Send a request to join the room
  let activeRooms = await getRoomInfo(__newRoomName.value);
  if (activeRooms.players.length >= 2) {
    return;
  }
  joinRoom(__newRoomName.value);
});

// Players online count
socket.on("playerCount", count => {
  __playerCount.innerHTML = `${count}`;
});

/// Display active rooms from Socket.io

socket.on("connect", () => {
  socket.on("newRoom", () => {
    displayAllRooms();
  });
});

displayAllRooms();

function displayAllRooms() {
  let activeRooms;
  __activeRooms.innerHTML = "";
  fetch(`${link}/rooms`)
    .then(response => response.json())
    .then(data => {
      activeRooms = data;
      for (let i = 0; i < activeRooms.length; i++) {
        const newRoom = document.createElement("div");
        if (activeRooms[i].private) {
          newRoom.innerHTML = `<div
          onclick="enterPrivate('${activeRooms[i].roomName}')"
          id="room"
          class="transform hover:scale-95"
        >
          <div
            class="flex flex-col justify-between items-center rounded text-center p-4"
          >
          <p class="opacity-75"><i class="bx bx-lock-alt"></i></p>
          <p id="room-name" class="text-xl">
              Room #${i + 1}:<br>
              ${activeRooms[i].roomName}
            </p>
            <p class="opacity-75">${activeRooms[i].players.length}/2 Players</p>
          </div>
        </div>`;
        } else {
          newRoom.innerHTML = `<div
          onclick="joinRoom('${activeRooms[i].roomName}')"
          id="room"
          class="transform hover:scale-95"
        >
          <div
            class="flex flex-col justify-between items-center rounded text-center p-4"
          >
          <p class="opacity-75"><i class="bx bx-user"></i></p>
          <p id="room-name" class="text-xl">
              Room #${i + 1}:<br>
              ${activeRooms[i].roomName}
            </p>
            <p class="opacity-75">${activeRooms[i].players.length}/2 Players</p>
          </div>
        </div>`;
        }

        __activeRooms.appendChild(newRoom);
      }
    });
}

// Private Room Request
async function enterPrivate(room) {
  eRoom();
  const roomInfo = await getRoomInfo(room);
  const __passwordField = document.querySelector("#passwordField");
  const __joinPrivateBTN = document.querySelector("#joinPrivateBtn");
  __joinPrivateBTN.addEventListener("click", () => {
    if (__passwordField.value === roomInfo.password) {
      joinRoom(roomInfo.roomName);
    }
  });
}

// When the landing page loads, also load all the rooms.

async function getRoomInfo(roomName) {
  let response = await fetch(`${link}/rooms`);
  let rooms = await response.json();
  let arrayIndex = await rooms.findIndex(obj => obj.roomName === roomName);
  //console.log(await rooms[arrayIndex]);
  return await rooms[arrayIndex];
}
/// Change Theme

function changeTheme() {
  themeIndex++;
  themeIndex = themeIndex % numberOfThemes;
  root.style.setProperty("--p-color", themes[themeIndex].p);
  root.style.setProperty("--s-color", themes[themeIndex].s);
  root.style.setProperty("--t-color", themes[themeIndex].t);
  root.style.setProperty("--body-color", themes[themeIndex].b);
}
