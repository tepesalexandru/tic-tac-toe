var socket = io.connect("http://localhost:3000");

(myTurn = true), symbol;
let mySymbol;

const __symbol = document.querySelector("#symbol");

// Extract Room Name from URI Params
const queryString = window.location.search;
const roomNameURI = new URLSearchParams(queryString).get("room");

function getBoardState() {
  var obj = {}; // a object having where each attribute contains name of the cell
  $(".cell").each(function() {
    obj[$(this).attr("id")] = $(this).text() || "";
  });
  return obj;
}

socket.on("connect", () => {
  console.log("Connected!");
  console.log(socket.id);
  joinRoom(roomNameURI);
  socket.on("startGame", () => {
    console.log("Game has started!");
    __symbol.innerHTML = "X";
    myTurn = true;
  });

  socket.on("mySymbol", s => {
    mySymbol = s;
    console.log("got the symbol!", mySymbol);
  });

  socket.on("game.begin", () => {
    // The server will asign X or O to the player
    $("#symbol").html(mySymbol); // Show the players symbol
    symbol = mySymbol;

    // Give X the first turn
    myTurn = mySymbol === "X";
    console.log("game begins!");
    renderTurnMessage();
  });

  socket.on("move.made", function(data) {
    console.log("made my move!");
    $("#" + data.position).text(data.symbol);
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

  function isGameOver() {
    var state = getBoardState();
    console.log("Board State: ", state);
    // one of the values reruired for winner
    var matches = ["XXX", "OOO"];

    // all possible winning combination of the cells
    var rows = [
      state.a0 + state.a1 + state.a2, //1st line
      state.b0 + state.b1 + state.b2, //2nd  ,,
      state.c0 + state.c1 + state.c2, //3rd  ,,
      state.a0 + state.b1 + state.c2, // diagonal(LTR)
      state.a2 + state.b1 + state.c0, // diagonal (RLT)
      state.a0 + state.b0 + state.c0, //1st column
      state.a1 + state.b1 + state.c1, //2nd   ,,
      state.a2 + state.b2 + state.c2 //3rd   ,,
    ];
    // Loop over all of the rows and check if any of them compare to either = 'XXX' or 'OOO'
    for (var i = 0; i < rows.length; i++) {
      if (rows[i] === matches[0] || rows[i] === matches[1]) {
        return true;
      }
    }
    return false;
  }

  function renderTurnMessage() {
    // Disable the board if it is the opponents turn
    if (!myTurn) {
      $("#messages").text("Your opponent's turn");
      $(".cell").attr("disabled", true);
    } else {
      // Enable the board if it is your turn
      $("#messages").text("Your turn.");
      $(".cell").removeAttr("disabled");
    }
  }

  function makeMove(e) {
    e.preventDefault();
    // It's not your turn
    if (!myTurn) {
      return;
    }
    if ($(this).text().length) {
      // If cell is already checked
      return;
    }

    // Emit the move to the server
    socket.emit("make.move", {
      symbol: symbol,
      position: $(this).attr("id"),
      roomName: roomNameURI.replace(/'/g, "")
    });
  }
  // Binding buttons on the board
  $(function() {
    $(".board button").attr("disabled", true);
    $(".cell").on("click", makeMove);
  });
});

async function joinRoom(roomName) {
  let fixedRoomName = roomName.replace(/'/g, "");
  let activeRooms = await getRoomInfo(fixedRoomName);
  if (activeRooms.players.length >= 2) {
    console.log("Sorry, room is full.");
    return;
  }

  socket.emit("join_room", {
    roomName: fixedRoomName,
    player: socket.id
  });
}

async function getRoomInfo(roomName) {
  let response = await fetch("http://localhost:3000/rooms");
  let rooms = await response.json();
  let arrayIndex = await rooms.findIndex(obj => obj.roomName === roomName);
  //console.log(await rooms[arrayIndex]);
  return await rooms[arrayIndex];
}

// Disable the board if the opponent leaves
socket.on("opponent.left", function() {
  $("#messages").text("Your opponent left the game.");
  $(".cell").attr("disabled", true);
});
