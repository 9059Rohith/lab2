import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import LearnPage from './pages/LearnPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ProgressPage from './pages/ProgressPage';
import AboutPage from './pages/AboutPage';
import TeamPage from './pages/TeamPage';
import RocketGame from './pages/RocketGame';
import VoiceToggle from './components/VoiceToggle';
import StarField from './components/StarField';
import SensorySettings from './components/SensorySettings';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('siteTheme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('siteTheme', theme);
  }, [theme]);

  return (
    <Router>
      <div className="app-container">
        <StarField />
        <div className="info-marquee" role="status" aria-live="polite">
          <div className="info-marquee-track">
            <span>Welcome to Star Math Explorer</span>
            <span>Theme toggle and comfort settings available</span>
            <span>Rocket Game and learning activities are ready</span>
            <span>Progress sync works with backend API</span>
            <span>Learn symbols in a calm, playful, and structured way</span>
          </div>
        </div>
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage voiceEnabled={voiceEnabled} />} />
            <Route path="/learn" element={<LearnPage voiceEnabled={voiceEnabled} />} />
            <Route path="/activities" element={<ActivitiesPage voiceEnabled={voiceEnabled} />} />
            <Route path="/progress" element={<ProgressPage voiceEnabled={voiceEnabled} />} />
            <Route path="/about" element={<AboutPage voiceEnabled={voiceEnabled} />} />
            <Route path="/team" element={<TeamPage voiceEnabled={voiceEnabled} />} />
            <Route path="/rocket-game" element={<RocketGame voiceEnabled={voiceEnabled} />} />
          </Routes>
        </main>
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <VoiceToggle 
          voiceEnabled={voiceEnabled} 
          setVoiceEnabled={setVoiceEnabled} 
        />
        <SensorySettings />
      </div>
    </Router>
  );
}

export default App;
