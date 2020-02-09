var socket = io.connect("http://localhost:3000");

let myTurn = true,
  symbol;
let mySymbol;

const __symbol = document.querySelector("#symbol");
const __leaveBTN = document.querySelector("#leaveBtn");

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

socket.on("connect", () => {
  joinRoom(roomNameURI);
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
});

// Disable the board if the opponent leaves
socket.on("opponent.left", function() {
  $("#messages").text("Your opponent left the game.");
  $(".cell").attr("disabled", true);
  $(".cell").text("");
});
