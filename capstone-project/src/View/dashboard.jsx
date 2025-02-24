import { useState } from 'react';
import { Link } from 'react-router-dom';
import notes from 'capstone-project/src/Assets/notes.svg';
import calendar from 'capstone-project/src/Assets/calender.svg';
import customer from 'capstone-project/src/Assets/customer.svg';
import bell from 'capstone-project/src/Assets/bell.svg';
import placeholder from 'capstone-project/src/Assets/placeholder.svg';
import placeholder2 from 'capstone-project/src/Assets/placeholder2.svg';
import logout from 'capstone-project/src/Assets/logout.svg';

export function Dashboard() {
  const [activeSubBanner, setActiveSubBanner] = useState(null);

  const bannerTexts = {
    1: "Notes",
    2: "Calendar",
    3: "Customer Info"
  };

  const handleClick = (id) => {
    console.log(`Clicked: ${bannerTexts[id]}`);
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
                  onClick={() => handleClick(id)}
                  className={activeSubBanner === id ? "active" : ""}
                >
                  {bannerTexts[id]}
                </button>
              </div>
            ))}
          </div>

          <div className="content">
            <div className="image-container">
              {[{icon: notes, text: "Manage your notes efficiently."},
                {icon: calendar, text: "Keep track of your schedule."},
                {icon: customer, text: "Manage your customer interactions."},
                {icon: bell, text: "Notifications"},
                {icon: placeholder, text: "Placeholder"},
                {icon: placeholder2, text: "Placeholder"}].map((item, index) => (
                <div className="icon-box" key={index}>
                  <img src={item.icon} alt="Icon" className="svg-icon" />
                  <p>{item.text}</p>
                  <button className="goToButton">Go To</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;