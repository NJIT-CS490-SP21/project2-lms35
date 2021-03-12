import PropTypes from 'prop-types';
import React from 'react';

const GameListEntry = ({
  status, playerX, playerO, winner, onClickJoin,
}) => {
  const statusSwitch = (st) => {
    switch (st) {
      case 'waiting_for_players':
        return 'Waiting for Players';
      case 'running':
        return 'Running';
      case 'finished':
        return 'Finished';
      default:
        return 'Unknown';
    }
  };

  return (
    <tr>
      <td>
        {playerX !== null && playerX}
        {playerX === null && '--'}
      </td>
      <td>
        {playerO !== null && playerO}
        {playerO === null && '--'}
      </td>
      <td>{statusSwitch(status)}</td>
      <td>
        {winner !== null && winner}
        {winner === null && '--'}
      </td>
      <td>
        <button type="button" onClick={onClickJoin}>
          Join!
          {/* {status === "waiting_for_players' && playerO === null && <>Play!</>} */}
          {/* {status === 'running' && <>Spectate!</>} */}
        </button>
      </td>
    </tr>
  );
};

GameListEntry.propTypes = {
  status: PropTypes.string,
  playerX: PropTypes.string,
  playerO: PropTypes.string,
  winner: PropTypes.string,
  onClickJoin: PropTypes.func.isRequired,
};

GameListEntry.defaultProps = {
  status: null,
  playerX: null,
  playerO: null,
  winner: null,
};

export default GameListEntry;
