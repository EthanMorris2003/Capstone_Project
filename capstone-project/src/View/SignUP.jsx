import React, { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      const response = await axios.post('/api/signup', {
        username,
        password
      });
      alert(response.data);
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Error signing up');
    }
  };
  
  return (
    <div className="backgroundContainer">
      <div className="signupContainer">
        <div>
          <h1 className="logoTextLog">Create Account</h1>
        </div>
        <div className="inputGroup">
          <div className="logText">Username</div>
          <form>
            <input
              placeholder="Username"
              className="inputBoxUser"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </form>
          <div className="logText">Email</div>
          <form>
            <input
              type="email"
              placeholder="Email"
              className="inputBoxUser"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </form>
          <div className="logText">Password</div>
          <form>
            <input
              type="password"
              placeholder="Password"
              className="inputBoxPass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </form>
          <div className="logText">Confirm Password</div>
          <form>
            <input
              type="password"
              placeholder="Confirm Password"
              className="inputBoxPass"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </form>
          <button className="createAccountButtonSignUp">Sign Up</button>
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
