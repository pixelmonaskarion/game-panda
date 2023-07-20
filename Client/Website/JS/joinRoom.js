//prevents restoring state after back arrow to prevent 
//immediately redirecting back to game.html if the game has already started
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      location.reload();
    }
  });
async function goToRoom()
{
    if (!gameStarted)
        gameStart = await window.gp_client.startGame(roomId, playerToken);

    var para = new URLSearchParams();
    para.append("roomId", roomId);
    setRoomInfo(roomId, playerToken, clientId);

    location.href = window.location.origin+"/Website/game.html?"+para.toString();
}

function setRoomInfo(roomId, playerToken, clientId)
{
    if (!localStorage.getItem("roomInfo")) {
        localStorage.setItem("roomInfo", JSON.stringify({}));
    }
    var roomInfo = JSON.parse(localStorage.getItem("roomInfo"));
    roomInfo[roomId] = {playerToken: playerToken, clientId: clientId};
    localStorage.setItem("roomInfo", JSON.stringify(roomInfo));
}

var roomId;
var playerToken;
var gameStarted = false;
var clientId = 0;

async function createRoom()
{
    create_game_res = await window.gp_client.createGame();
    console.log(create_game_res);
    roomId = create_game_res.room_id;
    playerToken = create_game_res.player_token;

    checkRoom();
    setInterval(await checkRoom, 1000);
}

async function changeName()
{
    nameInput = document.getElementById("nameChangeInput");

    console.log(clientId);
    await window.gp_client.setPlayerInfo(roomId, playerToken, clientId, nameInput.value);
}

async function joinRoom()
{
    clientId = 1;
    idInput = document.getElementById("roomIdInput");
    roomId = idInput.value;

    create_game_res = await window.gp_client.joinRoom(roomId);
    playerToken = create_game_res.player_token;

    checkRoom();
    setInterval(await checkRoom, 1000);
}

async function checkRoom()
{
    console.log("checking room...");
    let roomHeader = document.getElementById("roomHeader");
    roomHeader.innerText = "Players";

    let roomIdHeader = document.getElementById("roomIdHeader");
    if (roomIdHeader.innerText != "Room Id: " + roomId) {
        roomIdHeader.innerText = "Room Id: " + roomId;
    }

    let playerList = document.getElementById("playerList");
    let game = await gp_client.getRoom(roomId);
    playerList.innerText = "";
    console.log(game);

    if (game.game_started)
    {
        gameStarted = true;
        goToRoom();
    }

    players = game.players;

    for (var i = 0; i < players.length; i++)
    {
        var entry = document.createElement('li');
        entry.appendChild(document.createTextNode(players[i].name));
        playerList.appendChild(entry);
    }
}

