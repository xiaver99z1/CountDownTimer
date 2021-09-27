import http from '../config/http';

const fetchAll = () => {
    return http.get('/logs')
}

const add = data => {
    return http.post('/logs', data)
}

const update = (timestamp, log_type, data) => {
    return http.put(`/logs/${timestamp}/${log_type}`, data)
}

const remove = id => {
    return http.delete(`/logs/${id}`)   
}


export default {
    fetchAll, add, update, remove
}
