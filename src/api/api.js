const loginApi = (username) => {
    const data = new FormData()
    data.append('username', username)
    return fetch('/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: data
    })
        .then(response => response.json())
}

const getSessionApi = () => {
    return fetch('/login', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
}

const getGameApi = () => {
    return fetch('/game', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
}


const getLeaderboardApi = () => {
    return fetch('/leaderboard', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
}


const getGamesApi = () => {
    return fetch('/games', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
}


const createGameApi = () => {
    return fetch('/games', {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
}


const updateGamePlayersApi = (game_id) => {
    return fetch('/games/' + game_id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
}

export {
    loginApi,
    getGameApi,
    getSessionApi,
    getLeaderboardApi,
    getGamesApi,
    createGameApi,
    updateGamePlayersApi
}