import { Link } from "react-router-dom";

function Login() {
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
            />
          </form>
          <div className="logText">Password</div>
          <form>
            <input
              type="password"
              placeholder="Password"
              className="inputBoxPass"
            />
          </form>
          <button className="inputButton">
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