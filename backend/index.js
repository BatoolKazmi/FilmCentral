import express from "express";
import session from "express-session";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import crypto from "crypto";
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const PORT = 5000;

// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME

// })

const urlDB = `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

const db = mysql.createConnection(urlDB);

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database!');
});

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
    const { name } = req.query;  // Extract name from query params
    const userId = req.session.userId;  // Retrieve userId from session
    
    let query = `SELECT tw.watchListId, tw.priority, tw.notes, tw.movieid, m.title, m.poster 
                 FROM 3430_towatchlist tw 
                 JOIN 3430_movies m ON tw.movieid = m.id 
                 WHERE tw.userId = ?`;  // Base query
    let params = [userId];  // Add userId to the parameters list

    // If a title search is provided, add the condition
    if (name) {
        query += " AND m.title LIKE ?";  // Search for movie titles similar to the provided name
        params.push(`%${name}%`);  // Use wildcards for partial matches
    }

    // Order the results by priority in descending order
    query += ` ORDER BY tw.priority DESC`;

    // Execute the query
    db.query(query, params, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });  // Error handling
        res.json(result);  // Return the results as JSON
    });
});

// Route to get specific "To Watch List" entries for a user and movie
app.get('/towatchlist/check', (req, res) => {
    const { movieid } = req.query;  // Extract 'movieid' from query parameters
    const userId = req.session.userId;  // Get userId from session

    // Validate that both userId and movieId are present
    if (!userId || !movieid) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Query to check if the movie is in the user's watch list
    let query = `SELECT * FROM 3430_towatchlist WHERE userId = ? AND movieid = ?`;
    let params = [userId, movieid];

    // Execute the query
    db.query(query, params, (error, results) => {
        if (error) {
            console.error("Database error: ", error);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(200).json(results);  // Return results
    });
});


// Route to add an entry to the "To Watch List"
app.post('/towatchlist/entries', (req, res) => {
    const { movieId, priority, notes } = req.body;
    const userId = req.session.userId;
    console.log("adding to watchlist")
    console.log(userId)

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
  
// deleted - to watch list
app.delete('/towatchlist/entries/:id', (req, res) => {
    const watchlistId = req.params.id;
    const apiKey = req.headers['x-api-key'];
    const movieId = req.body.movie_id;

    if (!apiKey) {
        return res.status(401).json({ message: 'API key is required.' });
    }

    const queryUser = 'SELECT userId FROM 3430_users WHERE api_key = ?';
    db.query(queryUser, [apiKey], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!result.length) return res.status(404).json({ message: 'User not found.' });

        const userId = result[0].userId;

        const queryDelete = 'DELETE FROM 3430_towatchlist WHERE watchListId = ? AND userId = ? AND movieId = ?';
        db.query(queryDelete, [watchlistId, userId, movieId], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows > 0) {
                return res.status(200).json({ message: 'Movie removed from to-watch list.' });
            } else {
                return res.status(404).json({ message: 'Entry not found.' });
            }
        });
    });
});

/// COMPLETED WATCH LIST
// Route to get "Completed Watch List" entries
app.get('/completedwatchlist/entries', (req, res) => {
    const { name } = req.query;  // Extract 'name' from query parameters
    const userId = req.session.userId;  // Get userId from session

    // Base query to get completed watchlist for the user
    let query = `SELECT cw.completedId, cw.rating, cw.notes, cw.date_initially_watched, cw.date_last_watched, 
                        cw.times_watched, cw.movieid, m.title, m.poster 
                 FROM 3430_completedwatchlist cw 
                 JOIN 3430_movies m ON cw.movieid = m.id 
                 WHERE cw.userId = ?`;
    
    let params = [userId];  // Params array to pass into query

    // If a 'name' is provided, append a search condition for movie titles
    if (name) {
        query += ' AND m.title LIKE ?';
        params.push(`%${name}%`);  // Add wildcard search
    }

    // Order the results by rating in descending order
    query += ` ORDER BY cw.rating DESC`;

    // Execute the query with the provided parameters
    db.query(query, params, (error, results) => {
        if (error) {
            console.error("Database error: ", error);  // Log error for debugging
            return res.status(500).json({ message: 'Database error.' });  // Return error response
        }
        res.status(200).json(results);  // Return results in a 200 OK response
    });
});

  // Route to add an entry to the "To Watch List"
app.post('/completedwatchlist/entries', (req, res) => {
    const { movie_id, rating, notes, date_initially_watched, date_last_watched, times_watched, towatchlistId, apiKey } = req.body;
    const api_key = req.header["x-api-key"];

    const rate = parseInt(rating)

    console.log(api_key)
    console.log("Starting to add entry to completed watch list...");
    console.log("Request body:", req.body);

    if (!towatchlistId) {
        return res.status(400).json({ error: 'towatchlistId is required' });
    }

    const userQuery = `SELECT userId FROM 3430_users WHERE api_key = ?`;

    db.query(userQuery, [apiKey], (err, result) => {
        if (err) {
            console.error('Database error during user query:', err.message);
            return res.status(500).json({ error: 'Database error' });
        }
        
        console.log("Database query result:", result);

        // Check if a result was returned
        if (result.length === 0) {
            console.log('No user found for the given watchListId:', towatchlistId);
            return res.status(404).json({ error: 'No user found for the given watchListId' });
        }

        // Extract userId from the result
        const userId = result[0].userId;
        console.log("Extracted userId:", userId);

        // Validate required input data
        if (!userId || !movie_id) {
            console.log('Missing required fields: userId or movie_id');
            return res.status(400).json({ error: 'Missing required fields: userId or movie_id' });
        }

        const query = `
            INSERT INTO 3430_completedwatchlist 
            (userId, movieId, rating, notes, date_initially_watched, date_last_watched, times_watched) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const params = [userId, movie_id, rate, notes, date_initially_watched, date_last_watched, times_watched];

        db.query(query, params, (err, result) => {
            if (err) {
                console.error('Database error during insert:', err.message);
                return res.status(500).json({ error: 'Database error' });
            }

            // Update movie's vote average and vote count
            const selectMovieQuery = `SELECT vote_average, vote_count FROM 3430_movies WHERE id = ?`;
            db.query(selectMovieQuery, [movie_id], (err, movieResult) => {
                if (err) {
                    console.error('Database error during movie selection:', err.message);
                    return res.status(500).json({ error: 'Database error' });
                }

                if (movieResult.length === 0) {
                    return res.status(404).json({ error: 'Movie not found' });
                }

                const oldRating = movieResult[0].vote_average;
                const oldCount = movieResult[0].vote_count;
                const newCount = oldCount + 1;


                const a = oldRating * oldCount;
                const b = a + rate;

                const newVoteAverage = (b / newCount);

                // Update vote average and count in the movies table
                const updateMovieQuery = `UPDATE 3430_movies SET vote_average = ?, vote_count = ? WHERE id = ?`;
                db.query(updateMovieQuery, [newVoteAverage, newCount, movie_id], (err, updateResult) => {
                    if (err) {
                        console.error('Database error during movie update:', err.message);
                        return res.status(500).json({ error: 'Failed to update movie ratings' });
                    }

                    console.log('Movie added to completed watch list successfully');
                    res.status(201).json({ message: 'Movie added to completed watch list successfully' });
                });
            });
        });
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

