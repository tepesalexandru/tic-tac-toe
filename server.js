//server setup
var express = require('express');
var app = express();
var server = require('http').Server(app);

//socket setup
const io = require('socket.io')(server);

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

var players = {},
    unmatched;

function joinGame(socket) {


    players[socket.id] = {


        opponent: unmatched,


        symbol: 'X',


        socket: socket
    };


    if (unmatched) {
        players[socket.id].symbol = 'O';
        players[unmatched].opponent = socket.id;
        unmatched = null;
    } else {
        unmatched = socket.id;
    }
}

// Returns the opponent socket
function getOpponent(socket) {
    if (!players[socket.id].opponent) {
        return;
    }
    return players[
        players[socket.id].opponent
    ].socket;
}

io.on('connection', function (socket) {
    console.log("Connection established...", socket.id);
    joinGame(socket);


    if (getOpponent(socket)) {
        socket.emit('game.begin', {
            symbol: players[socket.id].symbol
        });
        getOpponent(socket).emit('game.begin', {
            symbol: players[getOpponent(socket).id].symbol
        });
    }


    socket.on('make.move', function (data) {
        if (!getOpponent(socket)) {
            return;
        }
        console.log("Move made by : ", data);
        socket.emit('move.made', data);
        getOpponent(socket).emit('move.made', data);
    });

    // Emit an event to the opponent when the player leaves
    socket.on('disconnect', function () {
        if (getOpponent(socket)) {
            getOpponent(socket).emit('opponent.left');
        }
    });
});
server.listen(3000);