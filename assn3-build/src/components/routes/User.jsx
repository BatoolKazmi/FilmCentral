import NavBar from "../NavBar";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { useUser } from "../UserContext";

const User = () =>  {
  // const { user, logout } = useUser();
  const [stats, setStats] = useState({});

  useEffect(() => {
    
    fetchStats();

  }, []);
    
  const fetchStats = async () => {
  
    try {
      const response = await axios.get(`http://localhost:5000/api/user/stats`, { withCredentials: true });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

    return (
        <>
            <NavBar />
            <div>
                <h1>User Stats</h1>
                <p>UserId: {stats.userId}</p>
                <p>Username: {stats.username}</p>
                <p>Email: {stats.email}</p>
                <p>API Key: {stats.api_key}</p>
                <p>API Date: {stats.api_date}</p>
            </div>
        </>
    );
}

export default User;
