import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import './styles/animations.css';
import './styles/grain-overlay.css';

/* Prevent browser scroll restoration from conflicting with route transitions */
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);
