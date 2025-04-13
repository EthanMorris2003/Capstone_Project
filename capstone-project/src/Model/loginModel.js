import axios from "axios";

export const addUser = async (username, password) => {
  try {
    const response = await axios.post('http://localhost:5000/login', {
      username,
      password
    });
    
    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    alert('Error logging in');
  }
}