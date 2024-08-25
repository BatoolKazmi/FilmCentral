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
    saveUninitialized: false,
    cookie: {  maxAge: 1000000 } // set secure: true if using https
}));

app.get('/api/auth/session', (req, res) => {
    console.log("hey")
    if (req.session.userId) {
        res.json({ user: req.session.userId });
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

app.listen(PORT, () => {
    console.log('Server is running on port 5000');
});
