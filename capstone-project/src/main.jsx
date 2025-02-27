import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx' 
import SignUP from './View/SignUP.jsx' 
import Login from './View/login.jsx'
import './Style/App.css'
import './Style/login.css'
import './Style/signup.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Router>
      <Routes>
        <Route path="/" element={<App />} /> {/* Default route for the dashboard */}
        <Route path="/signup" element={<SignUP />} /> {/* Route for the SignUP page */}
        <Route path="/login" element={<Login />} /> {/* Route for the Login page */}
      </Routes>
    </Router>
  </StrictMode>,
)


//    <App></App>
//    <Login></Login>
//    <SignUP></SignUP>

