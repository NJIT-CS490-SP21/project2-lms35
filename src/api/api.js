const loginApi = (username) => {
  const data = new FormData();
  data.append('username', username);
  return fetch('/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: data,
  }).then((response) => response.json());
};

const getSessionApi = () => fetch('/login', {
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
}).then((response) => response.json());

const getGameApi = () => fetch('/game', {
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
}).then((response) => response.json());

const getLeaderboardApi = () => fetch('/leaderboard', {
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
}).then((response) => response.json());

const getGamesApi = () => fetch('/games', {
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
}).then((response) => response.json());

const createGameApi = () => fetch('/games', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
  },
}).then((response) => response.json());

const updateGamePlayersApi = (gameId) => fetch(`/games/${gameId}`, {
  method: 'PUT',
  headers: {
    Accept: 'application/json',
  },
}).then((response) => response.json());

export {
  loginApi,
  getGameApi,
  getSessionApi,
  getLeaderboardApi,
  getGamesApi,
  createGameApi,
  updateGamePlayersApi,
};
