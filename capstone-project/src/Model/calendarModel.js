import axios from "axios";

export const getUser = async () => {
  try {
    const response = await axios.get('http://localhost:5000/get_user');

    return response.data;
  } catch (error) {
    console.error('Error getting users:', error);
    return false;
  }
}

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