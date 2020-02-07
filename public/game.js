/*var socket = io('http://localhost:3000');

myTurn = true, symbol;


var matches = ['XXX', 'OOO'];


function getBoardState() {
    var obj = {};


    $('.cell').each(function () {
        obj[$(this).attr('id')] = $(this).text() || '';
    });

    console.log("state: ", obj);
    return obj;
}

function isGameOver() {
    var state = getBoardState();
    console.log("Board State: ", state);


    var rows = [
        state.a0 + state.a1 + state.a2,
        state.b0 + state.b1 + state.b2,
        state.c0 + state.c1 + state.c2,
        state.a0 + state.b1 + state.c2,
        state.a2 + state.b1 + state.c0,
        state.a0 + state.b0 + state.c0,
        state.a1 + state.b1 + state.c1,
        state.a2 + state.b2 + state.c2
    ];


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
        $('#messages').text('Your opponent\'s turn');

        $('.cell').attr('disabled', true);

        // Enable the board if it is your turn
    } else {
        $('#messages').text('Your turn.');

        $('.cell').removeAttr('disabled');

    }
}

function makeMove(e) {
    e.preventDefault();
    // It's not your turn
    if (!myTurn) {
        return;
    }

    // The space is already checked
    if ($(this).text().length) {
        return;
    }

    // Emit the move to the server
    socket.emit('make.move', {
        symbol: symbol,
        position: $(this).attr('id')
    });

}


socket.on('move.made', function (data) {

    $('#' + data.position).text(data.symbol);


    myTurn = (data.symbol !== symbol);


    if (!isGameOver()) {
        return renderTurnMessage();
    }


    if (myTurn) {
        $('#messages').text('Game over. You lost.');

    } else {
        $('#messages').text('Game over. You won!');
    }


    $('.cell').attr('disabled', true);
});


socket.on('game.begin', function (data) {
    // The server will asign X or O to the player
    $("#symbol").html(data.symbol); // Show the players symbol
    symbol = data.symbol;

    // Give X the first turn
    myTurn = (data.symbol === 'X');
    renderTurnMessage();
});

// Disable the board if the opponent leaves
socket.on('opponent.left', function () {
    $('#messages').text('Your opponent left the game.');
    $('.cell').attr('disabled', true);
});

$(function () {
    $('.board button').attr('disabled', true);
    $(".cell").on("click", makeMove);
});*/
