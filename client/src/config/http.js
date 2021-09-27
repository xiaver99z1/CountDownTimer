import axios from 'axios'
import { BASE_URL } from '../appContants'

const http = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
    }
})

export default http 