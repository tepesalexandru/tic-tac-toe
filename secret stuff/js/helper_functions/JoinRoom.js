/// Join Room & Get Room Info scripts

async function joinRoom(roomName) {
  let fixedRoomName = roomName.replace(/'/g, "");
  let activeRooms = await getRoomInfo(fixedRoomName);
  if (activeRooms.players.length >= 2) {
    console.log("Sorry, room is full.");
    return;
  }

  socket.emit("join_room", {
    roomName: fixedRoomName,
    player: socket.id
  });
}

async function getRoomInfo(roomName) {
  let response = await fetch("http://localhost:3000/rooms");
  let rooms = await response.json();
  let arrayIndex = await rooms.findIndex(obj => obj.roomName === roomName);
  //console.log(await rooms[arrayIndex]);
  return await rooms[arrayIndex];
}
