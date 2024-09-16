import express from "express";
import session from "express-session";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";
import mysql from "mysql";
import bcrypt from "bcrypt";
import crypto from "crypto";

// import { loginhandler } from "./loginhandler.js";
// import { signuphandler } from "./signuphandler.js";
// // const loginHandler = require('./loginhandler');
// // const signupHandler = require('./signuphandler');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173', // React app URL
    credentials: true
}));
app.use(express.json());


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "batoolkazmi"

})

app.use(session({
    secret: 'New_Secret_Session',
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
    const { title, vote_average, genres, company } = req.query;

    // Filtering logic
    if (title || vote_average || genres || company) {
        query += " WHERE ";
        const conditions = [];

        if (title) {
            conditions.push("m.title LIKE ?");
            params.push(`%${title}%`);
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

// POST endpoint routing
//login
app.post('/login', async (req,res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    try{
        // Query to check if user exists
        const query = 'SELECT userId, username, email, password, api_key, api_date FROM 3430_users WHERE username = ?';
        
        db.query(query, [username], (err, result) => {
            
            if (err) return res.status(500).json({ error: err.message });

            // Check if user exists
            if (!result || result.length === 0) {
                return res.status(401).json({ message: "Invalid username or password." });
            }

            const user = result[0];

            bcrypt.compare(password, user.password, (err, result) => {
                
                if(err){
                    // handle error
                    return res.status(500).json({ message: "Error" });
                }

                if (!result) {
                    return res.status(401).json({ message: "Invalid username or password" });
                }
            
                // Start session and store user information
                req.session.userId = user.userId;
                req.session.username = user.username;
                req.session.email = user.email;
                req.session.api_key = user.api_key;
                req.session.api_date = user.api_date;

                // Send successful response
                res.status(200).json({
                    message: "Login successful.",
                    userId: user.userId,
                    username: user.username,
                    email: user.email,
                    api_key: user.api_key,
                    api_date: user.api_date
                });

            });
        });
        
    }catch (error){
        console.error(error);
        res.status(500).json({ message: "Login Failed" });
    }
   
});

app.post('/signup', async (req,res) => {
    const { username, password, password2, email } = req.body;

    // Input validation
    if (!username || !password || !email) {
        return res.status(400).json({ message: "Username, password, and email are required." });
    }

    if (password !== password2) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    if (password.length < 10) {
        return res.status(400).json({ message: "Password must be at least 10 characters long." });
    }

    try {
        // Check if username already exists
        const usernameQuery = 'SELECT COUNT(userId) AS count FROM 3430_users WHERE username = ?';
        const [usernameCheck] = await new Promise((resolve, reject) => {
            db.query(usernameQuery, [username], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        if (usernameCheck.count > 0) {
            return res.status(400).json({ message: "Username is already taken." });
        }

        // Check if email already exists
        const emailQuery = 'SELECT COUNT(userId) AS count FROM 3430_users WHERE email = ?';
        const [emailCheck] = await new Promise((resolve, reject) => {
            db.query(emailQuery, [email], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        if (emailCheck.count > 0) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        // Generate API key and hash password
        const apiKey = crypto.randomBytes(16).toString('hex');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const insertQuery = 'INSERT INTO 3430_users (username, email, password, api_key, api_date) VALUES (?, ?, ?, ?, NOW())';
        await new Promise((resolve, reject) => {
            db.query(insertQuery, [username, email, hashedPassword, apiKey], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        // Send success response
        res.status(201).json({ message: "User registered successfully." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to register user." });
    }
});

// protecting route (authenticate session)
app.get('/api/auth/session', (req, res) => {
    if (req.session.userId) {
        res.json({ 
            user: req.session.userId,
            api_key: req.session.api_key
        });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
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

    // Send successful response
    res.status(200).json({
        message: "Login successful.",
        userId: req.session.userId,
        username: req.session.username,
        email: req.session.email,
        api_key: req.session.api_key,
        api_date: req.session.api_date
    });
    
});

// Authentification for next steps
app.get('/api/getApiKey', (req, res) => {
    if (!req.session.api_key) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json({ apiKey: req.session.api_key });
  });


// function
function authenticateApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'] || '';
    if (!apiKey) {
      return res.status(401).json({ message: 'API key is required.' });
    }

    // Replace 'your_valid_api_key' with the actual valid API key
    const validApiKey = req.session.api_key;
  
    // if (apiKey !== validApiKey) {
    //     return res.status(403).json({ error: 'Invalid API key' });
    // }
    
    next(); // API key is valid, proceed to the next middleware or route handler
}

////// TO WATCH LIST //////
// Route to get "To Watch List" entries
app.get('/towatchlist/entries', (req, res) => {
    const { title } = req.query;
    const userId = req.session.userId;
    
    let query = `SELECT tw.watchListId, tw.priority, tw.notes, tw.movieid, m.title, m.poster 
                 FROM 3430_towatchlist tw 
                 JOIN 3430_movies m ON tw.movieid = m.id 
                 WHERE tw.userId = ?`;
    let params = [userId];

    // Title search
    if (title && title.trim() !== '') {
        query += " AND m.title LIKE ?";
        params.push(`%${title}%`);
    }

    db.query(query, params, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
  
});
  
  // Route to add an entry to the "To Watch List"
app.post('/towatchlist/entries', authenticateApiKey, (req, res) => {
    const { movie_id, priority = '5', notes = '' } = req.body;
    const userId = req.user.userId;
  
    if (!movie_id) {
      return res.status(400).json({ message: 'Movie ID is required.' });
    }
  
    const query = `INSERT INTO toWatchList (userId, movieid, priority, notes) VALUES (?, ?, ?, ?)`;
    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});
  

/// COMPLETED WATCH LIST
// Route to get "Completed Watch List" entries
app.get('/completedwatchlist/entries', (req, res) => {
    const { title } = req.query;
    const userId = req.session.userId;
  
    let query = `SELECT cw.completedId, cw.rating, cw.notes, cw.date_initially_watched, cw.date_last_watched, cw.times_watched, cw.movieid, m.title, m.poster 
                 FROM 3430_completedwatchlist cw 
                 JOIN 3430_movies m ON cw.movieid = m.id 
                 WHERE cw.userId = ?`;
    let params = [userId];
  
    if (title) {
      query += ' AND m.title LIKE ?';
      params.push(`%${title}%`);
    }
  
    db.query(query, params, (error, results) => {
      if (error) return res.status(500).json({ message: 'Database error.' });
      res.status(200).json(results);
    });
  });


app.listen(PORT, () => {
    console.log('Server is running on port 5000 :)');
});
