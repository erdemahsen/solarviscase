import axios from "axios";

// Create a configured axios instance
// Use environment variable for base URL, fallback to localhost for dev
const baseURL = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({
    baseURL: baseURL,
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
