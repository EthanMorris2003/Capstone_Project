import axios from "axios";

export const addMessage = async (message, sendTime, replyTo) => {
  try {
    const response = await axios.post('http://localhost:5000/add_message', {
      message: message,
      sendTime: sendTime,
      replyTo: replyTo
    });

    return response.data;
  } catch (error) {
    console.error('Error adding message:', error);
    return false;
  }
};

export const getMessage = async () => {
  try {
    const respose = await axios.get('http://localhost:5000/get_message');

    return respose.data;
  } catch (error) {
    console.error('Error adding message:', error);
    return false;
  }
}