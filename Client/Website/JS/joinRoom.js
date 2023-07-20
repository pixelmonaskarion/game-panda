

async function goToRoom()
{
    if (!gameStarted)
        gameStart = await window.gp_client.startGame(roomId, playerToken);

    var para = new URLSearchParams();
    para.append("roomId", roomId);
    para.append("playerToken", playerToken);
    para.append("clientId", clientId);

    //TODO: CHANGE THIS
    location.href = "file:///Users/ben/Repositories/game-panda/Client/Website/index.html?" + para.toString();
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
    roomHeader.innerHTML = "Players";

    let roomIdHeader = document.getElementById("roomIdHeader");
    roomIdHeader.innerHTML = "Room Id: " + roomId;

    let playerList = document.getElementById("playerList");
    playerList.innerHTML = "";

    let game = await gp_client.getRoom(roomId);
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

