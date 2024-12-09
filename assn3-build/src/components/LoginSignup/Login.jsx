import React from 'react'
import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/LoginSignup.css"
import { useNavigate } from "react-router-dom";
import axios from 'axios';
// import { useUser } from '../UserContext';

function Login() {

  // const { login } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  // Validate function to check for empty fields
  const validateInputs = () => {
    const validationErrors = {};
    if (!username) validationErrors.username = 'Username is required';
    if (!password) validationErrors.password = 'Password is required';
    return validationErrors;
  };
  


  // HANDLE SUBMISSION
  const handleSubmit = async (ev) => {
    ev.preventDefault();

    setErrors({
      username: '',
      password: '',
      server: ''
    })
    // // Clear previous server errors
    // setErrors(prev => ({ ...prev, server: '' }));

    // Validate frontend inputs first
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post('https://film-central-end.vercel.app/login', { 
          username, 
          password 
      }, { withCredentials: true });

      if (response.status === 200) {
          // Redirect or update state based on successful login
          alert("Login successful!");
          navigate('/'); // Navigate to the home page
      } 
  } catch (error) {
    if (error.response) {
      // Handle errors returned by the server
      const serverErrorMessage = error.response.data.message || "Login failed!";
      setErrors(prev => ({ ...prev, server: serverErrorMessage }));
    } else {
      // Handle any other errors (like network errors)
      setErrors(prev => ({ ...prev, server: "An error occurred. Please try again." }));
    }
  }

  }

  return (
    <>
      <main>
        <div id="center-container" className='center-container'>
          <h2>Login</h2>
          <form action="" onSubmit={handleSubmit}>
            <div className="form-item col">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                size="25"
                value={username}
                onChange={(e) => setUsername(e.target.value)} // Handling input change
              />
              <span className={`error ${!errors.username ? 'hidden' : ''}`}>
                {errors.username}
              </span>
            </div>
            <div className="form-item col">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                size="25"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className={`error ${!errors.password ? 'hidden' : ''}`}>
                {errors.password}
              </span>
            </div>

            {/* Server-side error */}
            {errors.server && (
              <div className="form-item col">
                <span className="error">{errors.server}</span>
              </div>
            )}

            {/* <div className="form-item row">
              <label htmlFor="remember">Remember Me:</label>
              <input type="checkbox" name="remember" value="remember" />
            </div> */}

            <div>
              <button type="submit" id="submit" name="submit" className="centered">Login</button>
            </div>

            <Link to="/signup">Create a New Account</Link>
          </form>
        </div>
      </main>
    </>
  );
}

export default Login