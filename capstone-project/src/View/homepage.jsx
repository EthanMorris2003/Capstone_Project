import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;