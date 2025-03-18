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
import '../Style/calendar.css'; // Ensure this import is present

const localizer = momentLocalizer(moment);
const colorOptions = ['#FF5733', '#3498DB', '#2ECC71', '#F1C40F']; // Orange, Blue, Green, Yellow

export function Calendar() {
  const [events, setEvents] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newEvent, setNewEvent] = useState(null);

  // Handle adding new events when a user clicks on the calendar
  const handleSelectSlot = ({ start, end }) => {
    const title = prompt('Enter Event Title:');
    if (!title) return;

    setNewEvent({ title, start, end });
    setShowColorPicker(true);  // Show the color picker only after title is set
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    if (newEvent) {
      setEvents([...events, { ...newEvent, color }]);
      setNewEvent(null);
      setShowColorPicker(false);  // Hide color picker after selecting color
    }
  };

  // Handle editing or deleting an event when clicked
  const handleSelectEvent = (selectedEvent) => {
    const action = prompt(
      `Edit or delete event:\n"${selectedEvent.title}"\n\nEnter new title, or type "DELETE" to remove it.`
    );

    if (action === null) return;

    if (action.toUpperCase() === "DELETE") {
      setEvents((prevEvents) =>
        prevEvents.filter(
          (event) =>
            event.start.getTime() !== selectedEvent.start.getTime() ||
            event.end.getTime() !== selectedEvent.end.getTime()
        )
      );
    } else if (action.trim() !== "") {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.start.getTime() === selectedEvent.start.getTime() &&
            event.end.getTime() === selectedEvent.end.getTime()
            ? { ...event, title: action }
            : event
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
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          defaultView={Views.WEEK}
          style={{ height: '100%', width: '100%' }}
          eventPropGetter={(event) => ({
            style: { backgroundColor: event.color, color: 'white' }
          })}
        />
      </div>

      {/* Show color picker only after the event title is set */}
      {showColorPicker && (
        <div className="color-picker">
          <p>Select a color:</p>
          {colorOptions.map((color) => (
            <button
              key={color}
              onClick={() => handleColorSelect(color)}
              style={{
                backgroundColor: color,
                width: '40px',
                height: '40px',
                margin: '5px',
                border: 'none'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Calendar;
