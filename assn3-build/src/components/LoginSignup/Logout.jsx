import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

const Logout = () => {
  const { logout } = useUser();
  const navigate = useNavigate();
    
  const handleLogout = async () => {
    try {
        await logout(); // Use the logout function from UserContext
        navigate('/login'); // Redirect to login page
    } catch (error) {
        console.error('Error during logout:', error);
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
