function Login() {
    return (
      <>
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
            <button className="createAccountButton">
              Create an Account
            </button>
          </div>
        </div>
      </>
    );
  }
  
  export default Login;