app.delete('/completedwatchlist/entries/:id', (req, res) => {
    const completedListId = req.params.id;
    const apiKey = req.body.key;
    const movieId = req.body.movie_id;

    if (!apiKey) {
        return res.status(401).json({ message: 'API key is required.' });
    }

    // Step 1: Find the user using the API key
    const queryUser = 'SELECT userId FROM 3430_users WHERE api_key = ?';
    db.query(queryUser, [apiKey], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!result.length) return res.status(404).json({ message: 'User not found.' });

        const userId = result[0].userId;

        // Step 2: Retrieve the user's rating for the movie
        const querySelect = 'SELECT rating FROM 3430_completedwatchlist WHERE completedId = ? AND userId = ? AND movieid = ?';
        db.query(querySelect, [completedListId, userId, movieId], (err, entryResult) => {
            if (err) return res.status(500).json({ error: err.message });

            if (!entryResult.length) {
                return res.status(404).json({ message: 'Entry not found in the completed watchlist.' });
            }

            const userRating = entryResult[0].rating;

            // Step 3: Delete the entry from the completed watchlist
            const queryDelete = 'DELETE FROM 3430_completedwatchlist WHERE completedId = ? AND userId = ? AND movieid = ?';
            db.query(queryDelete, [completedListId, userId, movieId], (err, deleteResult) => {
                if (err) return res.status(500).json({ error: err.message });

                if (deleteResult.affectedRows === 0) {
                    return res.status(404).json({ message: 'Entry not found.' });
                }

                // Step 4: Retrieve the current movie's vote_average and vote_count
                const queryMovie = 'SELECT vote_average, vote_count FROM 3430_movies WHERE id = ?';
                db.query(queryMovie, [movieId], (err, movieResult) => {
                    if (err) return res.status(500).json({ error: err.message });
                    if (!movieResult.length) return res.status(404).json({ message: 'Movie not found.' });

                    const oldVoteAverage = movieResult[0].vote_average;
                    const oldVoteCount = movieResult[0].vote_count;

                    // Step 5: Adjust the vote_count and vote_average
                    const newVoteCount = oldVoteCount - 1;

                    let newVoteAverage;
                    if (newVoteCount > 0) {
                        newVoteAverage = (((oldVoteAverage * oldVoteCount) - userRating) / newVoteCount);
                    } else {
                        // If the vote count is 0, reset the average to 0 or handle appropriately
                        newVoteAverage = 0;
                    }

                    // Step 6: Update the movie's vote_average and vote_count
                    const queryUpdateMovie = 'UPDATE 3430_movies SET vote_average = ?, vote_count = ? WHERE id = ?';
                    db.query(queryUpdateMovie, [newVoteAverage, newVoteCount, movieId], (err, updateResult) => {
                        if (err) return res.status(500).json({ error: err.message });

                        return res.status(200).json({ message: 'Movie removed from completed watchlist and rating reset.' });
                    });
                });
            });
        });
    });
});

