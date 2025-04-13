import React from 'react';
import { Link } from "react-router-dom";
import { loginViewModel } from '../ViewModel/loginViewModel';

function Login() {
  const {
    username,
    password,
    setUsername,
    setPassword,
    handleLogin
  } = loginViewModel();

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
              className="inputBox"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </form>
          <div className="logText">Password</div>
          <form>
            <input
              type="password"
              placeholder="Password"
              className="inputBox"
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
          <Link to="/resetPassword">
            <button className='resetPasswordButton'>
              Reset Password
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;