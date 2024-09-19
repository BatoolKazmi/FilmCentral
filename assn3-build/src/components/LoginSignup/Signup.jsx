import React from 'react'
import { useState} from "react";
import { Link } from "react-router-dom";
import "../../styles/LoginSignup.css";
import SignupValidation from './SignupValidation';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Signup() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // HANDLE SUBMISSION
  const handleSubmit = async (ev) => {
    ev.preventDefault();

    // Frontend validation (optional)
    const validationErrors = SignupValidation(username, email, password, password2);
    setErrors(validationErrors); // Set validation errors

    if (Object.keys(validationErrors).length === 0) { // Proceed only if no frontend validation errors
      const API = "http://localhost:5000/signup";  // Your backend API endpoint
      try {
        const response = await axios.post(API, {
          username,
          password,
          password2,
          email
        });

        // Backend validation errors (received in response)
        if (response.status === 201) {
          alert("YOU SIGNED UP!!");
          navigate('/login');
        }
      } catch (err) {
        if (err.response && err.response.data) {
          // Handle errors from the backend
          setErrors({ server: err.response.data.message });
        } else {
          console.error('There was an unexpected error!', err);
          setErrors({ server: 'An unexpected error occurred. Please try again later.' });
        }
      }
    }
  };

  return (
    <>
      <main>
        <div id="center-container" className='center-container'>
          <h2>Create Account</h2>
          <form id="create-account" onSubmit={handleSubmit}>
            {/* Username Input */}
            <div className="form-item col">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                size="25"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <span className={`error ${!errors.username ? 'hidden' : ''}`}>
                {errors.username}
              </span>
            </div>
            
            {/* Email Input */}
            <div className="form-item col">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                size="25"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className={`error ${!errors.email ? 'hidden' : ''}`}>
                {errors.email}
              </span>
            </div>
            
            {/* Password Input */}
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
              <span className={`error ${!errors.p_strength ? 'hidden' : ''}`}>
                {errors.p_strength}
              </span>
            </div>
            
            {/* Verify Password Input */}
            <div className="form-item col">
              <label htmlFor="password2">Verify Password</label>
              <input
                type="password"
                id="password2"
                name="password2"
                size="25"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
              <span className={`error ${!errors.p_match ? 'hidden' : ''}`}>
                {errors.p_match}
              </span>
            </div>
            
            {/* Backend Error Message */}
            {errors.server && (
              <div className="error-message">
                {errors.server}
              </div>
            )}
            <div>
              <button id="submit" name="submit" className='centered'>Create Account</button>
            </div>
            <Link to="/login">Sign In</Link>
          </form>
        </div>
      </main>
    </>
  )
}
