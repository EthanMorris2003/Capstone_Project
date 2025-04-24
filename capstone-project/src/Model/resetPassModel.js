import axios from "axios";

// Resets password. Return true or false.
export const resetPass = async (username, firstName, lastName, email) => {
  try {
    const response = await axios.post('http://localhost:5000/resetPassword', {
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email
    });
    if (response.data === 'Password reset email sent successfully') {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error signing up:', error);
    alert('Error signing up');
  }
}