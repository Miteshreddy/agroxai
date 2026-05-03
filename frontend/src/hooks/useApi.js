import { useState, useCallback } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5005/api',
  timeout: 15000,
});

// Request interceptor - add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cv_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cv_token');
      localStorage.removeItem('cv_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (config) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api(config);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Request failed';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((url, params) => request({ method: 'GET', url, params }), [request]);
  const post = useCallback((url, data) => request({ method: 'POST', url, data }), [request]);

  return { get, post, loading, error };
};

