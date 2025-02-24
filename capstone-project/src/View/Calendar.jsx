import logout from 'capstone-project/src/Assets/logout.svg';

export function Calendar() {
  return (
    <div className='homePage'>
      <div className='header'>
        <h1 className="header-title">DebtNext</h1>
        <div className="header-icons">
          <button className="logout-button">
            <img src={logout} alt="Logout Icon" className="logout-icon" />
          </button>
        </div>
      </div>

      <div className='body'>
        <div className="container">
          <div className="banner">
            <button>Dashboard</button>
            <button>Notes</button>
            <button className="active">Calendar</button>
          </div>

          <div className="content">
            <div className="calendar-container">
              {/* Your calendar application content will go here */}
              <p>Start managing your calendar here!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;