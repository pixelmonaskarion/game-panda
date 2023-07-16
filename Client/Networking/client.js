const {RoomID, AuthedPlayerInRoom, AuthedPlayer} = require('./pool_pb.js');
const {PoolGameClient} = require('./pool_grpc_web_pb.js');
import google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb.js'

var client = new PoolGameClient('http://chrissytopher.com:50051');

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

window.gp_client = {createGame, getRoom, joinRoom, setPlayerInfo};