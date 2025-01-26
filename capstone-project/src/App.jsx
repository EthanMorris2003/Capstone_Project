import { useState } from 'react'
import reactLogo from './Assets/react.svg'
import viteLogo from '/vite.svg'
import './Style/App.css'

function App() {

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          Capstone Project Spring 2025
        </p>
      </div>
    </>
  )
}

export default App
