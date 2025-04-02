import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../Model/signupModel";

export const signupViewModel = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (
      username == '' || 
      password == '' || 
      confirmPassword == '' || 
      firstName == '' || 
      lastName == '' || 
      email == ''
    ) {
      alert("All fields need to be filled");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    const result = await signUp(username, password, firstName, lastName, email);
    if (result) {
      navigate('/login');
    } else {
      console.error('Error signing up:', error);
      alert('Error signing up');
    }
  };

  return {
    username,
    password,
    confirmPassword,
    firstName,
    lastName,
    email,
    setUsername,
    setPassword,
    setConfirmPassword,
    setFirstName,
    setLastName,
    setEmail,
    handleSignUp
  }
};