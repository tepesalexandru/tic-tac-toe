// Functions related to the board state or interaction

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
  console.log("hellooooooooooooooo");
  // It's not your turn
  if (!myTurn) {
    return;
  }
  if (
    $(this)
      .children()
      .text().length
  ) {
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

function getBoardState() {
  var obj = {}; // a object having where each attribute contains name of the cell
  $(".cell").each(function() {
    obj[$(this).attr("id")] =
      $(this)
        .children()
        .text() || "";
  });
  return obj;
}

// Binding buttons on the board
$(function() {
  $("#board button").attr("disabled", true);
  $(".cell").on("click", makeMove);
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
