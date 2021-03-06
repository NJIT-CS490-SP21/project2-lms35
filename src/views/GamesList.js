import {useContext, useEffect} from "react";
import {Context as UserContext} from "../context/user.js";
import {Context as CurrentGameContext, setGameAction} from "../context/game.js";
import {addGameAction, Context as GamesContext, setGamesListAction} from "../context/games.js";
import Login from "./Login";
import {createGameApi, getGamesApi, updateGamePlayersApi} from "../api/api";
import GamesListEntry from "../components/GamesListEntry";
import Game from "./Game";

const GamesList = ({socket}) => {
    const user = useContext(UserContext)
    const games = useContext(GamesContext)
    const game = useContext(CurrentGameContext)

    useEffect(() => {
        // get initial list of games and set the state
        getGamesApi().then(data => games.dispatch(setGamesListAction(data.games)))

        // listen to changes to games to update state
        socket.on('games', (data) => games.dispatch(addGameAction(data)));
    }, []);

    // function to handle creating a new game
    const onClickCreate = (e) => {
        createGameApi().then(data => {
            console.log(data)
            // set the game to the current game
            game.dispatch(setGameAction(data))
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
                updateGamePlayersApi(gameEntry.id).then(() => { // tell the server that we are player o
                    game.dispatch(setGameAction(gameEntry, user_type)) // move to the game view
                })
                return
            } else if (gameEntry.player_o === user.state.username)
                user_type = 2 // we are player o

            /* Maybe there is a cleaner way to do the above but who cares */

            game.dispatch(setGameAction(gameEntry, user_type)) // move to game view
        }
    }

    const onClickLeave = (e) => {
        // unsubscribe to current game room
        socket.emit("unsubscribe", game.state.current.id);

        game.dispatch(setGameAction(null, null))
    }

    return (<>
        {user.state.username === null && <Login/>} {/* show login view if they aren't logged in already */}
        {user.state.username !== null && <> {/* otherwise show the rest */}
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
                    {games.state.games.map((game) => (
                        <GamesListEntry key={game.id}
                                        status={game.status}
                                        player_x={game.player_x}
                                        player_o={game.player_o}
                                        winner={game.winner}
                                        onClickJoin={thunkOnClickJoin(game)}/>))}
                    </tbody>
                </table>
            </div>}
            {game.state.current !== null && <Game socket={socket} onClickLeave={onClickLeave}/>}
        </>}
    </>)

}

export default GamesList