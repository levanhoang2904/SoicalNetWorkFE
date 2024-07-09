import { useReducer } from 'react'
import Context from './Context'
import reducer, { initState } from '../state/reducer'
function Provider({children}) {
    const [state, dispatch] = useReducer(reducer, initState)

    return (
        
        <Context.Provider value = {[state, dispatch]}>
            {children}
        </Context.Provider>
    )
}

export default Provider