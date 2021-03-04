import React, {useReducer} from 'react'

const initialContext = {
    'players': []
}

const initState = () => {
    return initialContext
}

const Context = React.createContext(initialContext)

function ContextProvider(props) {
    const [state, dispatch] = useReducer(reducer, undefined, initState)

    return (
        <Context.Provider value={{state, dispatch}}>
            {props.children}
        </Context.Provider>
    )
}

const reducer = (state, action) => {
    let result = {
        ...state
    }

    switch (action.type) {
        case 'update':
            // handle login action
            result.players = [...action.payload.players]
            break
    }

    console.log(result)
    return result
}

const updateLeaderboardAction = (leaderboard) => {
    console.log(leaderboard)
    return {type: 'update', payload: leaderboard}
}

export {
    Context,
    ContextProvider,
    updateLeaderboardAction
}