// GET completed movie entry by ID and key
app.get('/completedwatchlist/entries/:id/:key', (req, res) => {
    const completedId = req.params.id;
    const apiKey = req.params.key;

    const IdQuery = `SELECT userId FROM 3430_users WHERE api_key = ?`;
    db.query(IdQuery, [apiKey], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const userId = result[0].userId;

        const query = `
            SELECT 3430_completedwatchlist.*, 3430_movies.title, 3430_movies.poster
            FROM 3430_completedwatchlist
            JOIN 3430_movies ON 3430_completedwatchlist.movieId = 3430_movies.id
            WHERE 3430_completedwatchlist.userId = ? AND 3430_completedwatchlist.completedId = ?`;

        db.query(query, [userId, completedId], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.length === 0) {
                return res.status(404).json({ message: 'Movie not found in the completed watchlist.' });
            }
            res.status(200).json(result[0]);
        });
    });
});

// PATCH handler for updating times_watched
app.patch('/completedwatchlist/entries/:id/times-watched', (req, res) => {
    const movieId = req.params.id;
    const apiKey = req.body.key;

    const IdQuery = `SELECT userId FROM 3430_users WHERE api_key = ?`;
    db.query(IdQuery, [apiKey], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const userId = result[0].userId;

        const query = `UPDATE 3430_completedwatchlist SET times_watched = times_watched + 1 
                       WHERE completedId = ? AND userId = ?`;
        db.query(query, [movieId, userId], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'Times watched updated successfully.' });
            } else {
                res.status(404).json({ message: 'Movie entry not found or unauthorized.' });
            }
        });
    });
});

// PATCH handler for decrementing times_watched
app.patch('/completedwatchlist/entries/:id/times-watched/decrease', (req, res) => {
    const movieId = req.params.id;
    const apiKey = req.body.key;

    const IdQuery = `SELECT userId FROM 3430_users WHERE api_key = ?`;
    db.query(IdQuery, [apiKey], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const userId = result[0].userId;

        // Decrement times_watched, ensuring it doesn't go below 0
        const query = `UPDATE 3430_completedwatchlist 
                       SET times_watched = GREATEST(times_watched - 1, 1) 
                       WHERE completedId = ? AND userId = ?`;
        db.query(query, [movieId, userId], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'Times watched updated successfully.' });
            } else {
                res.status(404).json({ message: 'Movie entry not found or unauthorized.' });
            }
        });
    });
});

