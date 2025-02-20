import { useState } from 'react';
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
    3: "Tasks",
    4: "Customer Info",
    5: "Reports",
    6: "Actions",
    7: "Settings"
  };

  const handleClick = (id) => {
    console.log(`Clicked: ${bannerTexts[id]}`); // Debugging
    setActiveSubBanner(id);
  };

  return (
    <div className='homePage'>
      <div className='header'>
        <div className="header-divider"></div>
        <h1 className="header-title">DebtNext Home Dashboard</h1>
        
        {/* Add the logout button inside the header-icons div */}
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
              <div className="icon-box notes-box">
                <img src={notes} alt="Notes Icon" className="svg-icon" />
                <p>Manage your notes efficiently.</p>
              </div>
              <div className="icon-box calendar-box">
                <img src={calendar} alt="Calendar Icon" className="svg-icon" />
                <p>Keep track of your schedule.</p>
              </div>
              <div className="icon-box customer-box">
                <img src={customer} alt="Customer Icon" className="svg-icon" />
                <p>Manage your customer interactions.</p>
              </div>
              <div className="icon-box bell-box">
                <img src={bell} alt="Bell Icon" className="svg-icon" />
                <p>Placeholder.</p>
              </div>
              <div className="icon-box placeholder-box">
                <img src={placeholder} alt="Placeholder Icon" className="svg-icon" />
                <p>Placeholder</p>
              </div>
              <div className="icon-box placeholder2-box">
                <img src={placeholder2} alt="Placeholder2 Icon" className="svg-icon" />
                <p>Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;