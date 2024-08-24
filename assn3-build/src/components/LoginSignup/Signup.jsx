import React from 'react'
import { useState} from "react";
import { Link } from "react-router-dom";
import NavBar from '../NavBar';
import "../../styles/LoginSignup.css";
import SignupValidation from './SignupValidation';

export default function Signup() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [errors, setErrors] = useState({});

    // HANDLE SUBMISSION
    const handleSubmit = (ev) => {
    ev.preventDefault();
    const validationErrors = SignupValidation(username, email, password, password2)
    setErrors(validationErrors); // Clear errors
    }

  return (
    <><NavBar/>
        <main>
        <div id="center-container">
          <h2>Create Account</h2>
          <form id="create-account" action="" onSubmit={handleSubmit}>
            <div className="form-item col">
              <label htmlFor="username">Username:</label>
              {/* Handling input change to update state */}
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
            <div className="form-item col">
              <label htmlFor="email">Email:</label>
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
              <span className={`error ${!errors.p_strength ? 'hidden' : ''}`}>
                {errors.p_strength}
              </span>
            </div>
            <div className="form-item col">
              <label htmlFor="password2">Verify Password:</label>
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
            {errors.general && (
                            <div className="error">
                                {errors.general}
                            </div>
                        )}
            <button id="submit" name="submit">Create Account</button>
            <Link to="/login">Sign In</Link>
          </form>
        </div>
      </main>
    </>
  )
}
