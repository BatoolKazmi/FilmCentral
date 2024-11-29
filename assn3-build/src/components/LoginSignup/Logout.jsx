import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
    
  const handleLogout = async () => {
    try {
        // Call the backend logout route
        await axios.get('http://localhost:5000/logout', { withCredentials: true });

        // // Perform any frontend logout operations
        // logout();

        // Redirect to login page
        navigate('/login');
    } catch (error) {
        console.error('Error during logout:', error);
    }
};

  return (
    <button href="/login" onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
