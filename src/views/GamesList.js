import {useContext, useEffect, useState} from "react";
import {Context as UserContext} from "../context/user.js";
import {Context as CurrentGameContext, setCurrent} from "../context/game.js";
import {setGameAction, Context as GamesContext, setGamesListAction} from "../context/games.js";
import Login from "./Login";
import {createGameApi, getGamesApi, updateGamePlayersApi} from "../api/api";
import GamesListEntry from "../components/GamesListEntry";
import Game from "./Game";
import Leaderboard from "../components/Leaderboard";

const GamesList = ({socket}) => {
    const user = useContext(UserContext)
    const games = useContext(GamesContext)
    const game = useContext(CurrentGameContext)
    const [showLeaderboard, setShowLeaderboard] = useState(false)

    useEffect(() => {
        // get initial list of games and set the state
        getGamesApi().then(data => games.dispatch(setGamesListAction(data.games)))

        // listen to changes to games to update state
        socket.on('games', (data) => games.dispatch(setGameAction(data)));
    }, []);

    // function to handle creating a new game
    const onClickCreate = (e) => {
        createGameApi().then(data => {
            // set the game to the current game
            game.dispatch(setCurrent(data, 1))
        })
    }

    // function to handle clicking join on a room
    const thunkOnClickJoin = (gameEntry) => {
        return (e) => {
            let user_type = 3
            if (gameEntry.player_x === user.state.username)
                user_type = 1 // we are player x
            else if (gameEntry.player_o === null) {
                user_type = 2 // claim player o
                updateGamePlayersApi(gameEntry.id).then((data) => { // tell the server that we are player o
                    game.dispatch(setCurrent(data.game, user_type)) // move to the game view
                })
                return
            } else if (gameEntry.player_o === user.state.username)
                user_type = 2 // we are player o

            /* Maybe there is a cleaner way to do the above but who cares */

            game.dispatch(setCurrent(gameEntry, user_type)) // move to game view
        }
    }

    const onClickLeave = (e) => {
        // unsubscribe to current game room
        socket.emit("unsubscribe", game.state.current.id);

        game.dispatch(setCurrent(null, null))
    }

    return (<> {/* otherwise show the rest */}
        {!showLeaderboard && <button onClick={(e) => (setShowLeaderboard(true))}>Show Leaderboard</button>}
        {showLeaderboard && <button onClick={(e) => (setShowLeaderboard(false))}>Hide Leaderboard</button>}
        {showLeaderboard && <Leaderboard socket={socket}/>}
        {game.state.current === null && <div>
            <h2>Games</h2>
            <button onClick={onClickCreate}>Create new Game</button>
            <table>
                <thead>
                <tr style={{textAlign: "left"}}>
                    <td>Player X</td>
                    <td>Player O</td>
                    <td>Status</td>
                    <td>Winner</td>
                    <td/>
                </tr>
                </thead>
                <tbody>
                {Object.values(games.state.games).map((gameEntry) =>
                    <GamesListEntry key={gameEntry.id}
                                    status={gameEntry.status}
                                    player_x={gameEntry.player_x}
                                    player_o={gameEntry.player_o}
                                    winner={gameEntry.winner}
                                    onClickJoin={thunkOnClickJoin(gameEntry)}/>
                )}
                </tbody>
            </table>
        </div>}
        {game.state.current !== null && <Game socket={socket} onClickLeave={onClickLeave}/>}
    </>)

}

export default GamesList