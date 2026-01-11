import { API_URL } from "./api"
import axios from 'axios';

const handleRequest = (config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
    }
    return config;
};

const instance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

instance.interceptors.request.use(handleRequest);

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance;