import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
// import { useUser } from '../UserContext';
import axios from 'axios';

export default function ProtectedRoute({ children }) {
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/session', { withCredentials: true });
            if (response.data.user) {
                setUser(response.data);
            }
        } catch (error) {
            console.error('Error fetching user session:', error);
        }
    };

    useEffect(() => {
        fetchUser(); // Fetch user data when app loads
    }, []);

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
}
