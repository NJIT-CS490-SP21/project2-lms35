import React, {useReducer} from 'react'

const initialContext = {
    current: null,
    user_type: null // 1 => player_x, 2=> player_y, 3=> spectator
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
        case 'set-game':
            if (action.payload.game === null)
                result['current'] = null
            else
                result['current'] = {...action.payload.game}
            result['user_type'] = action.payload.user_type
            break
        case 'claim-square':
            const newBoard = [...result.board]
            newBoard.splice(action.payload.i, 1, action.payload.p)
            result.board = newBoard
            console.log(newBoard)
            break
    }
    return result
}

const claimSquareAction = ({i, p}) => ({type: 'claim-square', payload: {i: i, p: p}})
const setGameAction = (game, user_type) => ({type: 'set-game', payload: {game: game, user_type: user_type}})

export {
    Context,
    ContextProvider,
    claimSquareAction,
    setGameAction
}