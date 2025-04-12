import axios from 'axios';

export const getStaff = async (username) => {
    try {
        const response = await axios.get('http://localhost:5000/get_Calendar', {
            params: {username}
        });
        const returnData = response.data;
        return returnData;

    } catch (error) {
        console.error('Error retrieving Staff:', error);
        return false;
    }
};

export const getCalendar = async (username) => {
  try {
    const response = await axios.get('http://localhost:5000/get_Calendar', {
      params: {username}
    });

    const returnData = response.data;
    return returnData;

  } catch (error) {
    console.error('Error retrieving Calendar:', error);
    return false;
  }
};

export const addEvent = async (editingIndex, username, EventTitle, EventContent) => {
  try {
    const response = await axios.post('http://localhost:5000/add_Event', {
      EventId: editingIndex,
      username: username,
      EventTitle: EventTitle,
      EventContent: EventContent,
    });
    if (response.data === "Event added successfully" || response.data === "Event modified successfully") {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding Event:', error);
    return false;
  }
};

export const deleteEvent = async (editingIndex) => {
  try {
    const response = await axios.post('http://localhost:5000/delete_Event', {
      EventId: editingIndex
    });
    if (response.data === "Event deleted successfully") {
      alert(response.data);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding Event:', error);
    return false;
  }
};

export const updateEvent = (Events, editingIndex, newTitle, newContent) => {
  return Events.map((Event, idx) =>
    idx === editingIndex ? { ...Event, title: newTitle, content: newContent } : Event
  );
};

