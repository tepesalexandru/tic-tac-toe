var audio = new Audio('sound.mp3');


var socket = io.connect(link, {
  "sync disconnect on unload": true
});

let myTurn, symbol;
let mySymbol;

const __symbol = document.querySelector("#symbol");
const __leaveBTN = document.querySelector("#leaveBtn");
const __rematchBTN = document.querySelector("#rematchBtn");
const __user1 = document.querySelector("#p1");
const __user2 = document.querySelector("#p2");
const __sendButton = document.querySelector("#send");
const __message = document.querySelector("#message");
const __output = document.querySelector("#output");
const __chat = document.querySelector("#chat-window");
const __header = document.querySelector("#headerID");

let themeIndex = 0;
let currentTheme;
let numberOfThemes = themes.length;

const root = document.documentElement;

__header.addEventListener("click", () => {
  changeTheme();
});

function changeTheme() {
  themeIndex++;
  themeIndex = themeIndex % numberOfThemes;
  root.style.setProperty("--p-color", themes[themeIndex].p);
  root.style.setProperty("--s-color", themes[themeIndex].s);
  root.style.setProperty("--t-color", themes[themeIndex].t);
  root.style.setProperty("--b-color", themes[themeIndex].b);
}

// Extract Room Name from URI Params
const queryString = window.location.search;
const roomNameURI = new URLSearchParams(queryString).get("room");
let fixedRoomName = roomNameURI.replace(/'/g, "");

__leaveBTN.addEventListener("click", () => {
  socket.emit("leftRoom", {
    player: socket.id,
    room: fixedRoomName
  });
  window.location.href = "./index.html";
});

socket.on("connect", async () => {
  const toRoom = await getRoomInfo(fixedRoomName);
  if ((await toRoom.players.length) === 2) {
    window.location.href = `./index.html`;
    return;
  }

  socket.emit("join_room", {
    roomName: fixedRoomName,
    player: socket.id,
    username: localStorage.getItem("USERNAME")
  });
  socket.on("startGame", () => {
    __symbol.innerHTML = "X";
    myTurn = true;
    updateUsers();
  });

  updateUsers();

  socket.on("mySymbol", s => {
    mySymbol = s;
  });

  socket.on("game.begin", () => {
    getStarted();
  });

  socket.on("move.made", function(data) {
    $("#" + data.position)
      .children()
      .text(data.symbol);
    myTurn = data.symbol !== symbol; // If the symbol of the last move was the same as the current player means that now is opponent's turn

    let endNumber = isGameOver();
    if (endNumber) {
      setTimeout(startGame, 1000);
    }
    if (endNumber == 0) {
      // If game isn't over show who's turn is this
      return renderTurnMessage();
    } else if (endNumber == 2) {
      $("#messages").text("Game over. It's a tie.");
      $(".cell").attr("disabled", true); //board disabled
      getStarted();
    } else {
      if (myTurn) {
        $("#messages").text("Game over. You lost.");
      } else {
        $("#messages").text("Game over. You won!");
      }
      $(".cell").attr("disabled", true); //board disabled
      getStarted();
    }
  });

  socket.on("rematch", () => {
    // Reset game board
    //
    //startGame();
    getStarted();
  });

  window.onbeforeunload = e => {
    socket.emit("leftRoom", {
      player: socket.id,
      room: fixedRoomName,
      username: localStorage.getItem("USERNAME")
    });
    e.returnValue = "";
    return null;
  };

  $(__message).keyup(e => {
    if (e.keyCode === 13) {
      sendMessage();
    }
  });

  __sendButton.addEventListener("click", () => {
    sendMessage();
  });
  socket.on("playSound", () => {
    audio.play();
    document.querySelector(".pop").classList.add("popanimate");
  })
  socket.on("messageOutput", data => {
    __output.innerHTML += `<p><strong>${data.player}: ${data.message}</strong></p>`;
    __chat.scrollTop = __chat.scrollHeight;
    
  });
  function sendMessage() {
    socket.emit("messageSent", {
      player: localStorage.getItem("USERNAME"),
      message: __message.value,
      room: fixedRoomName
    });
    __message.value = "";
  }
});

socket.on("disconnect", () => {
  socket.emit("leftRoom", {
    player: socket.id,
    room: fixedRoomName,
    username: localStorage.getItem("USERNAME")
  });
});

// Disable the board if the opponent leaves
socket.on("opponent.left", function() {
  $("#messages").text("Your opponent left the game.");
  $(".cell").attr("disabled", true);
  $(".cell").text("");
  updateUsers();
});

async function updateUsers() {
  const toRoom = await getRoomInfo(fixedRoomName);
  __user1.innerHTML = localStorage.getItem("USERNAME");
  let idx = toRoom.usernames.findIndex(s => {
    return `${s}` != `${localStorage.getItem("USERNAME")}`;
  });
  if (toRoom.usernames[idx] != undefined) {
    __user2.innerHTML = toRoom.usernames[idx];
  } else {
    __user2.innerHTML = "Waiting...";
  }
}

function getStarted() {
  // The server will asign X or O to the player
  $(".cell").attr("disabled", false); //board disabled
  $("#symbol").html(mySymbol); // Show the players symbol
  symbol = mySymbol;

  // Give X the first turn
  myTurn = mySymbol === "X";
  if (mySymbol === "X") {
    [__user1.innerHTML, __user2.innerHTML] = [
      __user2.innerHTML,
      __user1.innerHTML
    ];
  }
  updateUsers();
  renderTurnMessage();
}
