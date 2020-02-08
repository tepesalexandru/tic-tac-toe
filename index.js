/// Core file for the Server

// Server setup
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));

// Static files
app.use(express.static("secret stuff"));
app.get("/game", function(req, res) {
  res.sendFile(__dirname + "/public/game.html");
});

// This array contains every active user
let allClients = [];
// This array contains every room
let allRooms = [];

// This is from where the allRooms variable can be accessed with a fetch request from the client side
app.get("/rooms", (req, res) => {
  res.send(allRooms);
});

// Export things that need to be used by other scripts
module.exports = { server, allClients, allRooms };

// Run the following scripts
require("./server");
