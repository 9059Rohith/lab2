import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { speakOnPageLoad } from '../utils/voiceService';
import { getAllSymbols } from '../data/symbolsData';
import axios from 'axios';
import './ProgressPage.css';

// Import assets
import rainbow from '../assets/rainbow_wgg.png';
import blueCrystal from '../assets/blue_crystal.png';
import greenCrystal from '../assets/green_crystal.png';
import purpleCrystal from '../assets/purple crystal.png';
import superCrystal from '../assets/super_main_crystal.png';
import earth from '../assets/earth.png';
import moon from '../assets/moon.png';
import saturn from '../assets/saturn.png';

function ProgressPage({ voiceEnabled }) {
  const location = useLocation();
  const [progressData, setProgressData] = useState(null);
  const [childName, setChildName] = useState(localStorage.getItem('childName') || 'Student');
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
          <div className="spinner-container">
            <img src={earth} alt="Loading" className="spinner-image" />
          </div>
          <p>Loading progress data...</p>
        </div>
      </div>
    );
  }

  const allSymbols = getAllSymbols();
  const learned = progressData?.learnedSymbols?.length || 0;
  const total = allSymbols.length;
  const percentage = Math.round((learned / total) * 100);

  const achievements = [
    { 
      id: 1, 
      name: 'First Step', 
      icon: blueCrystal, 
      description: 'Learned your first symbol', 
      unlocked: learned >= 1 
    },
    { 
      id: 2, 
      name: 'Progress Maker', 
      icon: greenCrystal, 
      description: 'Learned 5 symbols', 
      unlocked: learned >= 5 
    },
    { 
      id: 3, 
      name: 'Symbol Scholar', 
      icon: purpleCrystal, 
      description: 'Learned 10 symbols', 
      unlocked: learned >= 10 
    },
    { 
      id: 4, 
      name: 'Advanced Learner', 
      icon: superCrystal, 
      description: 'Learned 15 symbols', 
      unlocked: learned >= 15 
    },
    { 
      id: 5, 
      name: 'Master Status', 
      icon: rainbow, 
      description: 'Learned all symbols', 
      unlocked: learned === total 
    }
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
        <h1 className="page-title">Learning Progress Tracker</h1>
        <p className="page-subtitle">
          Student: {childName} | Tracking Symbol Mastery
        </p>
      </div>

      {/* Overall Progress */}
      <div className="progress-section">
        <div className="card main-progress-card">
          <h2>Overall Progress</h2>
          <div className="progress-stats">
            <div className="circular-progress">
              <svg viewBox="0 0 200 200" className="progress-ring">
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="15"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#4fd1c5"
                  strokeWidth="15"
                  strokeDasharray={`${2 * Math.PI * 90}`}
                  strokeDashoffset={`${2 * Math.PI * 90 * (1 - percentage / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                  className="progress-circle"
                />
              </svg>
              <div className="progress-text">
                <span className="progress-percentage">{percentage}%</span>
                <span className="progress-label">{learned} / {total}</span>
              </div>
            </div>
            <div className="progress-details">
              <img src={earth} alt="Progress" className="progress-icon" />
              <p className="progress-description">
                {learned} symbols learned out of {total}
              </p>
              <p className="progress-status">
                {percentage === 100 ? 'Mastery Achieved!' : 'Continue Learning'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <img src={moon} alt="Symbols" className="stat-icon" />
            <div className="stat-value">{learned}</div>
            <div className="stat-label">Symbols Learned</div>
          </div>
          <div className="stat-card">
            <img src={saturn} alt="Score" className="stat-icon" />
            <div className="stat-value">{progressData?.score || 0}</div>
            <div className="stat-label">Total Score</div>
          </div>
          <div className="stat-card">
            <img src={blueCrystal} alt="Games" className="stat-icon" />
            <div className="stat-value">{progressData?.gamesPlayed || 0}</div>
            <div className="stat-label">Activities Completed</div>
          </div>
        </div>
      </div>

      {/* Category Progress */}
      <div className="category-section">
        <h2 className="section-title">Progress by Category</h2>
        <div className="category-grid">
          {categoryProgress.map((cat, index) => (
            <div key={index} className="category-card">
              <h3 className="category-name">{cat.name}</h3>
              <div className="category-progress-bar">
                <div 
                  className="category-progress-fill" 
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
              <p className="category-stats">
                {cat.learned} / {cat.total} symbols ({cat.percentage}%)
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="achievements-section">
        <h2 className="section-title">Achievements</h2>
        <div className="achievements-grid">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon-container">
                <img 
                  src={achievement.icon} 
                  alt={achievement.name} 
                  className="achievement-icon" 
                />
              </div>
              <h3 className="achievement-name">{achievement.name}</h3>
              <p className="achievement-description">{achievement.description}</p>
              <div className="achievement-status">
                {achievement.unlocked ? 'Unlocked' : 'Locked'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-summary">
        <h2 className="section-title">Recent Activity</h2>
        <div className="activity-card">
          <p>Last Active: {new Date(progressData?.lastActive).toLocaleDateString()}</p>
          <p>Keep practicing to maintain your progress!</p>
        </div>
      </div>
    </div>
  );
}

export default ProgressPage;
