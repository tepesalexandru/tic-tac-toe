var socket = io.connect("http://localhost:3000", {
  "sync disconnect on unload": true
});

let myTurn, symbol;
let mySymbol;

const __symbol = document.querySelector("#symbol");
const __leaveBTN = document.querySelector("#leaveBtn");
const __rematchBTN = document.querySelector("#rematchBtn");
const __user1 = document.querySelector("#p1");
const __user2 = document.querySelector("#p2");

console.log(__leaveBTN);

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

__rematchBTN.addEventListener("click", () => {
  socket.emit("rematch_request", {
    player: socket.id,
    room: fixedRoomName
  });
});

socket.on("connect", async () => {
  const toRoom = await getRoomInfo(fixedRoomName);
  if ((await toRoom.players.length) === 2) {
    window.location.href = `./index.html`;
    return;
  }

  __user1.innerHTML = localStorage.getItem("USERNAME");
  let idx = toRoom.usernames.findIndex(
    s => s != localStorage.getItem("USERNAME")
  );
  __user2.innerHTML = toRoom.usernames[idx];
  console.log(idx);

  socket.emit("join_room", {
    roomName: fixedRoomName,
    player: socket.id,
    username: localStorage.getItem("USERNAME")
  });
  socket.on("startGame", () => {
    __symbol.innerHTML = "X";
    myTurn = true;
  });

  socket.on("mySymbol", s => {
    mySymbol = s;
  });

  socket.on("game.begin", () => {
    // The server will asign X or O to the player
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
    renderTurnMessage();
  });

  socket.on("move.made", function(data) {
    $("#" + data.position)
      .children()
      .text(data.symbol);
    myTurn = data.symbol !== symbol; // If the symbol of the last move was the same as the current player means that now is opponent's turn

    if (!isGameOver()) {
      // If game isn't over show who's turn is this
      return renderTurnMessage();
    }
    if (myTurn) {
      $("#messages").text("Game over. You lost.");
    } else {
      $("#messages").text("Game over. You won!");
    }
    $(".cell").attr("disabled", true); //board disabled
  });

  socket.on("rematch", () => {
    // Reset game board
    startGame();
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
});
