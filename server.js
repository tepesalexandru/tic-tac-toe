/// Core file for Web Sockets (Socket.io)

const { server, allClients, allRooms } = require("./index.js");

const socket = require("socket.io");
const io = socket(server);

// Handle new player connections / disconnections
io.on("connection", socket => {
  // Default User settings
  let newUser = {
    id: socket.id,
    currentlyPlaying: false,
    opponentId: ""
  };

  // Push the new connection in the array
  //allClients.push(socket);
  allClients.push(newUser);

  /*for (let i = 0; i < allClients.length; i++) {
    console.log(`${i}: ${allClients[i].id}`);
  }*/

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

  // Listening to new room creations.
  socket.on("roomCreated", data => {
    allRooms.push({
      roomName: data.name,
      players: [],
      symbol: "X"
    });
    console.log(`Room created! Name: ${data.name}`);
    socket.broadcast.emit("roomCreated");
  });

  // Listening for room join requests
  socket.on("join_room", data => {
    socket.join(data.roomName);
    console.log(allRooms);
    let arrayIndex = allRooms.findIndex(obj => obj.roomName === data.roomName);
    allRooms[arrayIndex].players.push(data.player);

    // If there are two players, start the game
    console.log(allRooms[arrayIndex].players.length);
    if (allRooms[arrayIndex].players.length === 2) {
      //io.in(data.roomName).emit("startGame", "yes!");
      io.sockets.in(data.roomName).emit("startGame");
      console.log("Game has started!");
    }
  });
});

module.exports = {
  socket,
  allClients
};

/*var players = {},
  unmatched;

function joinGame(socket) {
  //add the player object(players)
  players[socket.id] = {
    // The opponent will either be the socket that is currently unmatched,
    // or it will be null if no  players are unmatched
    opponent: unmatched,
    // The symbol will become 'O' if the player is unmatched
    symbol: "X",
    // The socket that is associated with this player
    socket: socket
  };
}

// Every other player is marked as 'unmatched', which means
// there is no another player to pair them with yet. As soon
// as the next socket joins, the unmatched player is paired with
// the new socket and the unmatched variable is set back to null
if (unmatched) {
  players[socket.id].symbol = "O";
  players[unmatched].opponent = socket.id;
  unmatched = null;
} else {
  unmatched = socket.id;
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

  // Once the socket has an opponent, we can begin the game
  if (getOpponent(socket)) {
    socket.emit("game.begin", {
      symbol: players[socket.id].symbol
    });
    getOpponent(socket).emit("game.begin", {
      symbol: players[getOpponent(socket).id].symbol
    });
  }

  // Listens for a move to be made and emits an event to both players after the move is completed
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
*/
