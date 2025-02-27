import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import notes from 'capstone-project/src/Assets/notes.svg';
import calendar from 'capstone-project/src/Assets/calender.svg';
import customer from 'capstone-project/src/Assets/customer.svg';
import bell from 'capstone-project/src/Assets/bell.svg';
import placeholder from 'capstone-project/src/Assets/placeholder.svg';
import placeholder2 from 'capstone-project/src/Assets/placeholder2.svg';
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
        navigate('/dashboard/home');
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

  return (
    <div className='homePage'>
      <div className='header'>
        <div className="header-divider"></div>
        <h1 className="header-title">DebtNext Home Dashboard</h1>

        <div className="header-icons">
          <button className="logout-button">
            <img src={logout} alt="Logout Icon" className="logout-icon" />
          </button>
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