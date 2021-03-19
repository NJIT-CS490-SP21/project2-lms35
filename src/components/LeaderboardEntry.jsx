import React from 'react';
import PropTypes from 'prop-types';

const LeaderboardEntry = ({ username, score, isMe }) => (
  <tr>
    <td>
      {isMe && (
        <b style={{ color: 'gold' }}>
          🤡&nbsp;
          {username}
          &nbsp;🤡
        </b>
      )}
      {!isMe && <>{username}</>}
    </td>
    <td>
      {isMe && <b style={{ color: 'gold' }}>{score}</b>}
      {!isMe && <>{score}</>}
    </td>
  </tr>
);

LeaderboardEntry.propTypes = {
  username: PropTypes.string,
  score: PropTypes.number,
  isMe: PropTypes.bool,
};

LeaderboardEntry.defaultProps = {
  username: null,
  score: 0,
  isMe: false,
};

export default LeaderboardEntry;
