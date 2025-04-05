import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx' 
import Signup from './View/SignUp.jsx'
import Login from './View/login.jsx'
import Dashboard from './ViewManager/dashboard.jsx'
import Notes from './View/Notes.jsx'
import Calendar from './View/Calendar.jsx';
import './Style/App.css'
import './Style/login.css'
import './Style/SignUP.css'
import './Style/Notes.css'
import './Style/calendar.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App></App>
  </StrictMode>,
)