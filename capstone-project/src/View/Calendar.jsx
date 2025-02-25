import { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../Style/calendar.css'; // Ensure this import is present
import logout from 'capstone-project/src/Assets/logout.svg';

const localizer = momentLocalizer(moment);

export function Calendar() {
  const [events, setEvents] = useState([]);

  // Handle adding new events when a user clicks on the calendar
  const handleSelectSlot = ({ start, end }) => {
    const title = prompt('Enter Event Title:');
    if (title) {
      setEvents([...events, { title, start, end }]);
    }
  };

  // Handle deleting an event when clicked
  const handleSelectEvent = (eventToDelete) => {
    const confirmDelete = window.confirm(`Delete event: "${eventToDelete.title}"?`);
    if (confirmDelete) {
      setEvents((prevEvents) =>
        prevEvents.filter(
          (event) =>
            event.title !== eventToDelete.title ||
            event.start.getTime() !== eventToDelete.start.getTime() ||
            event.end.getTime() !== eventToDelete.end.getTime()
        )
      );
    }
  };

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
            <div className="calendar-wrapper">
              <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable
                onSelectSlot={handleSelectSlot} // Enables clicking to add events
                onSelectEvent={handleSelectEvent} // Enables deleting events
                defaultView={Views.WEEK} // Set default view to WEEK
                style={{ height: '100%', width: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
