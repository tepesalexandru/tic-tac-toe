const socket = io.connect("http://localhost:3000");

const __playerCount = document.querySelector("#playerCount");
const __username = document.querySelector("#username");
const __userInput = document.querySelector("#userInput");
const __userBTN = document.querySelector("#sendUsername");

__userBTN.addEventListener("click", () => {
  __username.innerHTML = __userInput.value;
});

socket.on("playerCount", count => {
  __playerCount.innerHTML = `Players online: ${count}`;
});
