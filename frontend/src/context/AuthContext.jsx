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

        if (savedToken && savedUser && savedUser !== 'undefined') {
            try {
                const parsedUser = JSON.parse(savedUser);
                if (parsedUser) {
                    setUser(parsedUser);
                    setToken(savedToken);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
                }
            } catch (err) {
                console.error('Auth initialization error:', err);
                localStorage.removeItem('cv_token');
                localStorage.removeItem('cv_user');
            }
        }
        setLoading(false);
    }, []);


    const login = async (username, password) => {
        const baseURL = import.meta.env.VITE_API_URL || 'https://agroxai.onrender.com/api';
        try {
            const response = await axios.post(`${baseURL}/auth/login`, { username, password });
            const { token, user: userData } = response.data;
            
            if (!userData || !token) {
                throw new Error('Invalid response from server');
            }

            localStorage.setItem('cv_token', token);
            localStorage.setItem('cv_user', JSON.stringify(userData));

            setToken(token);
            setUser(userData);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            toast.success('Welcome back!');
            return { success: true };
        } catch (error) {
            console.error('--- Login API Error ---');
            console.error('URL:', `${baseURL}/auth/login`);
            console.error('Message:', error.message);
            if (error.response) console.error('Response Data:', error.response.data);
            
            toast.error(error.response?.data?.error || 'Login failed');
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed. Please try again.'
            };
        }
    };


    const register = async (username, password) => {
        const baseURL = import.meta.env.VITE_API_URL || 'https://agroxai.onrender.com/api';
        const payload = { username, password };
        console.log("Register payload:", payload);

        try {
            const response = await axios.post(`${baseURL}/auth/register`, payload);
            const { token, user: userData } = response.data;

            if (!userData || !token) {
                throw new Error('Invalid response from server');
            }

            localStorage.setItem('cv_token', token);
            localStorage.setItem('cv_user', JSON.stringify(userData));
            setToken(token);
            setUser(userData);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return { success: true };
        } catch (error) {
            console.error('--- Register API Error ---');
            console.error("Response status:", error.response?.status);
            console.error("Response data:", error.response?.data);
            
            const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Registration failed.';
            toast.error(errorMessage);

            return {
                success: false,
                error: errorMessage
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
