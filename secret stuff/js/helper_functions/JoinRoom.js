/// Join Room & Get Room Info scripts

async function joinRoom(roomName) {
  let fixedRoomName = roomName.replace(/'/g, "");
  let activeRooms = await getRoomInfo(fixedRoomName);
  if (activeRooms.players.length >= 2) {
    return;
  }

  if (window.location.href != `./game.html?room='${fixedRoomName}'`) {
    window.location.href = `./game.html?room='${fixedRoomName}'`;
  }
}

async function getRoomInfo(roomName) {
  let response = await fetch(`${link}/rooms`);
  let rooms = await response.json();
  let arrayIndex = await rooms.findIndex(obj => obj.roomName === roomName);
  //console.log(await rooms[arrayIndex]);
  return await rooms[arrayIndex];
}
