import NavBar from "./NavBar";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const User = ({ userId }) =>  {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {

            const API = `https://loki.trentu.ca/~batoolkazmi/3430/assn2/cois-3430-2024su-a2-Batool-Kazmi/api/user/${userId}/stats`
          try {
            const response = await axios.get(API);
            setStats(response.data);
          } catch (error) {
            console.error('Error fetching user stats:', error);
          }
        };
    
        fetchStats();
      }, [userId]);
    

    return (
        <>
            <NavBar />
            <div>
                <h2>User Stats</h2>
                <p>UserId: {stats.userId}</p>
                <p>Username: {stats.username}</p>
                <p>Email: {stats.email}</p>
                <p>API Key: {stats.api_key}</p>
                <p>API Date: {stats.api_date}</p>

                <h3>Other Stats</h3>
                <p>Total Time Watched: {stats.total_time_watched} minutes</p>
                <p>Average Rating: {stats.avg_rating}</p>
                <p>Total Movies Watched: {stats.total_movies_watched}</p>
                <p>Total Movies in Watch List: {stats.total_watch_list_movies}</p>

            </div>
        </>
    );
}

export default User;
