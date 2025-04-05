import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPass } from "../Model/resetPassModel";

export const resetPassViewModel = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleResetPass = async () => {
    if (
      username == '' || 
      firstName == '' || 
      lastName == '' || 
      email == ''
    ) {
      alert("All fields need to be filled");
      return;
    }

    const result = await resetPass(username,  firstName, lastName, email);
    if (result) {
      navigate('/login');
    } else {
      console.error('Error signing up:', error);
      alert('Error signing up');
    }
  };

  return {
    username,

    firstName,
    lastName,
    email,
    setUsername,

    setFirstName,
    setLastName,
    setEmail,
    handleResetPass
  }
};