import axios from "axios";

export const addMessage = async (message, sendTime, replyTo) => {
  try {
    const response = await axios.post('http://localhost:5000/add_message', {
      message: message,
      sendTime: sendTime,
      replyTo: replyTo
    })

    console.log(response.data);
  } catch (error) {
    console.error('Error adding message:', error);
    return false;
  }
};