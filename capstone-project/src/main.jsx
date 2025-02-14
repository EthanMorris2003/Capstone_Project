import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx' 
import SignUP from './View/SignUP.jsx' 
import Login from './View/login.jsx'
import './Style/App.css'
import './Style/login.css'
import './Style/signup.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
   <App></App>
  </StrictMode>,
)


//    <App></App>
//    <Login></Login>
//    <SignUP></SignUP>

