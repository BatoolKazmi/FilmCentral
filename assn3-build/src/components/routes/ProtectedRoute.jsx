import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

export default function ProtectedRoute({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await axios.get('https://film-central.vercel.app/api/auth/session', { withCredentials: true });
            if (response.data.user) {
                setUser(response.data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Error fetching user session:', error);
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
