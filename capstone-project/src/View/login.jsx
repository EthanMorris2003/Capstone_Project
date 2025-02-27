import React, { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if(username == '' || password == ''){
      alert("All fields need to be filled");
      return;
    }

    try{
      const response = await axios.post('/api/login', {
        username,
        password
      });
      alert(response.data);
    } catch(error){
      console.error('Error loging in:', error);
      alert('Error Login in');
    }
  };

  return (
    <div>
      <div className="loginContainer">
        <div>
          <h1 className="logoTextLog">DebtNext Dashboard</h1>
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
          <button className="inputButton" onClick={handleLogin}>
            Log In
          </button>
          <Link to="/signup">
            <button className="createAccountButton">
              Create An Account
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;