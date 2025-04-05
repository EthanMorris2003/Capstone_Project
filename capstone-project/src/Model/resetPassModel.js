import axios from "axios";

export const resetPass = async (username, password, firstName, lastName, email) => {
  try {
    const response = await axios.post('http://localhost:5000/resetPassword', {
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email
    });
    if (response.data === 'User signed up successfully') {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error signing up:', error);
    alert('Error signing up');
  }
}