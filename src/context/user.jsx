import PropType from 'prop-types';
import React, { useReducer } from 'react';

const initialContext = {
  losses: 0,
  score: 0,
  username: null,
  wins: 0,
};

const initState = () => initialContext;

const reducer = (state, action) => {
  let result = {
    ...state,
  };

  switch (action.type) {
    case 'login':
      // handle login action
      result = { ...action.payload };
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

const loginAction = (session) => ({ type: 'login', payload: session });

export { Context, ContextProvider, loginAction };
