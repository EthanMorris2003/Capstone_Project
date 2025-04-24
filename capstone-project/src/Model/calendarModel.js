import axios from "axios";

// Returns full names of all users
export const getUser = async () => {
  try {
    const response = await axios.get('http://localhost:5000/get_user');

    return response.data;
  } catch (error) {
    console.error('Error getting users:', error);
    return false;
  }
}

// Add an event. Takes an event, and return true or false for whether the event was added
export const addEvent = async (username, event) => {
  try {
    const response = await axios.post('http://localhost:5000/add_event', {
      username: username,
      title: event.title,
      assignedStaff: event.assignedStaff,
      start: event.start.toISOString().slice(0, 19).replace('T', ' '),
      end: event.end.toISOString().slice(0, 19).replace('T', ' '),
      x: event.x,
      y: event.y,
      color: event.color
    });

    if (response.data === "Event added successfully") {
      return true;
    }
    return false;
  }
  catch (error) {
    console.error('Error adding event:', error);
    return false;
  }
}

// Return all events
export const getEvent = async () => {
  try {
    const response = await axios.get('http://localhost:5000/get_event');

    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    console.error('Error getting calendar events:', error);
    return false;
  }
}