import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import FloatingAssets from './components/FloatingAssets';
import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage';
import ChatPage from './pages/ChatPage';
import RewardsPage from './pages/RewardsPage';
import AboutPage from './pages/AboutPage';
import SymbolsPage from './pages/SymbolsPage';
import { fetchStats } from './api';
import { speak, uid } from './utils';

function getUserId() {
  const key = 'symbol-user-id';
  const saved = localStorage.getItem(key);
  if (saved) return saved;
  const created = uid();
  localStorage.setItem(key, created);
  return created;
}

export default function App() {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [userId] = useState(getUserId);
  const [totalPoints, setTotalPoints] = useState(0);

  const refreshPoints = () => {
    fetchStats(userId)
      .then((data) => {
        if (data?.success) setTotalPoints(data.totalPoints || 0);
      })
      .catch(() => undefined);
  };

  useEffect(() => {
    refreshPoints();
    speak('Welcome to Symbol Galaxy. Let us learn symbols with games.', true);
  }, []);

  return (
    <div className="app-shell">
      <FloatingAssets />
      <Navbar totalPoints={totalPoints} />

      <button
        type="button"
        className="voice-fab"
        onClick={() => setVoiceEnabled((v) => !v)}
        title="Toggle Voice"
      >
        {voiceEnabled ? '🔊' : '🔇'}
      </button>

      <Routes>
        <Route path="/" element={<HomePage voiceEnabled={voiceEnabled} />} />
        <Route
          path="/games"
          element={<GamesPage userId={userId} voiceEnabled={voiceEnabled} onScoreSaved={refreshPoints} />}
        />
        <Route path="/chat" element={<ChatPage userId={userId} voiceEnabled={voiceEnabled} />} />
        <Route path="/rewards" element={<RewardsPage userId={userId} voiceEnabled={voiceEnabled} refreshTrigger={totalPoints} />} />
        <Route path="/symbols" element={<SymbolsPage voiceEnabled={voiceEnabled} />} />
        <Route path="/about" element={<AboutPage voiceEnabled={voiceEnabled} />} />
      </Routes>
    </div>
  );
}
