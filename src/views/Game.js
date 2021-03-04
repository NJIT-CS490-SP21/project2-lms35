import Board from "../components/Board";
import {useContext, useEffect, useState} from "react";
import {claimSquareAction, Context as GameContext, setGameAction} from "../context/game";
import {Context as UserContext} from "../context/user";
import Login from "./Login";
import {getGameApi} from "../api/api";
import Leaderboard from "../components/Leaderboard";

const Game = ({socket}) => {
    // const {gameState} = useContext(GameContext)
    const user = useContext(UserContext)
    const game = useContext(GameContext)

    const [showLeaderboard, setShowLeaderboard] = useState(false)

    useEffect(() => {
        getGameApi().then(data => game.dispatch(setGameAction(data)))
        socket.on('game', (data) => {
            game.dispatch(setGameAction(data))
        });
        socket.on('claim', (data) => {
            game.dispatch(claimSquareAction(data))
        });
    }, []);

    if (user.state.username == null)
        return <Login/>

    const onClickReset = (e) => {
        socket.emit('reset')
    }

    return (<div>
        {!showLeaderboard && <button onClick={(e) => (setShowLeaderboard(true))}>Show Leaderboard</button>}
        {showLeaderboard && <button onClick={(e) => (setShowLeaderboard(false))}>Hide Leaderboard</button>}
        {showLeaderboard && <Leaderboard socket={socket}/>}
        {user.state.type === 'spectator' && <h4>You are spectating.</h4>}
        {game.state.status === 1 && <div>
            <h2>Waiting for more players to join...</h2>
        </div>}
        {game.state.status === 3 && <h3>Game Ended, {game.state.winner} is the winner!</h3>}
        {game.state.status > 1 && <Board socket={socket}/>}
        {user.state.type === 'player' && game.state.status === 2 && <button onClick={onClickReset}>Play Again</button>}
    </div>)

}

export default Game