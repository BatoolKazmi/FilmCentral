import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// export const UserContext = createContext();
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
    };
    
    const logout = async () => {
        try {
            // Send request to server to destroy session
            await axios.get('http://localhost:5000/logout', { withCredentials: true });
            setUser(null); // Clear user state
            localStorage.clear(); // Clear all data
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/session', { withCredentials: true });
            if (response.data.user) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.error('Error fetching user session:', error);
        }
    };

    useEffect(() => {
        fetchUser(); // Fetch user data when app loads
    }, []);


    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:5000/api/auth/session', { withCredentials: true });
    //             // Handle the response
    //         } catch (error) {
    //             console.error('Error fetching user session:', error);
    //         }
    //     };

    //     fetchUser();
    // }, []);

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);