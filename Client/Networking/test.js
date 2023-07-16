async function test() {
    let create_game_res = await gp_client.createGame();
    console.log(create_game_res);
    let game = await gp_client.getRoom(create_game_res.room_id);
    console.log(game);

    console.log(window.gp_client);
    let gameStart = await window.gp_client.startGame(create_game_res.room_id, create_game_res.player_token);
    
}

test();