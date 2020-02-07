const { socket, allClients } = require("../server.js");

// This function is still work in progress
function findGame(socket) {
  for (players in allClients) {
    if (players.currentlyPlaying === false) {
      allClients.indexOf(newUser.id).currentlyPlaying = true;
      allClients.indexOf(newUser.id).opponentId = players.id;
      players.currentlyPlaying = true;
      players.opponentId = newUser.id;
      console.log("match found!");
      break;
    }
  }
}
