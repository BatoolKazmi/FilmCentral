import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

export default function ProtectedRoute({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/session', { withCredentials: true });
            setUser(response.data.user || null);
        } catch (error) {
            console.error('Error fetching user session:', error.response?.data || error.message);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser(); // Fetch user data when component mounts
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Or any loading spinner you prefer
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
}
