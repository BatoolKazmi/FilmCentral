import React from 'react'
import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/LoginSignup.css"
import Validation from "./LoginValidation";
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
  


  // HANDLE SUBMISSION
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const validationErrors = Validation(username, password)
    setErrors(validationErrors); // Clear errors

    try {
      const response = await axios.post('http://localhost:5000/login', { 
          username, 
          password 
      }, { withCredentials: true });

      if (response.data.success) {
          // Redirect or update state based on successful login
          console.log('Login successful');
          alert("Login successful!");
          navigate('/'); // Navigate to the home page
      } else {
          setErrors('Invalid credentials');
      }
  } catch (error) {
      console.error('Error during login:', error);
      setErrors('Failed to authenticate');
  }

  }

  return (
    <>
      <main>
        <div id="center-container">
          <h2>Login</h2>
          <form action="" onSubmit={handleSubmit}>
            <div className="form-item col">
              <label htmlFor="username">Username:</label>
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
              <label htmlFor="password">Password:</label>
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

            {/* <div className="form-item row">
              <label htmlFor="remember">Remember Me:</label>
              <input type="checkbox" name="remember" value="remember" />
            </div> */}

            <button type="submit" id="submit" name="submit" className="centered">Login</button>

            <Link to="/signup">Create a New Account</Link>
          </form>
        </div>
      </main>
    </>
  );
}

export default Login