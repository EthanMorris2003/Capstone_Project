function SignUP() {
  return (
    <div className="backgroundContainer">
      <div className="signupContainer">
        <div>
          <h1 className="logoTextLog">Create Account</h1>
        </div>
        <div className="inputGroup">
          <div className="logText">Username</div>
          <form>
            <input placeholder="Username" className="inputBoxUser" />
          </form>
          <div className="logText">Email</div>
          <form>
            <input type="email" placeholder="Email" className="inputBoxUser" />
          </form>
          <div className="logText">Password</div>
          <form>
            <input type="password" placeholder="Password" className="inputBoxPass" />
          </form>
          <div className="logText">Confirm Password</div>
          <form>
            <input type="password" placeholder="Confirm Password" className="inputBoxPass" />
          </form>
          <button className="createAccountButton">Sign Up</button>
          <button className="backToLoginButton">Back to Login</button>
        </div>
      </div>
    </div>
  );
}

export default SignUP;
