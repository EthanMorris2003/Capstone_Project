import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import logout from 'capstone-project/src/Assets/logout.svg';
import Chatbox from '../View/chatbox';

export function Dashboard() {
  const [activeSubBanner, setActiveSubBanner] = useState(1);

  const navigate = useNavigate();

  const bannerTexts = {
    1: "Dashboard",
    2: "Notes",
    3: "Calendar"
  };

  const token = localStorage.getItem('authToken');
  let userInfo;
  if (token) {
    try {
      userInfo = jwtDecode(token);
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }

  const handleClick = (id) => {
    const isAuthenticated = localStorage.getItem('authToken');
    
    switch (id) {
      case 1:
        navigate('/dashboard');
        setActiveSubBanner(id);
        break;
      case 2:
        if (isAuthenticated) {
          navigate('/dashboard/notes');
          setActiveSubBanner(id);
        } else {
          alert("Please log in to access this feature.");
        }
        break;
      case 3:
        if (isAuthenticated) {
          navigate('/dashboard/calendar');
          setActiveSubBanner(id);
        } else {
          alert("Please log in to access this feature.");
        }
        break;
      default:
        break;
    }

  };

  return (
    <div className='homePage'>
      <div className='header'>
        <div className="header-divider"></div>
        <h1 className="header-title">DebtNext Home Dashboard</h1>

        <div className="header-icons">
            {(token && userInfo)?
              (<a className='username' onClick={() => {
                  localStorage.removeItem('authToken')
                  navigate('/login');
                }}>
                {userInfo.username}
              </a>) :
            (<Link to="/login">
              <button className="logout-button">
                <img src={logout} alt="Logout Icon" className="logout-icon" />
              </button>
            </Link>)}
        </div>
      </div>

      <div className='body'>
        <div className="container">
          <div className="banner">
            {Object.keys(bannerTexts).map((id) => (
              <div key={id} className="banner-item">
                <button
                  onClick={() => handleClick(parseInt(id))}
                  className={activeSubBanner === parseInt(id) ? "active" : ""}
                >
                  {bannerTexts[id]}
                </button>
              </div>
            ))}
          </div>

          <Outlet />
        </div>
      </div>
      <Chatbox />
    </div>
  );
}

export default Dashboard;