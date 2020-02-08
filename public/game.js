var socket = io.connect("http://localhost:3000");

(myTurn = true), symbol;

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
    position: $(this).attr("id")
  });
}

socket.on("move.made", function(data) {
  $("#" + data.position).text(data.symbol);
  MyTurn = data.symbol !== symbol; // If the symbol of the last move was the same as the current player means that now is opponent's turn

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

socket.on("game.begin", function(data) {
  // The server will asign X or O to the player
  $("#symbol").html(data.symbol); // Show the players symbol
  symbol = data.symbol;

  // Give X the first turn
  myTurn = data.symbol === "X";
  renderTurnMessage();
});

// Disable the board if the opponent leaves
socket.on("opponent.left", function() {
  $("#messages").text("Your opponent left the game.");
  $(".cell").attr("disabled", true);
});

// Binding buttons on the board
$(function() {
  $(".board button").attr("disabled", true);
  $(".cell").on("click", makeMove);
});
