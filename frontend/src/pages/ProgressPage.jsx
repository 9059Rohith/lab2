import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { speakOnPageLoad } from '../utils/voiceService';
import { getAllSymbols } from '../data/symbolsData';
import axios from 'axios';
import './ProgressPage.css';

function ProgressPage({ voiceEnabled }) {
  const location = useLocation();
  const [progressData, setProgressData] = useState(null);
  const [childName, setChildName] = useState(localStorage.getItem('childName') || 'Explorer');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (voiceEnabled) {
      speakOnPageLoad(location.pathname, voiceEnabled);
    }
    fetchProgressData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceEnabled, location.pathname]);

  const fetchProgressData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/progress/${childName}`);
      setProgressData(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
      // Set default progress data
      setProgressData({
        learnedSymbols: [],
        totalSymbols: getAllSymbols().length,
        score: 0,
        gamesPlayed: 0,
        lastActive: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="progress-page">
        <div className="loading">
          <div className="spinner">🚀</div>
          <p>Loading your space journey...</p>
        </div>
      </div>
    );
  }

  const allSymbols = getAllSymbols();
  const learned = progressData?.learnedSymbols?.length || 0;
  const total = allSymbols.length;
  const percentage = Math.round((learned / total) * 100);

  const achievements = [
    { id: 1, name: 'First Step', icon: '🌟', description: 'Learned your first symbol', unlocked: learned >= 1 },
    { id: 2, name: 'Space Explorer', icon: '🚀', description: 'Learned 5 symbols', unlocked: learned >= 5 },
    { id: 3, name: 'Math Wizard', icon: '🧙‍♂️', description: 'Learned 10 symbols', unlocked: learned >= 10 },
    { id: 4, name: 'Symbol Master', icon: '👑', description: 'Learned 15 symbols', unlocked: learned >= 15 },
    { id: 5, name: 'Galaxy Champion', icon: '🌌', description: 'Learned all symbols', unlocked: learned === total },
    { id: 6, name: 'Game Player', icon: '🎮', description: 'Played 5 games', unlocked: (progressData?.gamesPlayed || 0) >= 5 },
    { id: 7, name: 'High Scorer', icon: '🏆', description: 'Scored 100 points', unlocked: (progressData?.score || 0) >= 100 },
    { id: 8, name: 'Dedicated Learner', icon: '📚', description: 'Visited 7 days in a row', unlocked: false }
  ];

  const categories = ['basic', 'special', 'comparison', 'fractions'];
  const categoryProgress = categories.map(cat => {
    const categorySymbols = allSymbols.filter(s => s.category === cat);
    const learnedInCategory = categorySymbols.filter(s =>
      progressData?.learnedSymbols?.some(ls => ls.symbol === s.symbol)
    ).length;
    return {
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      learned: learnedInCategory,
      total: categorySymbols.length,
      percentage: Math.round((learnedInCategory / categorySymbols.length) * 100)
    };
  });

  return (
    <div className="progress-page">
      <div className="progress-header">
        <h1 className="page-title">
          <span className="title-icon">📊</span>
          Your Space Journey
          <span className="title-icon">🌟</span>
        </h1>
        <p className="page-subtitle">
          Great job, {childName}! Keep exploring the stars! 🚀
        </p>
      </div>

      {/* Overall Progress */}
      <div className="progress-section">
        <div className="card main-progress-card">
          <h2>Overall Progress</h2>
          <div className="circular-progress">
            <svg viewBox="0 0 200 200" className="progress-ring">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="20"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="20"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - percentage / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="50%" stopColor="#FF6B9D" />
                  <stop offset="100%" stopColor="#00d4ff" />
                </linearGradient>
              </defs>
            </svg>
            <div className="progress-text">
              <span className="progress-percentage">{percentage}%</span>
              <span className="progress-label">{learned} / {total}</span>
            </div>
          </div>
          <p className="progress-description">
            You've learned {learned} symbols out of {total}! 
            {percentage === 100 ? ' 🎉 Amazing!' : ' Keep going!'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-value">{learned}</div>
            <div className="stat-label">Symbols Learned</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-value">{progressData?.score || 0}</div>
            <div className="stat-label">Total Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <div className="stat-value">{progressData?.gamesPlayed || 0}</div>
            <div className="stat-label">Games Played</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">{achievements.filter(a => a.unlocked).length}</div>
            <div className="stat-label">Achievements</div>
          </div>
        </div>
      </div>

      {/* Category Progress */}
      <div className="progress-section">
        <div className="card">
          <h2>Progress by Category</h2>
          <div className="category-progress-list">
            {categoryProgress.map((cat, index) => (
              <div key={index} className="category-item">
                <div className="category-header">
                  <span className="category-name">{cat.name}</span>
                  <span className="category-stats">{cat.learned} / {cat.total}</span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${cat.percentage}%`,
                      background: `linear-gradient(90deg, 
                        ${index === 0 ? '#FFD700' : index === 1 ? '#FF6B9D' : index === 2 ? '#00d4ff' : '#00FF88'}, 
                        ${index === 0 ? '#FF6B9D' : index === 1 ? '#00d4ff' : index === 2 ? '#00FF88' : '#FFD700'})`
                    }}
                  >
                    <span className="progress-percentage">{cat.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="progress-section">
        <div className="card">
          <h2>Achievements 🏆</h2>
          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-info">
                  <h3>{achievement.name}</h3>
                  <p>{achievement.description}</p>
                </div>
                {achievement.unlocked && (
                  <div className="achievement-badge">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {progressData?.learnedSymbols?.length > 0 && (
        <div className="progress-section">
          <div className="card">
            <h2>Recently Learned Symbols</h2>
            <div className="recent-symbols">
              {progressData.learnedSymbols.slice(-8).reverse().map((symbolData, index) => {
                const symbol = allSymbols.find(s => s.symbol === symbolData.symbol);
                return (
                  <div key={index} className="recent-symbol-card">
                    <div className="symbol-icon" style={{ color: symbol?.color }}>
                      {symbolData.symbol}
                    </div>
                    <div className="symbol-name">{symbolData.symbolName}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Encouraging Message */}
      <div className="progress-section">
        <div className="card encouragement-card">
          <h2>Keep Going, Space Explorer! 🚀</h2>
          <p>
            {percentage < 25 && "You're off to a great start! Every symbol you learn is a new star in your galaxy!"}
            {percentage >= 25 && percentage < 50 && "Wonderful progress! You're becoming a math symbol expert!"}
            {percentage >= 50 && percentage < 75 && "Amazing work! You're more than halfway through your journey!"}
            {percentage >= 75 && percentage < 100 && "You're almost there! Just a few more symbols to master!"}
            {percentage === 100 && "Incredible! You've mastered all the symbols! You're a true Math Champion! 👑"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProgressPage;
