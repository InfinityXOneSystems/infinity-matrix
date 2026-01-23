
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

// IMMEDIATE THEME APPLICATION
// Forces dark mode on load to prevent any white screen flashes
(function() {
  document.documentElement.classList.add('dark');
  document.documentElement.classList.remove('light');
  document.documentElement.style.backgroundColor = '#02040a';
  document.body.style.backgroundColor = '#02040a';
  
  // Persist preference
  localStorage.setItem('theme', 'dark');
})();

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Infinity X PWA: ServiceWorker registration successful with scope: ', registration.scope);
      }, (err) => {
        console.log('Infinity X PWA: ServiceWorker registration failed: ', err);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);
