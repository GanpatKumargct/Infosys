import { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser } from './services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await loginUser({ email, password });
            const data = response.data;
            
            // Map roles
            let mappedRole = 'patient';
            if (data.role === 'ADMIN') mappedRole = 'admin';
            if (data.role === 'DOCTOR') mappedRole = 'trainer';
            if (data.role === 'RECEPTIONIST') mappedRole = 'receptionist';

            const userObj = { ...data, role: mappedRole };
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(userObj));
            
            // Optionally save specific profile fields to sync with other parts
            if (data.fullName) localStorage.setItem('fullName', data.fullName);
            
            setUser(userObj);
            return { success: true, role: mappedRole };
        } catch (error) {
            console.error('Login error', error);
            return { success: false, message: error.response?.data?.message || 'Invalid credentials or server error.' };
        }
    };

    const register = async (userData) => {
        try {
            const payload = {
                fullName: userData.name,
                email: userData.email,
                password: userData.password,
                role: 'PATIENT'
            };
            const response = await registerUser(payload);
            
            // If the user also provided age/weight, we might want to store them so the BMI calculator uses them immediately
            if (userData.age) localStorage.setItem('age', userData.age);
            if (userData.weight) localStorage.setItem('weight', userData.weight);
            
            return { success: true, message: 'Registration successful' };
        } catch (error) {
            console.error('Register error', error);
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    const checkEmail = async (email) => {
        try {
            const response = await fetch('http://localhost:5000/api/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Check email error:', error);
            return false;
        }
    };

    const resetPassword = async (email, newPassword) => {
        try {
            const response = await fetch('http://localhost:5000/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return { success: false, message: 'Server error. Please try again later.' };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, checkEmail, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
