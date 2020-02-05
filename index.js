const express = require("express");
const socket = require("socket.io");

// Server setup
const app = express();

const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));

// Static files
app.use(express.static("public"));

// Socket setup
const io = socket(server);

let allClients = [];

io.on("connection", socket => {
  console.log("Made a new connection!");

  allClients.push(socket);

  // Update player count
  io.sockets.emit("playerCount", allClients.length);

  socket.on("disconnect", () => {
    console.log("Player disconnected!");

    const i = allClients.indexOf(socket);
    allClients.splice(i, 1);

    // Update player count
    io.sockets.emit("playerCount", allClients.length);
  });
});
