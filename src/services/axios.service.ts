import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://friendo-59ng.onrender.com/api/hf',
});

export default instance;
