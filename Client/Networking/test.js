async function test() {
    let create_game_res = await gp_client.createGame();
    console.log(create_game_res);
    let game = await gp_client.getRoom(create_game_res.room_id);
    console.log(game);


    let gameStart = await window.gp_client.startGame(create_game_res.room_id, create_game_res.player_token);
    let turn = await window.gp_client.getTurnId(create_game_res.room_id);
    //let turn = await window.gp_client.postMove(null, create_game_res.room_id, 0, create_game_res.player_token);
    console.log(turn);
}

test();