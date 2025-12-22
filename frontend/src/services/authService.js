import api from './api';

const login = async (email, password) => {
    // OAuth2 expects form data, not JSON
    const formData = new FormData();
    formData.append('username', email); // OAuth2 standard uses 'username'
    formData.append('password', password);

    const response = await api.post('/api/token', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    if (response.data.access_token) {
        localStorage.setItem('user_token', response.data.access_token);
    }

    return response.data;
};

const register = async (email, password) => {
    const response = await api.post('/api/register', {
        email,
        password
    });
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user_token');
};

const getCurrentToken = () => {
    return localStorage.getItem('user_token');
};

const authService = {
    login,
    register,
    logout,
    getCurrentToken
};

export default authService;
