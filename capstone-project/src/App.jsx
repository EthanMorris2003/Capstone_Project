import { useState } from 'react';

export function App() {
  const [activeSubBanner, setActiveSubBanner] = useState(null);

  const showSubBanner = (id) => setActiveSubBanner(id);
  const hideSubBanner = () => setActiveSubBanner(null);

  return (
    <div className='homePage'>
      <div className='header'>
        <div className="logo-container">
          <img
            className="logo"
            src="https://debtnext.com/wp-content/uploads/2018/06/DebtNext_logo.png"
            alt="DebtNext Software logo"
          />
        </div>
        <div className="header-divider"></div>
        <h1 className="header-title">DebtNext Home Dashboard</h1>
        <div className="header-icons">
          <img
            className="header-icon"
            src="images/logout.svg"
            alt="Logout Icon"
            style={{ color: 'aliceblue' }}
          />
        </div>
      </div>
      <div className='body'>
        <div className="container">
          <div className="banner">
            {[1, 2, 3].map((id) => (
              <div key={id}>
                <button
                  onMouseEnter={() => showSubBanner(id)}
                  onMouseLeave={hideSubBanner}
                >
                  {id}
                </button>
                {activeSubBanner === id && (
                  <div
                    className="sub-banner"
                    onMouseEnter={() => showSubBanner(id)}
                    onMouseLeave={hideSubBanner}
                  >
                    <p>Subsection {id}</p>
                    <button>Option {id} A</button>
                    <button>Option {id} B</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="content">
            <p>Welcome to the homepage content area.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
