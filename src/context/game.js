import React, {useReducer} from 'react'

const initialContext = {
    'status': null,
    'board': [null, null, null, null, null, null, null, null, null]
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
            result = {...action.payload}
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
const setGameAction = (game) => ({type: 'set-game', payload: game})

export {
    Context,
    ContextProvider,
    claimSquareAction,
    setGameAction
}