import { GET_STOPWATCH, ADD_STOPWATCH, UPDATE_STOPWATCH, START } from '../appContants'

const initialState = {
    timer: {
        log_type: START,
        timestamp: '',
    },
    timeLogList: []
}

const stopwatchReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_STOPWATCH:
            return {
                ...state,
                timeLogList: action.payload
            }
        case ADD_STOPWATCH:
            return {
                ...state,
                timer: action.payload
            }
        case UPDATE_STOPWATCH:
            return {
                ...state,
                timer: action.payload
            }
        default:
            return state
    }
}

export default stopwatchReducer