// PATCH handler for updating movie rating
app.patch('/completedwatchlist/entries/:id/rating', (req, res) => {
    const movieId = req.params.id;
    const newRating = req.body.rating;
    const apiKey = req.body.key;

    if (!newRating || isNaN(newRating)) {
        return res.status(400).json({ message: 'Valid rating is required.' });
    }

    const rate = parseInt(newRating)

    const userQuery = `SELECT userId FROM 3430_users WHERE api_key = ?`;
    db.query(userQuery, [apiKey], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const userId = result[0].userId;

        // Get the old rating for this entry
        const selectEntryQuery = `SELECT movieid, rating FROM 3430_completedwatchlist WHERE completedId = ? AND userId = ?`;
        db.query(selectEntryQuery, [movieId, userId], (err, entryResult) => {
            if (err) return res.status(500).json({ error: err.message });

            if (entryResult.length === 0) {
                return res.status(404).json({ message: 'Completed watchlist entry not found.' });
            }

            const movie_id = entryResult[0].movieid;
            const oldRating = entryResult[0].rating;

            // Update the rating in the completedwatchlist
            const updateEntryQuery = `UPDATE 3430_completedwatchlist SET rating = ? WHERE completedId = ? AND userId = ?`;
            db.query(updateEntryQuery, [rate, movieId, userId], (err, updateEntryResult) => {
                if (err) return res.status(500).json({ error: err.message });

                // Update the movie's vote average and vote count
                const selectMovieQuery = `SELECT vote_average, vote_count FROM 3430_movies WHERE id = ?`;
                db.query(selectMovieQuery, [movie_id], (err, movieResult) => {
                    if (err) return res.status(500).json({ error: err.message });

                    const oldMovieRating = movieResult[0].vote_average;
                    const voteCount = movieResult[0].vote_count;

                    // Recalculate the vote average by replacing the old rating with the new one
                    const newVoteAverage = (((oldMovieRating * voteCount) - oldRating + rate) / voteCount);

                    const updateMovieQuery = `UPDATE 3430_movies SET vote_average = ? WHERE id = ?`;
                    db.query(updateMovieQuery, [newVoteAverage, movie_id], (err, updateMovieResult) => {
                        if (err) return res.status(500).json({ error: err.message });

                        res.status(200).json({ message: 'Rating updated successfully' });
                    });
                });
            });
        });
    });
});


// PATCH handler for updating movie notes
app.patch('/completedwatchlist/entries/:id/notes', (req, res) => {
    const movieId = req.params.id;
    const newNote = req.body.notes;
    const apiKey = req.body.key;

    if (!newNote) {
        return res.status(400).json({ message: 'New note required.' });
    }

    const IdQuery = `SELECT userId FROM 3430_users WHERE api_key = ?`;
    db.query(IdQuery, [apiKey], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const userId = result[0].userId;

        const query = `UPDATE 3430_completedwatchlist SET notes = ? 
                       WHERE completedId = ? AND userId = ?`;
        db.query(query, [newNote, movieId, userId], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'Notes updated successfully.' });
            } else {
                res.status(404).json({ message: 'Movie entry not found or unauthorized.' });
            }
        });
    });
});

// Route to get specific "Completed Watch List" entries for a user and movie
app.get('/completedwatchlist/check', (req, res) => {
    const { movieid } = req.query;  // Extract 'movieid' from query parameters
    const userId = req.session.userId;  // Get userId from session

    // Validate that both userId and movieId are present
    if (!userId || !movieid) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Query to check if the movie is in the user's completed watch list
    let query = `SELECT * FROM 3430_completedwatchlist WHERE userId = ? AND movieid = ?`;
    let params = [userId, movieid];

    // Execute the query
    db.query(query, params, (error, results) => {
        if (error) {
            console.error("Database error: ", error);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(200).json(results);  // Return results
    });
}); 

app.listen(PORT, () => {
    console.log('Server is running on port 5000 :)');
});
