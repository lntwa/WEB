import axios from 'axios'

const api = axios.create({
  baseURL: './api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
    const authData = JSON.parse(localStorage.getItem('auth'));
    const token = authData?.accessToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api