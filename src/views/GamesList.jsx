import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { Context as UserContext } from '../context/user';
import { Context as CurrentGameContext, setCurrent } from '../context/game';
import {
  Context as GamesContext,
  setGameAction,
  setGamesListAction,
} from '../context/games';
import { createGameApi, getGamesApi, updateGamePlayersApi } from '../api/api';
import GamesListEntry from '../components/GamesListEntry';
import Game from './Game';
import Leaderboard from '../components/Leaderboard';
import '../assets/styles/GamesList.css';

const GamesList = ({ socket }) => {
  const user = useContext(UserContext);
  const games = useContext(GamesContext);
  const game = useContext(CurrentGameContext);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    // get initial list of games and set the state
    getGamesApi().then((data) => games.dispatch(setGamesListAction(data.games)));

    // listen to changes to games to update state
    socket.on('games', (data) => games.dispatch(setGameAction(data)));
  }, []);

  // function to handle creating a new game
  const onClickCreate = () => {
    createGameApi().then((data) => {
      // set the game to the current game
      game.dispatch(setCurrent(data, 1));
    });
  };

  // function to handle clicking join on a room
  const thunkOnClickJoin = (gameEntry) => () => {
    let userType = 3;
    if (gameEntry.player_x === user.state.username) userType = 1;
    // we are player x
    else if (gameEntry.player_o === null) {
      userType = 2; // claim player o
      updateGamePlayersApi(gameEntry.id).then((data) => {
        // tell the server that we are player o
        game.dispatch(setCurrent(data.game, userType)); // move to the game view
      });
      return;
    } else if (gameEntry.player_o === user.state.username) userType = 2; // we are player o

    /* Maybe there is a cleaner way to do the above but who cares */

    game.dispatch(setCurrent(gameEntry, userType)); // move to game view
  };

  const onClickLeave = () => {
    // unsubscribe to current game room
    socket.emit('unsubscribe', game.state.current.id);

    game.dispatch(setCurrent(null, null));
  };

  return (
    <>
      {' '}
      {/* otherwise show the rest */}
      <div>
        <h2>Leaderboard</h2>
        {!showLeaderboard && (
          <button type="button" onClick={() => setShowLeaderboard(true)}>
            Show Leaderboard
          </button>
        )}
        {showLeaderboard && (
          <button type="button" onClick={() => setShowLeaderboard(false)}>
            Hide Leaderboard
          </button>
        )}
        {showLeaderboard && <Leaderboard socket={socket} />}
      </div>
      {game.state.current === null && (
        <div>
          <h2>Games</h2>
          <button type="button" onClick={onClickCreate}>
            Create new Game
          </button>
          <table className="games-list">
            <thead>
              <tr style={{ textAlign: 'left' }}>
                <td>X</td>
                <td>O</td>
                <td>Status</td>
                <td>Winner</td>
                <td />
              </tr>
            </thead>
            <tbody>
              {Object.values(games.state.games).map((gameEntry) => (
                <GamesListEntry
                  key={gameEntry.id}
                  status={gameEntry.status}
                  player_x={gameEntry.player_x}
                  player_o={gameEntry.player_o}
                  winner={gameEntry.winner}
                  onClickJoin={thunkOnClickJoin(gameEntry)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      {game.state.current !== null && (
        <Game socket={socket} onClickLeave={onClickLeave} />
      )}
    </>
  );
};

GamesList.propTypes = {
  socket: PropTypes.instanceOf(Socket).isRequired,
};

export default GamesList;
