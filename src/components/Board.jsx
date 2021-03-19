/* eslint-disable react/no-array-index-key */

import React, { useContext } from 'react';
import '../assets/styles/Board.css';
import { Socket } from 'socket.io-client';
import PropTypes from 'prop-types';
import Square from './Square';
import { claimSquareAction, Context as GameContext } from '../context/game';

const moveCount = (squares) => squares.reduce(
  (acc, cv) => acc + cv.reduce((acc2, sq) => acc2 + (sq !== null), 0),
  0,
); /* count the number of x's & o's using array reduce */

const Board = ({ socket }) => {
  const game = useContext(GameContext);

  const emptyThunk = () => {
    /* empty thunk */
  };

  const turnCheck = () => {
    const moves = moveCount(
      game.state.current.squares,
    ); /* count the number of x's & o's using array reduce */
    return (
      (moves % 2 === 0
        && game.state.user_type
          === 1) /* player x goes when number of moves is even */
      || (moves % 2 === 1 && game.state.user_type === 2)
    ); /* player o goes when number of moves is odd */
  };

  const onClickHandler = (i, j) => {
    if (game.state.current.status !== 'running') return emptyThunk;
    switch (game.state.user_type) {
      case 1:
      case 2:
        return () => {
          if (turnCheck()) {
            const payload = { i, j, u: game.state.user_type };
            game.dispatch(claimSquareAction(payload));
            socket.emit('claim', {
              ...payload,
              channel: game.state.current.id,
            });
          }
        };
      case 3:
      default:
        return emptyThunk;
    }
  };

  const valueHelper = (value) => {
    switch (value) {
      case null:
        return '';
      default:
        return value;
    }
  };

  return (
    <div className="board">
      {game.state.current.squares.map((row, i) => row.map((square, j) => (
        <Square
          key={`${i}-${j}`}
          value={valueHelper(square)}
          onClick={onClickHandler(i, j)}
        />
      )))}
    </div>
  );
};

Board.propTypes = {
  socket: PropTypes.instanceOf(Socket).isRequired,
};

export { moveCount };
export default Board;
