import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  
  const handleSignUp = async () => {
    if (username == '' || password == ''){
      alert("All fields need to be filled");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/signup', {
        username,
        password
      });
      alert(response.data);
      navigate("/login");
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
              className={username ? "inputBoxFilled" : "inputBox"} 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </form>
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
