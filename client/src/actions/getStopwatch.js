import StopwatchService from '../services/StopwatchService'
import { GET_STOPWATCH, ADD_STOPWATCH, UPDATE_STOPWATCH } from '../appContants'

export const getStopwatchList = () => async dispatch => { 
    try {
        const response = await StopwatchService.fetchAll();
        dispatch(setStopwatchList(response))
    } 
    catch (error) {
        if (error.response) {
            console.log(error.response.data)
        }
        else if (error.request) {
            console.log(error.request)
        }
        else {
            console.log(error.message)
        }
    }
}

export const setStopwatchList = (response) => {
    return {
        type: GET_STOPWATCH,
        payload: response.data
    }
} 


export const addStopwatchList = (response) => {
    return {
        type: ADD_STOPWATCH,
        payload: response
    }
}

export const updateStopwatchList = (response) => {
    return {
        type: UPDATE_STOPWATCH,
        payload: response
    }
}

