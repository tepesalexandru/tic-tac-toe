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
      io.to(`${allRooms[arrayIndex].players[0]}`).emit("mySymbol", "X");
      io.to(`${allRooms[arrayIndex].players[1]}`).emit("mySymbol", "O");
      io.sockets.in(data.roomName).emit("game.begin");

      console.log("Game has started!");
    }
  });

  socket.on("make.move", function(data) {
    console.log("Move made by : ", data);
    io.sockets.in(data.roomName).emit("move.made", data);
  });

  socket.on("leftRoom", data => {
    console.log("Yo, somebody left!", data.room);
    let arrayIndex = allRooms.findIndex(obj => obj.roomName === data.room);
    allRooms[arrayIndex].players = allRooms[arrayIndex].players.filter(
      e => e !== data.player
    );
    io.to(`${data.room}`).emit("opponent.left");
  });
});

module.exports = {
  socket,
  allClients
};
