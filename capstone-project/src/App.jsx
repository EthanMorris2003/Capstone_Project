import { useState } from 'react';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Outlet } from 'react-router-dom';
import Dashboard from './View/dashboard';
import Login from './View/login';
import Home from './View/homepage';
import Signup from './View/signup';
import Notes from './View/Notes'; 
import Calendar from './View/Calendar'; 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="/notes" element={<Notes />} /> 
        <Route path="/calendar" element={<Calendar />} /> 

      </Routes>
    </Router>
  );
}

export default App;