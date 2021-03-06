import React, {useContext} from "react";
import "../assets/styles/Board.css"
import Square from "./Square";
import {claimSquareAction, Context as GameContext} from "../context/game.js";


function Board({socket}) {
    const game = useContext(GameContext)

    const onClickHandler = (i, j) => {
        switch (game.state.user_type) {
            case 1:
            case 2:
                return (e) => {
                    if (turnCheck()) {
                        const payload = {i: i, j: j, u: game.state.user_type}
                        game.dispatch(claimSquareAction(payload))
                        socket.emit('claim', {...payload, channel: game.state.current.id})
                    }
                }
            case 3:
            default:
                return (e) => {
                    /* empty thunk */
                }
        }

    }

    const valueHelper = (value) => {
        switch (value) {
            case null:
                return ''
            default:
                return value
        }
    }

    const turnCheck = () => {
        const move_count = game.state.current.squares.reduce(
            (acc, cv) => acc + cv.reduce(
                (acc2, sq) => acc2 + (sq !== null),
                0),
            0) /* count the number of x's & o's using array reduce */
        return (move_count % 2 === 0 && game.state.user_type === 1) || /* player x goes when number of moves is even */
            (move_count % 2 === 1 && game.state.user_type === 2) /* player o goes when numebr of moves is odd*/
    }

    return (
        <div className="board">
            {game.state.current.squares.map((row, i) =>
                row.map((square, j) => {
                    return <Square
                        key={i + '-' + j}
                        value={valueHelper(square)}
                        onClick={onClickHandler(i, j)}
                    />
                })
            )}
        </div>
    );
}

export default Board;