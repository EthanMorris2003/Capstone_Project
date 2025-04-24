import axios from "axios";
import { resolveContent } from "nodemailer/lib/shared";

// Post a message. Return the ID of the message (unique)
export const addMessage = async (username, message, sendTime, replyTo) => {
  try {
    const response = await axios.post('http://localhost:5000/add_message', {
      username: username,
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

// Return all messages
export const getMessage = async () => {
  try {
    const response = await axios.get('http://localhost:5000/get_message');

    return response.data;
  } catch (error) {
    console.error('Error adding message:', error);
    return false;
  }
}