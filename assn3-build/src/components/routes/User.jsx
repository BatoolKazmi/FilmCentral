import NavBar from "../NavBar";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { useUser } from "../UserContext";
import "../../styles/details.css"

const User = () =>  {
  // const { user, logout } = useUser();
  const [stats, setStats] = useState({});

  useEffect(() => {
    
    fetchStats();

  }, []);
    
  const fetchStats = async () => {
  
    try {
      const response = await axios.get(`https://film-central-backend.vercel.app/api/user/stats`, { withCredentials: true });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

    return (
        <>
            <NavBar />
            <div className="user-stats">
                <h1>User Stats 👤</h1>
                <table>
                  <tr>
                      <th>Field</th>
                      <th>Details</th>
                  </tr>
                  <tr>
                      <td>UserId</td>
                      <td>{stats.userId}</td>
                  </tr>
                  <tr>
                      <td>Username</td>
                      <td>{stats.username}</td>
                  </tr>
                  <tr>
                      <td>Email</td>
                      <td>{stats.email}</td>
                  </tr>
                  <tr>
                      <td>API Key</td>
                      <td>{stats.api_key}</td>
                  </tr>
                  <tr>
                      <td>API Date</td>
                      <td>{stats.api_date}</td>
                  </tr>
                </table>
            </div>
            
        </>
    );
}

export default User;
