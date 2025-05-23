import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Home page. Automatically redirect you when you render the page.
function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        navigate("/dashboard");
      } catch (error) {
        console.error("Invalid token", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
}

export default Home;
