import axios from "axios";

// Create a configured axios instance
const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

// Request interceptor to add the auth token header to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('user_token');
        console.log("This is your localStorage[user_token]", token)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
