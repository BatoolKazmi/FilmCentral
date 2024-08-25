import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { useUser } from '../UserContext';

export default function ProtectedRoute({ children }) {
    const { user } = useUser();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
}
