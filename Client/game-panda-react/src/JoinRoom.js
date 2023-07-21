import React from 'react';
import gp_client from "./Network/client";

class JoinRoom extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            roomId: null,
            playerToken: null,
            gameStarted: false,
            clientId: 0,
            playerElements: [],
            playerCount: 0, 
        };
        this.idInputRef = React.createRef();
    }

    async createRoom() {
        let create_game_res = await window.gp_client.createGame();
        console.log(create_game_res);
        this.setState({...this.state, roomId: create_game_res.room_id, playerToken: create_game_res.player_token}, () => {
            this.checkRoom();
            setInterval(() => {this.checkRoom()}, 1000);
        })
    }

    async checkRoom() {
        console.log("checking room ", this.state.roomId);

        let game = await gp_client.getRoom(this.state.roomId);
        console.log(game);

        if (game.game_started)
        {
            this.setState({...this.state, gameStarted: true}, () => {
                this.goToRoom();
            });
            
        }

        var players = game.players;
        let playerElements = [];
        for (var i = 0; i < players.length; i++)
        {
            playerElements.push(
                <li key={"player"+i}>
                    <span>{players[i].name}</span>
                </li>
            );
        }
        this.setState({...this.state, playerElements: playerElements, playerCount: players.length});
    }

    async joinRoom () {
        this.setState({...this.state, clientId: 1, roomId: this.idInputRef.current.value}, async () => {
            var create_game_res = await window.gp_client.joinRoom(this.state.roomId);
            this.setState({...this.state, playerToken: create_game_res.player_token}, () => {
                this.checkRoom();
                setInterval(() => {this.checkRoom()}, 1000);
            });
        });

        
    }

    async goToRoom() {
        if (!this.state.gameStarted) {
            //@Mojo startGame() doesn't return anything really
            this.setState({...this.state, gameStarted: true});
        }

        var para = new URLSearchParams();
        para.append("roomId", this.state.roomId);
        setRoomInfo(this.state.roomId, this.state.playerToken, this.state.clientId);

        window.location.href = window.location.origin+"/game?"+para.toString();
    }

    render() {
        let start_button;
        let room_ui;
        if (this.state.playerCount > 1) {
            start_button = <button onClick={async () => {await window.gp_client.startGame(this.state.roomId, this.state.playerToken);this.goToRoom();}}>Start Game</button>;
        }
        if (this.state.roomId !== null) {
            room_ui = <div>
                <div>
                    <h2>{"Room Id: " + this.state.roomId}</h2>
                    <h2>Players</h2>
                    <ul>
                        {this.state.playerElements}
                    </ul>
                </div>
                <br/>
                <br/>
                {start_button}
            </div>
        }
        return <div>
            <button onClick={() => {this.createRoom()}}>Create Room</button>
            <br/>
            <input type="text" ref={this.idInputRef}/>
            <button onClick={() => {this.joinRoom()}}>Join Room</button>

            {room_ui}
        </div>
    }
    
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

export default JoinRoom;