import PropType from 'prop-types';
import React, { useReducer } from 'react';

const initialContext = {
  players: [],
};

const initState = () => initialContext;

const reducer = (state, action) => {
  const result = {
    ...state,
  };

  switch (action.type) {
    case 'update':
      // handle login action
      result.players = [...action.payload.players];
      break;
    default:
      return result;
  }

  return result;
};

const Context = React.createContext(initialContext);

function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initState);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
}

ContextProvider.propTypes = {
  children: PropType.arrayOf(React.Children).isRequired,
};

const updateLeaderboardAction = (leaderboard) => ({
  type: 'update',
  payload: leaderboard,
});

export { Context, ContextProvider, updateLeaderboardAction };
