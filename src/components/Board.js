import React, {useContext, useEffect, useState} from "react";
import "../Board.css"
import Square from "../Square";
import {Context as GameContext} from "../context/game";
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function Board() {
    const {state, dispatch} = useContext(GameContext)

    useEffect(() => {
        socket.on('tictactoe', (data) => {
            console.log(data)
            setBoard(board => {
                let newBoard = [...board]
                newBoard.splice(data['i'], 1, data['x'])
                return newBoard
            });
        });
    }, []);

    const onClickHandler = (idx) => {
        return (e) => {
            let newBoard = [...board]
            newBoard.splice(idx, 1, !newBoard[idx])
            setBoard(newBoard)
            socket.emit('tictactoe', {i: idx, x: newBoard[idx]})
        }
    }

    const valueHelper = (value) => {
        switch (value) {
            case null:
            default:
                return '';
            case false:
                return 'O';
            case true:
                return 'X';
        }
    }

    return (
        <div className="board">
            {state.board.map((value, idx) =>
                <Square key={idx}
                        idx={idx}
                        value={valueHelper(value)}
                        onClick={onClickHandler(idx)}/>
            )}
        </div>
    );
}

export default Board;