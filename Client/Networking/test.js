async function test() {
    let create_game_res = await gp_client.createGame();
    console.log(create_game_res);

    let joinRoom = await window.gp_client.joinRoom(create_game_res.room_id);
    
    let game = await gp_client.getRoom(create_game_res.room_id);
    console.log(game);


    let gameStart = await window.gp_client.startGame(create_game_res.room_id, create_game_res.player_token);


    let turn = await window.gp_client.getTurnId(create_game_res.room_id);
    console.log(turn);
    let move = window.gp_client.CreateStrikeMove([1,2]);
    console.log(move);
    //HAVE TO MAKE SURE THAT MOVE YOU ARE PASSING IN IS AN ARRAY!!!
    let sendMove = await window.gp_client.postMove([move], create_game_res.room_id, 0, create_game_res.player_token);
    //console.log(sendMove);



    let lastMove = await window.gp_client.getPreviousMove(create_game_res.room_id);
    console.log(lastMove.moves[0].array[1][0]);
}

test();