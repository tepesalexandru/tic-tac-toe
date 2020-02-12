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
  allClients.push(newUser);

  // Update player count
  io.sockets.emit("playerCount", allClients.length);

  socket.on("disconnect", () => {
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
      private: data.private,
      password: data.password,
      local: data.local,
      players: [],
      symbol: "X",
      full: false,
      rematchRequests: 0
    });
    io.sockets.emit("newRoom");
  });

  // Listening for room join requests
  socket.on("join_room", data => {
    io.sockets.emit("newRoom");
    socket.join(data.roomName);
    let arrayIndex = allRooms.findIndex(obj => obj.roomName === data.roomName);
    allRooms[arrayIndex].players.push(data.player);

    // If there are two players, start the game
    console.log(allRooms[arrayIndex].players.length);
    if (allRooms[arrayIndex].players.length === 2) {
      allRooms[arrayIndex].full = true;

      //io.in(data.roomName).emit("startGame", "yes!");
      io.to(`${allRooms[arrayIndex].players[0]}`).emit("mySymbol", "X");
      io.to(`${allRooms[arrayIndex].players[1]}`).emit("mySymbol", "O");
      io.sockets.in(data.roomName).emit("game.begin");
    }
  });

  socket.on("make.move", function(data) {
    io.sockets.in(data.roomName).emit("move.made", data);
  });

  socket.on("leftRoom", data => {
    let arrayIndex = allRooms.findIndex(obj => obj.roomName === data.room);
    allRooms[arrayIndex].players = allRooms[arrayIndex].players.filter(
      e => e !== data.player
    );
    io.to(`${data.room}`).emit("opponent.left");
  });

  socket.on("leftRoom2", () => {
    console.log("somebody refreshed!");
  });

  socket.on("rematch_request", data => {
    // Increment rematch requests
    let arrayIndex = allRooms.findIndex(obj => obj.roomName === data.room);
    allRooms[arrayIndex].rematchRequests++;
    if (allRooms[arrayIndex].rematchRequests === 2) {
      allRooms[arrayIndex].rematchRequests = 0;
      io.to(`${data.room}`).emit("rematch");
    }
  });
});

module.exports = {
  socket,
  allClients
};
