import React, {useReducer} from 'react'

const initialContext = {
    'username': null,
    'type': null,
    'player': null
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
        case 'login':
            // handle login action
            result = {...action.payload}
            break
    }

    return result
}

const loginAction = (session) => ({type: 'login', payload: session})

export {
    Context,
    ContextProvider,
    loginAction
}