import PropType from 'prop-types';
import React, { useReducer } from 'react';

const initialContext = {
  games: {} /* index by id */,
};

const reducer = (state, action) => {
  const result = {
    ...state,
  };

  switch (action.type) {
    case 'set-list':
      action.payload.forEach((gameEntry) => {
        result.games[gameEntry.id] = { ...gameEntry };
      });
      break;
    case 'set':
      if (result.games[action.payload.id] !== undefined) {
        result.games[action.payload.id] = { ...action.payload };
      } else {
        const temp = {};
        temp[action.payload.id] = { ...action.payload };
        result.games = Object.assign(
          temp,
          result.games,
        ); /* hacky way to get it to the top of the object */
      }
      break;
    default:
      return result;
  }
  return result;
};

const initState = () => initialContext;

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

const setGamesListAction = (games) => ({ type: 'set-list', payload: games });
const setGameAction = (game) => ({ type: 'set', payload: game });

export {
  Context, ContextProvider, setGamesListAction, setGameAction,
};
