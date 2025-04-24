import notes from 'capstone-project/src/Assets/notes.svg';
import calendar from 'capstone-project/src/Assets/calender.svg';
import customer from 'capstone-project/src/Assets/customer.svg';
import bell from 'capstone-project/src/Assets/bell.svg';
import placeholder from 'capstone-project/src/Assets/placeholder.svg';
import placeholder2 from 'capstone-project/src/Assets/placeholder2.svg';
import logout from 'capstone-project/src/Assets/logout.svg';

// Default page for dashboard
export function DashboardHome() {
  return (
    <div className="content">
      <div className="image-container">
        {[{ icon: notes, text: "Manage your notes efficiently." },
        { icon: calendar, text: "Keep track of your schedule." },
        { icon: customer, text: "Manage your customer interactions." },].map((item, index) => (
          <div className="icon-box" key={index}>
            <img src={item.icon} alt="Icon" className="svg-icon" />
            <p>{item.text}</p>
            <button className="goToButton">Go To</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardHome;