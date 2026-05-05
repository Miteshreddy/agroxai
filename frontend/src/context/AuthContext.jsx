import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('cv_token');
        const savedUser = localStorage.getItem('cv_user');

        if (savedToken && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
                setToken(savedToken);
            } catch (err) {
                console.error('Auth initialization error:', err);
                localStorage.removeItem('cv_token');
                localStorage.removeItem('cv_user');
            }
        }
        setLoading(false);
    }, []);


    const login = async (username, password) => {
        const baseURL = import.meta.env.VITE_API_URL || '/api';
        try {
            const response = await axios.post(`${baseURL}/auth/login`, { username, password });
            const { token, user: userData } = response.data;

            localStorage.setItem('cv_token', token);
            localStorage.setItem('cv_user', JSON.stringify(userData));

            setToken(token);
            setUser(userData);

            toast.success('Welcome back!');
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.error || 'Login failed');
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed. Please try again.'
            };
        }
    };


    const register = async (username, password) => {
        const baseURL = import.meta.env.VITE_API_URL || '/api';
        try {
            const response = await axios.post(`${baseURL}/auth/register`, { username, password });
            const { token, user } = response.data;

            localStorage.setItem('cv_token', token);
            localStorage.setItem('cv_user', JSON.stringify(user));

            setToken(token);
            setUser(user);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Registration failed.'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('cv_token');
        localStorage.removeItem('cv_user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
