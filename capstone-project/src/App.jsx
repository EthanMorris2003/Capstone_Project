import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './ViewManager/dashboard';
import Login from './View/login';
import Home from './View/homepage';
import DashboardHome from './View/DashboardHome';
import Signup from './View/SignUp';
import Notes from './View/Notes';
import Calendar from './View/Calendar';
import ResetPassword from './View/resetPassword';

import DashboardMain from './ViewManager/dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="notes" element={<Notes />} />
          <Route path="calendar" element={<Calendar />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="resetPassword" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;