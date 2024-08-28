import express from "express";
import session from "express-session";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";
import config from "./config.js"

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173', // React app URL
    credentials: true
}));

app.use(session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}));

app.get('/api/auth/session', (req, res) => {
    console.log("hey this is user auth")
    console.log(req.session.userId)
    console.log(req.session.api_key)
    if (req.session.userId) {
        res.json({ 
            user: req.session.userId,
            api_key: req.session.api_key
        });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

// Example login route
app.post('/api/auth/login', async (req, res) => {
    console.log("login")
    const { username, password } = req.body;
    // Authenticate user (this is just an example)
    try {
        // Authenticate user using your API
        const response = await axios.post('https://loki.trentu.ca/~batoolkazmi/3430/assn2/cois-3430-2024su-a2-Batool-Kazmi/api/login', { username, password });
        console.log("login...");
        console.log(username);
        console.log(password);
        console.log(response.data);

        if (response.data) {
            // Store user ID in session
            req.session.userId = response.data.userId;
            req.session.username = response.data.username;
            req.session.email = response.data.email;
            req.session.api_key = response.data.api_key;
            req.session.api_date = response.data.api_date;

            console.log("Session after login:", req.session);
            res.json({ success: true });
            console.log("login success")
            
            
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Failed to authenticate' });
    }

    
});

app.get('/api/getApiKey', (req, res) => {
    if (!req.session.api_key) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json({ apiKey: req.session.api_key });
  });
  

// Logout Route
app.get("/logout", (req, res) => {  
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to log out' });
        }
        res.json({ success: true });
    });
});

// Fetch User Stats Route
app.get('/api/user/stats', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    console.log(req.session.userId);

    try {
        const response = await axios.get(`https://loki.trentu.ca/~batoolkazmi/3430/assn2/cois-3430-2024su-a2-Batool-Kazmi/api/user/${req.session.userId}/stats`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ error: 'Failed to fetch user stats' });
    }
});


/// TO WATCH LIST 
app.post('/api/towatchlist/entries', async (req, res) => {
    

    if (!req.session.api_key) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const { movie_id, priority, notes } = req.body;
    const API = "https://loki.trentu.ca/~batoolkazmi/3430/assn2/cois-3430-2024su-a2-Batool-Kazmi/api/towatchlist/entries";

    try {
        const response = await axios.post(API, {
            key: req.session.api_key,
            movie_id,
            priority,
            notes,
            
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error adding movie to watchlist:', error);
        res.status(500).json({ error: 'Failed to add movie to watchlist' });
    }
});

app.get('/api/towatchlist/entries', async (req, res) => {

    if (!req.session.api_key) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const title = req.query.title; // Get title filter from query parameters
    const movieid = req.query.movieid;

    const API = `https://loki.trentu.ca/~batoolkazmi/3430/assn2/cois-3430-2024su-a2-Batool-Kazmi/api/towatchlist/entries`;

    try {
        const response = await axios.get(API, {
            headers: { "X-Api-Key": req.session.api_key }, // Pass API key in headers
            params: { title: title, movieid: movieid}
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

// COMPLETED WATCH LIST API HANDELING START!!

app.get('/api/completedwatchlist/entries', async (req, res) => {
    if (!req.session.api_key) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const title = req.query.title; // Get title filter from query parameters
    const movieid = req.query.movieid;

    const API = `https://loki.trentu.ca/~batoolkazmi/3430/assn2/cois-3430-2024su-a2-Batool-Kazmi/api/completedwatchlist/entries`;
    try {
        const response = await axios.get(API, {
            headers: { "X-Api-Key": req.session.api_key },
            params: { title: title, movieid: movieid } // Pass the filter title as query parameter
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});



app.listen(PORT, () => {
    console.log('Server is running on port 5000');
});
