async function test() {
    let create_game_res = await window.gp_client.createGame();
    console.log(create_game_res);
    let game = await gp_client.getRoom(create_game_res.room_id);
    console.log(game);
}

test();