import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import './styles/animations.css';
import './styles/grain-overlay.css';

// Disable native browser scroll restoration globally to prevent conflicting scroll jumps
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);
