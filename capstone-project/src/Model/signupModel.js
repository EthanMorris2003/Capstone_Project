import axios from "axios";

// Sign a user up. Return true or false.
export const signUp = async (username, password, firstName, lastName, email) => {
  try {
    const response = await axios.post('http://localhost:5000/signup', {
      username: username,
      password: password,
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