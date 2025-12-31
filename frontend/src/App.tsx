import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import DiscoveryDashboard from './components/DiscoveryDashboard';
import VisionCortex from './vision-cortex/VisionCortex';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="container">
            <div className="header-content">
              <h1>🔮 Infinity Matrix</h1>
              <p className="tagline">Intelligence Discovery System</p>
            </div>
            <nav className="nav">
              <Link to="/" className="nav-link">Discovery</Link>
              <Link to="/vision-cortex" className="nav-link">Vision Cortex</Link>
            </nav>
          </div>
        </header>
        
        <main className="container">
          <Routes>
            <Route path="/" element={<DiscoveryDashboard />} />
            <Route path="/vision-cortex" element={<VisionCortex />} />
          </Routes>
        </main>
        
        <footer className="App-footer">
          <div className="container">
            <p>&copy; 2025 Infinity Matrix. Enterprise-Grade Intelligence Discovery Platform.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
