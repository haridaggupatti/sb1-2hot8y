import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await axios.post(`${API_URL}/token`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, user } = response.data;
    localStorage.setItem('access_token', access_token);

    return {
      user: {
        email: user.email,
        role: user.is_admin ? 'admin' : 'user',
        isActive: user.is_active,
      },
      token: access_token,
    };
  },

  logout: () => {
    localStorage.removeItem('access_token');
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (tokenData.exp < currentTime) {
        localStorage.removeItem('access_token');
        return null;
      }

      return {
        email: tokenData.sub,
        role: tokenData.is_admin ? 'admin' : 'user',
        isActive: true,
      };
    } catch {
      localStorage.removeItem('access_token');
      return null;
    }
  },
};