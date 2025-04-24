import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../Style/calendar.css';
import { calendarViewModel } from '../ViewModel/calendarViewModel';

const localizer = momentLocalizer(moment);
const colorOptions = ['#FF5733', '#3498DB', '#2ECC71', '#F1C40F']; // Orange, Blue, Green, Yellow


export function Calendar() {
  const {
    users,
    events,
    modalData,
    handleSelectSlot,
    handleInputChange,
    handleStaffSelect,
    handleColorSelect
  } = calendarViewModel();

  return (
    <div className="content">
      <div className="calendar-wrapper">
        {/* main Calendar component */}
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
            {users.map((staff) => (
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
