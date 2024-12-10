import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

export default function ProtectedRoute({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUser = async () => {
        try {
            setLoading(true); // Start loading
            setError(null); // Reset error state

            const response = await axios.get(
                'https://film-central-end.vercel.app/api/auth/session',
                { withCredentials: true } // Include cookies for authentication
            );

            setUser(response.data?.user || null); // Set user data or null
        } catch (err) {
            console.error('Error fetching user session:', err.response?.data || err.message);
            setError('Unable to authenticate. Please log in again.');
            setUser(null);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Replace with a spinner or loading animation if desired
    }

    if (error) {
        return (
            <div>
                <p>{error}</p>
                <Navigate to="/login" /> {/* Redirect to login if there's an error */}
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
}
