const socket = io.connect("http://localhost:5000");

const playerCountDOM = document.querySelector("#playerCount");

socket.on("playerCount", count => {
  console.log("hello!");
  playerCountDOM.innerHTML = `Players online: ${count}`;
});
