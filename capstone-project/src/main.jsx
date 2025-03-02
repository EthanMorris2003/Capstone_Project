import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx' 
import SignUP from './View/signup.jsx' 
import Login from './View/login.jsx'
import Dashboard from './ViewManager/dashboard.jsx'
import './Style/App.css'
import './Style/login.css'
import './Style/SignUP.css'
import './Style/notes.css'
import './Style/calendar.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Router>
      <Routes>
        <Route path="/" element={<App />} /> {/* Default route for the dashboard */}
        <Route path="/signup" element={<SignUP />} /> {/* Route for the SignUP page */}
        <Route path="/login" element={<Login />} /> {/* Route for the Login page */}
        <Route path="/ViewManager/dashboard" element={<Dashboard />} /> {/* Route for the Login page */}
      </Routes>
    </Router>
  </StrictMode>,
)