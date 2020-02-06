/// Core file for Web Sockets (Socket.io)

const { server, allClients } = require("./index.js");

const socket = require("socket.io");
const io = socket(server);

// Handle new player connections / disconnections
io.on("connection", socket => {
  console.log("Made a new connection!");

  // Default User settings
  let newUser = {
    id: socket.id,
    currentlyPlaying: false,
    opponentId: ""
  };

  // Push the new connection in the array
  //allClients.push(socket);
  allClients.push(newUser);

  // Update player count
  io.sockets.emit("playerCount", allClients.length);

  socket.on("disconnect", () => {
    console.log("Player disconnected!");

    // Remo the new connection from the array
    const i = allClients.indexOf(newUser.id);
    allClients.splice(i, 1);

    // Update player count
    io.sockets.emit("playerCount", allClients.length);
  });
});

module.exports = { socket, allClients };

/*var players = {},
  unmatched;

function joinGame(socket) {
  players[socket.id] = {
    opponent: unmatched,

    symbol: "X",

    socket: socket
  };

  if (unmatched) {
    players[socket.id].symbol = "O";
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
  return players[players[socket.id].opponent].socket;
}

io.on("connection", function(socket) {
  console.log("Connection established...", socket.id);
  joinGame(socket);

  if (getOpponent(socket)) {
    socket.emit("game.begin", {
      symbol: players[socket.id].symbol
    });
    getOpponent(socket).emit("game.begin", {
      symbol: players[getOpponent(socket).id].symbol
    });
  }

  socket.on("make.move", function(data) {
    if (!getOpponent(socket)) {
      return;
    }
    console.log("Move made by : ", data);
    socket.emit("move.made", data);
    getOpponent(socket).emit("move.made", data);
  });

  // Emit an event to the opponent when the player leaves
  socket.on("disconnect", function() {
    if (getOpponent(socket)) {
      getOpponent(socket).emit("opponent.left");
    }
  });
});

export { io }*/
