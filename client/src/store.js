import { applyMiddleware, createStore } from 'redux'
import stopwatchReducer from './reducers/stopwatchReducer'
import thunk from 'redux-thunk'

const store = createStore(stopwatchReducer, applyMiddleware(thunk))

export default store 