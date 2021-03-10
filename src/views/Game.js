import Board from "../components/Board";
import {useContext, useEffect} from "react";
import {claimSquareAction, Context as GameContext, setCurrent} from "../context/game.js";

const Game = ({socket, onClickLeave}) => {
    // const user = useContext(UserContext)
    const game = useContext(GameContext)


    useEffect(() => {

        // read the current state of the game on load
        // getGameApi().then(data => game.dispatch(setGameAction(data)))

        // subscribe to current game room
        socket.emit("subscribe", game.state.current.id);

        // listen to changes on the game and update state
        socket.on('game', (data) => {
            game.dispatch(setCurrent(data, game.state.user_type))
        });

        // listen to claim events on the squares and update state
        socket.on('claim', (data) => {
            game.dispatch(claimSquareAction(data))
        });

    }, []);

    return (<div>
        <button onClick={onClickLeave}>Leave Game</button>
        {game.state.user_type === 3 && <h4>You are spectating.</h4>}
        {game.state.current.status === 'waiting_for_players' && <div>
            <h2>Waiting for more players to join...</h2>
        </div>}
        {game.state.current.status === 'finished' && <h3>Game Ended, {game.state.current.winner} is the winner!</h3>}
        <Board socket={socket}/>
        {/*{user.state.type === 'player' && game.state.status === 2 && <button onClick={onClickReset}>Play Again</button>}*/}
    </div>)

}

export default Game