import React, {useContext, useEffect} from "react";
import "../assets/styles/Board.css"
import Square from "./Square";
import {claimSquareAction, Context as GameContext} from "../context/game";
import {Context as UserContext} from "../context/user";


function Board({socket}) {
    const game = useContext(GameContext)
    const user = useContext(UserContext)

    const onClickHandler = (idx) => {
        switch (user.state.type) {
            case 'player':
                return (e) => {
                    const payload = {i: idx, p: user.state.player}
                    game.dispatch(claimSquareAction(payload))
                    socket.emit('claim', payload)
                }
            default:
                return (e) => {
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

    return (
        <div className="board">
            {game.state.board.map((value, idx) => {
                    console.log([idx, value])
                    return <Square key={idx}
                                   idx={idx}
                                   value={valueHelper(value)}
                                   onClick={onClickHandler(idx)}/>
                }
            )}
        </div>
    );
}

export default Board;