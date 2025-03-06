import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx' 
import SignUP from './View/signup.jsx' 
import Login from './View/login.jsx'
import './Style/App.css'
import './Style/login.css'
import './Style/SignUP.css'
import './Style/notes.css'
import './Style/calendar.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App></App>
  </StrictMode>,
)