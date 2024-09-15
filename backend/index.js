import express from "express";
import session from "express-session";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";
import mysql from "mysql";

// import loginhandler from "./loginhandler.js";
// import signuphandler from "./signuphandler.js";

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173', // React app URL
    credentials: true
}));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "batoolkazmi"

})

app.use(session({
    secret: 'hi',
    resave: true,
    saveUninitialized: false
}));

app.get('/', (req, res) => {
    return res.json("from backend side");
});

/////////////////// MOOOOVIES //////////////////////////////////////
app.get('/movies', (req, res) => {
    let query = `SELECT 
                    m.id AS movie_id, 
                    m.title, 
                    GROUP_CONCAT(DISTINCT g.id ORDER BY g.id) AS genre_ids, 
                    GROUP_CONCAT(DISTINCT g.name ORDER BY g.name) AS genre_names,
                    GROUP_CONCAT(DISTINCT pc.id ORDER BY pc.id) AS company_ids, 
                    GROUP_CONCAT(DISTINCT pc.name ORDER BY pc.name) AS company_names,
                    m.runtime, 
                    m.poster, 
                    m.vote_average, 
                    m.original_language, 
                    m.overview, 
                    m.tagline, 
                    m.vote_count
                FROM 3430_movies m
                LEFT JOIN 3430_movie_genres mg ON m.id = mg.movie_id
                LEFT JOIN 3430_genres g ON mg.genre_id = g.id
                LEFT JOIN 3430_movie_companies mc ON m.id = mc.movie_id
                LEFT JOIN 3430_production_companies pc ON mc.company_id = pc.id`;
    
    let params = [];
    const { title, runtime, vote_average, genres, company } = req.query;

    // Filtering logic
    if (title || runtime || vote_average || genres || company) {
        query += " WHERE ";
        const conditions = [];

        if (title) {
            conditions.push("m.title LIKE ?");
            params.push(`%${title}%`);
        }

        if (runtime) {
            conditions.push("m.runtime >= ?");
            params.push(runtime);
        }

        if (vote_average) {
            conditions.push("m.vote_average LIKE ?");
            params.push(`${vote_average}.%`);
        }

        if (genres) {
            conditions.push("g.name LIKE ?");
            params.push(`%${genres}%`);
        }

        if (company) {
            conditions.push("pc.name LIKE ?");
            params.push(`%${company}%`);
        }

        query += conditions.join(" AND ");
    }

    query += " GROUP BY m.id, m.title";

    db.query(query, params, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// Get specific movie details --- ? idk if it works..
app.get('/movies/:id', (req, res) => {
    const { id } = req.params;

    const query = `SELECT 
                    m.id AS movie_id, 
                    m.title, 
                    GROUP_CONCAT(DISTINCT g.id ORDER BY g.id) AS genre_ids, 
                    GROUP_CONCAT(DISTINCT g.name ORDER BY g.name) AS genre_names,
                    GROUP_CONCAT(DISTINCT pc.id ORDER BY pc.id) AS company_ids, 
                    GROUP_CONCAT(DISTINCT pc.name ORDER BY pc.name) AS company_names,
                    m.runtime, 
                    m.poster, 
                    m.vote_average, 
                    m.original_language, 
                    m.overview, 
                    m.tagline, 
                    m.vote_count
                FROM 3430_movies m
                LEFT JOIN 3430_movie_genres mg ON m.id = mg.movie_id
                LEFT JOIN 3430_genres g ON mg.genre_id = g.id
                LEFT JOIN 3430_movie_companies mc ON m.id = mc.movie_id
                LEFT JOIN 3430_production_companies pc ON mc.company_id = pc.id
                WHERE m.id = ?
                GROUP BY m.id, m.title`;

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

/// Get all
////// companies get all ///////
app.get('/companies', (req, res) => {
    const query = 'SELECT id, name FROM 3430_production_companies';

    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

/////// GENRES ////////
app.get('/genres', (req, res) => {
    const query = 'SELECT id, name FROM 3430_genres';

    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// authentication API KEY
// Mock authentication function
function authenticateApiKey(apiKey) {
    // Replace with real authentication logic
    const mockUserId = 1;
    return apiKey === 'valid_api_key' ? mockUserId : null;
}


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
    console.log('Server is running on port 5000 :)');
});
