import axios from 'axios';

const url = {
    local: "http://localhost:5000",
    pwa: "http://192.168.0.5:8080"
}

export default axios.create({
    baseURL: url.local,
    headers:{
        'Content-Type':'application/json'
    }
})