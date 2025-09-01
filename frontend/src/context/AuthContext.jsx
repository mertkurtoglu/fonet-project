import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { authAPI } from '../services/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = useCallback(async (credentials) => {
        try {
            const userData = await authAPI.login(credentials);
            const userInfo = {
                id: userData.id,
                email: userData.email,
                role: userData.role,
                token: userData.token
            };
            
            localStorage.setItem('user', JSON.stringify(userInfo));
            setUser(userInfo);
            return userInfo;
        } catch (error) {
            throw error;
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('user');
        setUser(null);
    }, []);

    const value = {
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
