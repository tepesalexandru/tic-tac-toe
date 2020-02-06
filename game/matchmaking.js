const { socket, allClients } = require("../server.js");

// This function is still work in progress
function findGame(socket) {
  for (players in allClients) {
    if (players.currentlyPlaying === false) {
      allClients.indexOf(newUser.id).currentlyPlaying = true;
      players.currentlyPlaying = true;
      console.log("match found!");
      break;
    }
  }
}
