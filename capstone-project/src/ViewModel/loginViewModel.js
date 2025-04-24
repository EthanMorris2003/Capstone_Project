import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addUser } from "../Model/loginModel";

export const loginViewModel = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  // Logs a user in
  const handleLogin = async () => {
    if (username == '' || password == '') {
      alert("All fields need to be filled");
      return;
    }

    const result = await addUser(username, password);

    if (result.data.message === "User authenticated successfully") {
      localStorage.setItem('authToken', result.data.token);
      navigate('/Dashboard');
    } else {
      alert('Incorrect Credentials');
    }
  };

  return {
    username,
    password,
    setUsername,
    setPassword,
    handleLogin
  };
}