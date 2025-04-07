import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { resetPassViewModel } from '../ViewModel/resetPassViewModel';

function resetPass() {
  const {
    username,
    firstName,
    lastName,
    email,
    setUsername,
    setFirstName,
    setLastName,
    setEmail,
    handleResetPass
  } = resetPassViewModel();
  
  return (
    <div className="backgroundContainer">
      <div className="signupContainer">
        <div>
          <h1 className="logoTextLog">Reset Password</h1>
        </div>
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
          <div className="logText">First Name</div>
          <form>
            <input
              placeholder="First Name"
              className={firstName ? "inputBoxFilled" : "inputBox"} 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </form>
          <div className="logText">Last Name</div>
          <form>
            <input
              placeholder="Last Name"
              className={lastName ? "inputBoxFilled" : "inputBox"} 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </form>
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
          <button className="createAccountButtonSignUp" onClick={handleResetPass}>
            Submit
          </button>
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

export default resetPass;
