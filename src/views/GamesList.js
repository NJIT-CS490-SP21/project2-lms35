import {useContext, useEffect} from "react";
import {Context as UserContext} from "../context/user";
import {Context as CurrentGameContext, setGameAction} from "../context/game";
import {addGameAction, Context as GamesContext, setGamesListAction} from "../context/games";
import Login from "./Login";
import {createGameApi, getGamesApi} from "../api/api";
import GamesListEntry from "../components/GamesListEntry";
import Game from "./Game";

const GamesList = ({socket}) => {
    const user = useContext(UserContext)
    const games = useContext(GamesContext)
    const game = useContext(CurrentGameContext)

    useEffect(() => {
        getGamesApi().then(data => games.dispatch(setGamesListAction(data.games)))
        socket.on('games', (data) => games.dispatch(addGameAction(data)));
    }, []);

    const onClickCreate = (e) => {
        createGameApi().then(data => {
            console.log(data)
            // set the game to the current game
            game.dispatch(setGameAction(data))
        })
    }

    const thunkOnClickJoin = (gameEntry) => {
        return (e) => {
            let user_type = 3
            if (gameEntry.player_x === user.state.username)
                user_type = 1 // we are player x
            else if (gameEntry.player_o)
                user_type = 2 // we are player o

            // todo: assign to player o if player o is null

            game.dispatch(setGameAction(gameEntry, user_type))
        }
    }

    const onClickLeave = (e) => {
        console.log('onclick')
        game.dispatch(setGameAction(null, null))
    }

    if (user.state.username == null)
        return <Login/>

    return (<>
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
    </>)

}
export default GamesList