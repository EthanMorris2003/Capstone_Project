/* 
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
  );
}

export default Calendar;
*/

import { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../Style/calendar.css';
import logout from 'capstone-project/src/Assets/logout.svg';

const localizer = momentLocalizer(moment);
const colorOptions = ['#FF5733', '#3498DB', '#2ECC71', '#F1C40F']; // Orange, Blue, Green, Yellow

// Example staff list (Can be fetched from an API in a real app)
const staffList = ['John Doe', 'Jane Smith', 'Michael Brown', 'Emily Davis'];

export function Calendar() {
  const [events, setEvents] = useState([]);
  const [modalData, setModalData] = useState(null);

  // Open modal near click position
  const handleSelectSlot = ({ start, end, action, box }) => {
    if (action === 'select') {
      setModalData({
        start,
        end,
        title: '',
        assignedStaff: '',
        x: box?.clientX || 300, // Default X position
        y: box?.clientY || 200, // Default Y position
      });
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setModalData((prev) => ({ ...prev, title: e.target.value }));
  };

  // Handle staff selection
  const handleStaffSelect = (e) => {
    setModalData((prev) => ({ ...prev, assignedStaff: e.target.value }));
  };

  // Handle adding event after selecting color
  const handleColorSelect = (color) => {
    if (!modalData?.title.trim()) {
      alert('Please enter an event title!');
      return;
    }
    if (!modalData.assignedStaff) {
      alert('Please assign a staff member!');
      return;
    }

    setEvents([...events, { ...modalData, color }]);
    setModalData(null); // Close modal
  };

  return (
    <div className="content">
      <div className="calendar-wrapper">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={(slotInfo) => handleSelectSlot({ ...slotInfo, box: window.event })}
          defaultView={Views.WEEK}
          style={{ height: '100%', width: '100%' }}
          eventPropGetter={(event) => ({
            style: { backgroundColor: event.color, color: 'white' }
          })}
          components={{
            event: ({ event }) => (
              <div>
                <strong>{event.title}</strong> <br />
                <small>({event.assignedStaff})</small>
              </div>
            )
          }}
        />
      </div>

      {/* Event Modal */}
      {modalData && (
        <div
          className="event-modal"
          style={{
            position: 'absolute',
            top: `${modalData.y}px`,
            left: `${modalData.x}px`,
            background: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
            zIndex: 1000
          }}
        >
          {/* Event Title Input */}
          <input
            type="text"
            placeholder="Enter Event Title"
            value={modalData.title}
            onChange={handleInputChange}
            style={{ width: '100%', marginBottom: '10px' }}
          />

          {/* Staff Dropdown */}
          <select
            value={modalData.assignedStaff}
            onChange={handleStaffSelect}
            style={{ width: '100%', marginBottom: '10px' }}
          >
            <option value="">Assign Staff</option>
            {staffList.map((staff) => (
              <option key={staff} value={staff}>
                {staff}
              </option>
            ))}
          </select>

          {/* Color Picker */}
          <p>Select a color:</p>
          {colorOptions.map((color) => (
            <button
              key={color}
              onClick={() => handleColorSelect(color)}
              style={{
                backgroundColor: color,
                width: '30px',
                height: '30px',
                margin: '5px',
                border: 'none',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Calendar;
