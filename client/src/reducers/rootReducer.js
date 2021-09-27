import { combineReducers } from 'redux'
import stopwatchReducer from './stopwatchReducer'


const rootReducer = combineReducers({
    timer: stopwatchReducer
})

export default rootReducer 