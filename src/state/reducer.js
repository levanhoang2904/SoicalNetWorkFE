import { SET_USER } from "./Constants";
const initState = {
    user: {},
}

function reducer(state, action) {
    switch(action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.payload
            }
            
            default:
                
                break;
        }
    
}

export { initState }
export default reducer
