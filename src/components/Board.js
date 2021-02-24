import React, {useContext, useEffect} from "react";
import "../assets/styles/Board.css"
import Square from "./Square";
import {claimSquareAction, Context as GameContext} from "../context/game";
import {Context as UserContext} from "../context/user";


function Board({socket}) {
    const {state, dispatch} = useContext(GameContext)
    const user = useContext(UserContext)

    useEffect(() => {
        console.log(state)
    }, [state])

    const onClickHandler = (idx) => {
        return (e) => {
            const payload = {i: idx, p: user.state.player}
            dispatch(claimSquareAction(payload))
            socket.emit('claim', payload)
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
            {state.board.map((value, idx) => {
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