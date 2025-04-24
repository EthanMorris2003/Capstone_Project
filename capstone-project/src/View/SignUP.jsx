import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { signupViewModel } from '../ViewModel/signupViewModel';

function Signup() {
  const {
    username,
    password,
    confirmPassword,
    firstName,
    lastName,
    email,
    setUsername,
    setPassword,
    setConfirmPassword,
    setFirstName,
    setLastName,
    setEmail,
    handleSignUp
  } = signupViewModel();
  
  return (
    <div className="backgroundContainer">
      <div className="signupContainer">
        <div>
          <h1 className="logoTextLog">Create Account</h1>
        </div>

        {/* Username field */}
        <div className="inputGroup">
          <div className="logText">Username</div>
          <form>
            <input
              placeholder="Username"
              className={username ? "inputBoxFilled" : "inputBox"} 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </form>

          {/* Password field */}
          <div className="logText">Password</div>
          <form>
            <input
              type='password'
              placeholder="Password"
              className={password ? "inputBoxFilled" : "inputBox"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </form>

          {/* Confirm Password field */}
          <div className="logText">Confirm Password</div>
          <form>
            <input
              type='password'
              placeholder="Confirm Password"
              className={confirmPassword ? "inputBoxFilled" : "inputBox"} 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </form>

          {/* FirstName field */}
          <div className="logText">First Name</div>
          <form>
            <input
              placeholder="First Name"
              className={firstName ? "inputBoxFilled" : "inputBox"} 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </form>

          {/* LastName field */}
          <div className="logText">Last Name</div>
          <form>
            <input
              placeholder="Last Name"
              className={lastName ? "inputBoxFilled" : "inputBox"} 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </form>

          {/* Email field */}
          <div className="logText">Email</div>
          <form>
            <input
              type='email'
              placeholder="Email"
              className={email ? "inputBoxFilled" : "inputBox"} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </form>

          {/* Buttons */}
          <button className="createAccountButtonSignUp" onClick={handleSignUp}>Sign Up</button>
          <Link to="/login">
            <button className="backToLoginButtonSignUp">
              Back to Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
