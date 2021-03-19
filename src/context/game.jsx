import React, { useReducer } from 'react';
import PropType from 'prop-types';

const initialContext = {
  current: null,
  user_type: null, // 1 => player_x, 2=> player_y, 3=> spectator
};

const initState = () => initialContext;

const reducer = (state, action) => {
  const result = {
    ...state,
  };

  switch (action.type) {
    case 'set-game':
      if (action.payload.game === null) result.current = null;
      else result.current = { ...action.payload.game };
      result.user_type = action.payload.user_type;
      break;
    case 'claim-square': {
      const newBoard = [...result.current.squares];
      newBoard[action.payload.i][action.payload.j] = action.payload.u === 1 ? 'x' : 'o';
      result.current.squares = newBoard;
      break;
    }
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

const claimSquareAction = ({ i, j, u }) => ({
  type: 'claim-square',
  payload: { i, j, u },
});
const setCurrent = (game, userType) => ({
  type: 'set-game',
  payload: { game, user_type: userType },
});

export {
  Context, ContextProvider, claimSquareAction, setCurrent,
};
