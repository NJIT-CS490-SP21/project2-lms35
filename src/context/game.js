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

    return result
}

export {
    Context,
    ContextProvider,
}