import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Initialize theme before app renders
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('lk-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
};

initializeTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

