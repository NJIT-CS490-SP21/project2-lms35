import Board from "../Board";
import {useContext} from "react";
import {Context as GameContext} from "../context/game";
import {Context as UserContext} from "../context/user";

const Game = (props) => {
    const {gameState} = useContext(GameContext)
    const {userSate} = useContext(UserContext)

    return <Board/>

}

export default Game