import React from "react";
import "./Board.css"
import Square from "./Square";
import {useState, useEffect} from "react"

function Board() {
    const [board, setBoard] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);

    const onClickHandler = (idx) => {
        return (e) => {
            let newBoard = [...board]
            switch (newBoard[idx]) {
                case '0':
                case 0:
                    newBoard[idx] = 'X'
                    setBoard(newBoard)
                    return
                case 'X':
                    newBoard[idx] = 0;
                    setBoard(newBoard)
                    return;
            }
        }
    }

    let boxes = board.map((value, idx) => {
        return <Square key={idx} idx={idx} value={value} onClick={onClickHandler(idx)}/>
    })

    return (
        <div className="board">
            {boxes}
        </div>
    );
}

export default Board;