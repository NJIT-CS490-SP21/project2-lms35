import React, {useReducer} from 'react'

const initialContext = {
    'games': []
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
        case 'set-list':
            result['games'] = [...action.payload]
            break
        case 'add':
            result['games'] = [action.payload, ...result.games]
            break
    }
    return result
}

const setGamesListAction = (games) => ({type: 'set-list', payload: games})
const addGameAction = (game) => ({type: 'add', payload: game})

export {
    Context,
    ContextProvider,
    setGamesListAction,
    addGameAction
}