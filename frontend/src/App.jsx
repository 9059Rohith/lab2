import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import LearnPage from './pages/LearnPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ProgressPage from './pages/ProgressPage';
import AboutPage from './pages/AboutPage';
import TeamPage from './pages/TeamPage';
import VoiceToggle from './components/VoiceToggle';
import StarField from './components/StarField';
import './App.css';

function App() {
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  return (
    <Router>
      <div className="app-container">
        <StarField />
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage voiceEnabled={voiceEnabled} />} />
            <Route path="/learn" element={<LearnPage voiceEnabled={voiceEnabled} />} />
            <Route path="/activities" element={<ActivitiesPage voiceEnabled={voiceEnabled} />} />
            <Route path="/progress" element={<ProgressPage voiceEnabled={voiceEnabled} />} />
            <Route path="/about" element={<AboutPage voiceEnabled={voiceEnabled} />} />
            <Route path="/team" element={<TeamPage voiceEnabled={voiceEnabled} />} />
          </Routes>
        </main>
        <VoiceToggle 
          voiceEnabled={voiceEnabled} 
          setVoiceEnabled={setVoiceEnabled} 
        />
      </div>
    </Router>
  );
}

export default App;
