const {RoomID, AuthedPlayerInRoom, AuthedPlayer, PlayerToken, Turn, Move, MoveType} = require('./pool_pb.js');
const {PoolGameClient} = require('./pool_grpc_web_pb.js');
import google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb.js'

var client = new PoolGameClient('http://localhost:50051');

async function createGame() {
	let promise = new Promise((resolve, reject) => {
		client.createRoom(new google_protobuf_empty_pb.Empty(), {}, (err, res) => {
			if (err) {
				reject(err);
			} else {
				let parsed = {
					room_id: res.getRoomId().getRoomCode(),
					player_token: res.getPlayerToken().getPlayerToken(),
					response: res,
				};
				resolve(parsed);
			}
		});
	});
	return promise;
}

async function joinRoom(room_id) {
	let req = new RoomID();
	req.setRoomCode(room_id);
	let promise = new Promise((resolve, reject) => {
		client.joinRoom(req, {}, (err, res) => {
			if (err) {
				reject(err);
			} else {
				let parsed = {
					player_token: res.getPlayerToken().getPlayerToken(),
					response: res,
				};
				resolve(parsed);
			}
		});
	});
	return promise;
}

async function getRoom(room_id) {
	let req = new RoomID();
	req.setRoomCode(room_id);
	let promise = new Promise((resolve, reject) => {
		client.getRoom(req, {}, (err, res) => {
			if (err) {
				reject(err);
			} else {
				let parsed_players = [];
				let players_list = res.getPlayersList();
				for (var i = 0; i < players_list.length; i++) {
					let player = players_list[i];
					parsed_players.push({
						player_id: player.getPlayerId(),
						name: player.getName(),
					});
				}
				let parsed = {
					room_id: res.getRoomId().getRoomCode(),
					room_name: res.getRoomName(),
					players: parsed_players,
					game_started: res.getGameStarted(),
					response: res,
				};
				resolve(parsed);
			}
		});
	});
	return promise;
}

async function setPlayerInfo(room_id, token, player_id, name) {
	let res = new AuthedPlayerInRoom();
	let room_id_proto = new RoomID();
	room_id_proto.setRoomCode(room_id);
	res.setRoomId(room_id_proto);
	let authed_player_proto = new AuthedPlayer();
	authed_player_proto.setPlayerId(player_id);
	authed_player_proto.setName(name);
	authed_player_proto.setPlayerToken(token);
	res.setAuthedPlayer(authed_player_proto);

	let promise = new Promise((resolve, reject) => {
		client.setPlayerInfo(req, {}, (err, res) => {
			if (err) {
				reject(err);
			} else {
				let parsed = {
					response: res,
				};
				resolve(parsed);
			}
		});
	});
	return promise;
}

async function startGame(room_id, playerToken) {
	let req = new AuthedPlayerInRoom();
	let room_id_proto = new RoomID();
	room_id_proto.setRoomCode(room_id);
	req.setRoomId(room_id_proto);
	let authed_player = new AuthedPlayer();
	let player_token = new PlayerToken();
	player_token.setPlayerToken(playerToken);
	authed_player.setPlayerToken(player_token);
	req.setAuthedPlayer(authed_player);
	let promise = new Promise((resolve, reject) => {
		client.startGame(req, {}, (err, res) => {
			if (err) {
				reject(err);
			} else {
				let parsed = {
					response: res,
				};
				resolve(parsed);
			}
		});
	});
	return promise;
}

async function getTurnId(room_id) {
	let req = new RoomID();
	req.setRoomCode(room_id);
	let promise = new Promise((resolve, reject) => {
		client.getTurnId(req, {}, (err, res) => {
			if (err) {
				reject(err);
			} else {
				let parsed = {
					turn_id: res.getTurnId(),
					response: res,
				};
				resolve(parsed);
			}
		});
	});
	return promise;
}

async function postMove(moves, room_id_in, player_id_in, player_token_in) {
	let req = new Turn();
	let roomId = new RoomID();
	roomId.setRoomCode(room_id_in);
	req.setRoomId(roomId);
	req.setPlayerId(player_id_in);
	let playerToken = new PlayerToken();
	playerToken.setPlayerToken(player_id_in);
	req.setPlayerToken(playerToken);
	req.setMovesList(moves);
	let promise = new Promise((resolve, reject) => {
		client.postTurn(req, {}, (err, res) => {
			if (err) {
				reject(err);
			} else {
				let parsed = {
					response: res,
				};
				resolve(parsed);
			}
		});
	});
	return promise;
}

async function getPreviousMove(room_id) {
	let req = new RoomID();
	req.setRoomCode(room_id);
	let promise = new Promise((resolve, reject) => {
		client.getPreviousTurn(req, {}, (err, res) => {
			if (err) {
				reject(err);
			} else {
				let parsed = {
					moves: res.getMovesList(),
					room_id: res.getRoomId().getRoomCode(),
					player_id: res.getPlayerId(),
					response: res,
				};
				resolve(parsed);
			}
		});
	});
	return promise;
}

function StrikeMove(vel) {
	let move = new Move();
	let strike_move = new StrikeMove();
	strike_move.setVel(vel);
	move.setStrikeMove(strike_move);
	move.setMoveType(MoveType.STRIKE);
	return move;
}

function PlaceMove(pos) {
	let move = new Move()
	let place_move = new PlaceMove();
	place_move.setPos(pos);
	move.setPlaceMove(place_move);
	move.setMoveType(MoveType.PLACE);
	return move;
}

window.gp_client = {createGame, joinRoom, getRoom, setPlayerInfo, startGame, getTurnId, postMove, getPreviousMove, StrikeMove, PlaceMove};