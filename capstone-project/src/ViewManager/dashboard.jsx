import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import logout from 'capstone-project/src/Assets/logout.svg';

export function Dashboard() {
  const [activeSubBanner, setActiveSubBanner] = useState(null);

  const navigate = useNavigate();

  const bannerTexts = {
    1: "Dashboard",
    2: "Notes",
    3: "Calendar"
  };

  const handleClick = (id) => {
    switch (id) {
      case 1:
        navigate('/dashboard');
        break;
      case 2:
        navigate('/dashboard/notes');
        break;
      case 3:
        navigate('/dashboard/calendar');
        break;
    }
    setActiveSubBanner(id);
  };

  const token = localStorage.getItem('authToken');
  let userInfo;
  if (token) {
    userInfo = jwtDecode(token);
  }

  return (
    <div className='homePage'>
      <div className='header'>
        <div className="header-divider"></div>
        <h1 className="header-title">DebtNext Home Dashboard</h1>

        <div className="header-icons">
          <Link to="/login">
            {(token && userInfo)?
              (<p className='username'>{userInfo.username}</p>) :
              (<button className="logout-button">
                  <img src={logout} alt="Logout Icon" className="logout-icon" />
                </button>)}
          </Link>
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
    </div>
  );
}

export default Dashboard;