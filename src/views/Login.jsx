import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { Context, loginAction } from '../context/user';
import '../assets/styles/Login.css';
import { getSessionApi, loginApi } from '../api/api';
import GamesList from './GamesList';

const Login = ({ socket }) => {
  const { state, dispatch } = useContext(Context);
  const [value, setValue] = useState('');

  useEffect(() => {
    getSessionApi().then((data) => {
      if (data.error === undefined) dispatch(loginAction(data));
    });
  }, []);

  const onClick = (e) => {
    e.preventDefault();
    loginApi(value).then((data) => {
      socket.disconnect();
      socket.connect(); /* hacky way to get sessions to work */
      dispatch(loginAction(data));
    });
  };

  return (
    <>
      {state.username === null && (
        <div>
          <label htmlFor="username">
            Please enter your username:
            <input
              type="text"
              name="username"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button type="button" onClick={onClick}>
              Submit
            </button>
          </label>
        </div>
      )}
      {state.username !== null && <GamesList socket={socket} />}
    </>
  );
};

Login.propTypes = {
  socket: PropTypes.instanceOf(Socket).isRequired,
};

export default Login;
