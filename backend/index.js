import express from "express";
import session from "express-session";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";
import mysql from "mysql";
import bcrypt from "bcrypt";
import crypto from "crypto";

const app = express();
const PORT = 5000;

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

// CORS configuration, allowing credentials
app.use(cors({
    origin: 'http://localhost:5173', // React app URL
    credentials: true // Enable credentials to be sent across domains
}));

// Body parsing middleware
app.use(bodyParser.json());
app.use(express.json());

// // Logging middleware to see session data
// app.use((req, res, next) => {
//     console.log('Session:', req.session);
//     next();
// });


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
  
    if (apiKey !== validApiKey) {
        return res.status(403).json({ error: 'Invalid API key' });
    }
    
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
app.post('/towatchlist/entries', (req, res) => {
    const { movieId, priority, notes } = req.body;
    const userId = req.session.userId;

    // Validate input data
    if (!userId || !movieId || !priority) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Query to insert a new entry into the to-watch list
    const query = 'INSERT INTO 3430_towatchlist (userId, movieId, priority, notes) VALUES (?, ?, ?, ?)';
    const params = [userId, movieId, priority, notes];

    db.query(query, params, (err, result) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Database error' });
        }
        // Successfully added to the watch list
        res.status(201).json({ message: 'Movie added to watch list successfully' });
    });
});
  
app.get('/towatchlist/entries/:id/:key', (req, res) => {

    const IdQuery = `SELECT userId FROM 3430_users WHERE api_key = ?`;
    const api_key = req.params.key;
    db.query(IdQuery, [api_key], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        const userId = result[0].userId;
        
        const towatchlistId = req.params.id;

        const query = `SELECT 3430_towatchlist.watchListId, 3430_towatchlist.priority, 
                        3430_towatchlist.notes, 3430_towatchlist.movieid, 3430_movies.title, 3430_movies.poster
                        FROM 3430_towatchlist
                        JOIN 3430_movies ON 3430_towatchlist.movieid = 3430_movies.id
                        WHERE 3430_towatchlist.userId = ? AND 3430_towatchlist.watchListId = ?`;
        
        const params = [userId, towatchlistId];

        db.query(query, params, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(result);
        });

    });
    
    


});

///// Patch
// PATCH handler for updating priority in the to-watch list
app.patch('/towatchlist/entries/:id/priority', (req, res) => {
    const watchlistId = req.params.id;
    const newPriority = req.body.priority;
    const apiKey = req.body.key;

    console.log(`Received API key: ${apiKey}`);

    if (!newPriority) {
        return res.status(400).json({ message: 'New priority required.' });
    }
    
    if (!apiKey) {
        return res.status(401).json({ message: 'API key is required.' });
    }

    if (isNaN(newPriority)) {
        return res.status(400).json({ message: 'Priority must be a number.' });
    }

    try {
        const IdQuery = `SELECT 3430_users.userId FROM 3430_users WHERE 3430_users.api_key = ?`;
        db.query(IdQuery, [apiKey], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database query error.', details: err.message });
            }

            // Check if userId is found
            if (result.length === 0) {
                return res.status(404).json({ message: 'Invalid API key, user not found.' });
            }

            const userId = result[0].userId;
            console.log(`User ID: ${userId}`);

            const query = `UPDATE 3430_towatchlist SET 3430_towatchlist.priority = ? WHERE 3430_towatchlist.watchListId = ? AND 3430_towatchlist.userId = ?`;
            db.query(query, [newPriority, watchlistId, userId], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Database query error.', details: err.message });
                }

                if (result.affectedRows > 0) {
                    res.status(201).json({ message: 'Priority updated for the watchlist entry.' });
                } else {
                    res.status(404).json({ message: 'Watchlist entry not found or user is not authorized to modify this entry.' });
                }
            });
        });
       
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating priority.' });
    }
});

// PATCH handler for updating notes in the to-watch list
app.patch('/towatchlist/entries/:id/notes', (req, res) => {
    const watchlistId = req.params.id;
    const newNote = req.body.notes;
    const apiKey = req.body.key;

    console.log(`Received API key: ${apiKey}`);

    if (!newNote) {
        return res.status(400).json({ message: 'New note required.' });
    }
    
    if (!apiKey) {
        return res.status(401).json({ message: 'API key is required.' });
    }

    try {
        const IdQuery = `SELECT userId FROM 3430_users WHERE api_key = ?`;
        db.query(IdQuery, [apiKey], (err, result) => {
            
            if (err) return res.status(500).json({ error: err.message });
            const userId = result[0].userId;

            const query = `UPDATE 3430_towatchlist SET notes = ? WHERE watchListId = ? AND userId = ?`;
            db.query(query, [newNote, watchlistId, userId], (err, result) => {
                if (result.affectedRows > 0) {
                    res.status(201).json({ message: 'notes updated for the watchlist entry.' });
                } else {
                    res.status(501).json({ message: 'Failed to update notes for the watchlist entry.' });
                }
            });
            
        })
       
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating notes.' });
    }
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

  // Route to add an entry to the "To Watch List"
app.post('/completedwatchlist/entries', (req, res) => {
    const { movieId, rating, notes, times_watched } = req.body;
    const userId = req.session.userId;

    // Validate input data
    if (!userId || !movieId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
        INSERT INTO 3430_completedwatchlist 
        (userId, movieId, rating, notes, date_initially_watched, date_last_watched, times_watched) 
        VALUES (?, ?, ?, ?, CURDATE(), CURDATE(), ?)
    `;
    const params = [userId, movieId, rating, notes, times_watched];

    db.query(query, params, (err, result) => {
        if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Database error' });
        }

        res.status(201).json({ message: 'Movie added to watch list successfully' });
    });
});

app.get('/completedwatchlist/entries/:id', async (req, res) => {
    const apiKey = req.query.key || req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ message: "API key is required." });
    }

    try {
        const user = await authenticateApiKey(apiKey);
        if (!user) {
            return res.status(401).json({ message: "Invalid API key." });
        }

        const userId = user.userId;
        const completedWatchlistId = req.params.id;

        const query = `SELECT 3430_completedWatchList.completedId, 3430_completedWatchList.rating, 
                        3430_completedWatchList.notes, 3430_completedWatchList.date_initially_watched, 
                        3430_completedWatchList.date_last_watched, 3430_completedWatchList.times_watched, 
                        3430_completedWatchList.movieid, 3430_movies.title, 3430_movies.poster
                       FROM 3430_completedWatchList
                       JOIN 3430_movies ON 3430_completedWatchList.movieid = 3430_movies.id
                       WHERE 3430_completedWatchList.userId = ? AND 3430_completedWatchList.completedId = ?`;
        
        const [rows] = await db.execute(query, [userId, completedWatchlistId]);

        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: "No entry found for the provided ID." });
        }
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({ error: "Database error" });
    }
});
  


app.listen(PORT, () => {
    console.log('Server is running on port 5000 :)');
});
