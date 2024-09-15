import bcrypt from 'bcrypt';
import { db } from './db.js'; // Change to .js if using ES modules

export const loginhandler = async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    // Query to check if user exists
    const query = 'SELECT userId, username, email, password, api_key, api_date FROM 3430_users WHERE username = ?';
    const [user] = await db.query(query, [username]);

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // Start session and store user information
    req.session.user_id = user.userId;
    req.session.username = user.username;
    req.session.email = user.email;

    // Send successful response
    res.status(200).json({
      message: "Login successful.",
      userId: user.userId,
      username: user.username,
      email: user.email,
      api_key: user.api_key,
      api_date: user.api_date
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
