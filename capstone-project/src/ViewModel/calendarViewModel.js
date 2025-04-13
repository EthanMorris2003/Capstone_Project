import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getUser, addEvent, getEvent } from '../Model/calendarModel.js'

export const calendarViewModel = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [modalData, setModalData] = useState(null);

  const username = jwtDecode(localStorage.getItem('authToken')).username;
  if (!username) {
    console.error("No credentials found. Please log in");
    return;
  };

  useEffect(() => {
    const getAllUsers = async () => {
      const result = await getUser();
      if (result && result.data) {
        setUsers(
          result.data
            .map(user => `${user.firstName} ${user.lastName}`)
            .sort((a, b) => a.localeCompare(b))
        );
      }
    }

    if (username) {
      getAllUsers();
    }
  }, [username]);

  useEffect(() => {
    const getAllEvents = async () => {
      const result = await getEvent();
      if (result && result.data) {
        const newEvents = result.data.map(row => ({
          title: row.title,
          assignedStaff: row.assigned_staff,
          start: new Date(row.start),
          end: new Date(row.end),
          x: row.x,
          y: row.y,
          color: row.color
        }));
        setEvents(newEvents);
      }
    }

    if (username) {
      getAllEvents();
    }
  }, [username, events]);

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
  const handleColorSelect = async (color) => {
    if (!modalData?.title.trim()) {
      alert('Please enter an event title!');
      return;
    }
    if (!modalData.assignedStaff) {
      alert('Please assign a staff member!');
      return;
    }

    const newEvent = { ...modalData, color };
    const result = await addEvent(username, newEvent);
  
    if (result) {
      alert('Event added');
      setEvents(prev => [...prev, newEvent]);
      setModalData(null); // Close modal
      console.log(events);
    } else {
      alert('Error adding event');
    }
  };

  return {
    users,
    events,
    modalData,
    handleSelectSlot,
    handleInputChange,
    handleStaffSelect,
    handleColorSelect
  }
};