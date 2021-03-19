import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Socket } from 'socket.io-client';
import Board from '../components/Board';
import {
  claimSquareAction,
  Context as GameContext,
  setCurrent,
} from '../context/game';

const Game = ({ socket, onClickLeave }) => {
  const game = useContext(GameContext);

  useEffect(() => {
    // subscribe to current game room
    socket.emit('subscribe', game.state.current.id);

    // listen to changes on the game and update state
    socket.on('game', (data) => {
      game.dispatch(setCurrent(data, game.state.user_type));
    });

    // listen to claim events on the squares and update state
    socket.on('claim', (data) => {
      game.dispatch(claimSquareAction(data));
    });
  }, []);

  return (
    <div>
      {game.state.user_type === 3 && <h4>You are spectating.</h4>}
      {game.state.current.status === 'waiting_for_players' && (
        <div>
          <h2>Waiting for more players to join...</h2>
        </div>
      )}
      {game.state.current.status === 'finished'
        && game.state.current.winner !== null && (
          <h3>
            Game Ended,
            {game.state.current.winner}
            {' '}
            is the winner!
          </h3>
      )}
      {game.state.current.status === 'finished'
        && game.state.current.winner === null && <h3>Game Ended in a tie.</h3>}
      <Board socket={socket} />
      <div style={{ marginTop: '10px' }}>
        <button type="button" onClick={onClickLeave}>
          {game.state.current.status === 'finished'
            ? 'Return and Play Another'
            : 'Leave Game'}
        </button>
      </div>
    </div>
  );
};

Game.propTypes = {
  socket: PropTypes.instanceOf(Socket).isRequired,
  onClickLeave: PropTypes.func.isRequired,
};

export default Game;
