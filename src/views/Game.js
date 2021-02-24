import Board from "../components/Board";
import {useContext, useEffect} from "react";
import {claimSquareAction, Context as GameContext, setGameAction} from "../context/game";
import {Context as UserContext} from "../context/user";
import Login from "./Login";
import {getGameApi} from "../api/api";

const Game = ({socket}) => {
    // const {gameState} = useContext(GameContext)
    const user = useContext(UserContext)
    const game = useContext(GameContext)

    useEffect(() => {
        getGameApi().then(data => console.log(data) && game.dispatch(setGameAction(data)))
        socket.on('game', (data) => {
            game.dispatch(setGameAction(data))
        });
        socket.on('claim', (data) => {
            game.dispatch(claimSquareAction(data))
        });
    }, []);

    if (user.state.username == null)
        return <Login/>


    return (<div>
        {user.state.type === 'spectator' && <h4>You are spectating.</h4>}
        {game.state.status === 0 && <div>
            <h2>Waiting for more players to join...</h2>
        </div>}
        {game.state.status === 2 && <h3>Game Ended, {game.state.winner} is the winner!</h3>}
        {game.state.status > 0 && <Board socket={socket}/>}
    </div>)

}

export default Game