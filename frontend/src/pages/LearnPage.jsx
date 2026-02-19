import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { speakOnPageLoad, speakSymbol, speakCelebration } from '../utils/voiceService';
import { symbolsData } from '../data/symbolsData';
import axios from 'axios';
import './LearnPage.css';

function LearnPage({ voiceEnabled }) {
  const location = useLocation();
  const [learnedSymbols, setLearnedSymbols] = useState([]);
  const [childName, setChildName] = useState(localStorage.getItem('childName') || '');
  const [showNamePrompt, setShowNamePrompt] = useState(!childName);

  useEffect(() => {
    if (voiceEnabled) {
      speakOnPageLoad(location.pathname, voiceEnabled);
    }
  }, [voiceEnabled]);

  const handleSaveName = () => {
    if (childName.trim()) {
      localStorage.setItem('childName', childName);
      setShowNamePrompt(false);
    }
  };

  const handleLearnSymbol = async (symbol) => {
    if (!learnedSymbols.includes(symbol.symbol)) {
      setLearnedSymbols([...learnedSymbols, symbol.symbol]);
      
      if (voiceEnabled) {
        speakCelebration();
      }

      // Save to database
      if (childName) {
        try {
          await axios.post('http://localhost:3000/api/symbol-learned', {
            childName,
            symbol: symbol.symbol,
            symbolName: symbol.name,
            category: symbol.category
          });
        } catch (error) {
          console.error('Error saving symbol:', error);
        }
      }

      // Show confetti animation
      createConfetti();
    }
  };

  const createConfetti = () => {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.backgroundColor = ['#FFD700', '#FF6B9D', '#00d4ff', '#00FF88'][Math.floor(Math.random() * 4)];
      confetti.style.animationDelay = `${Math.random() * 0.5}s`;
      confettiContainer.appendChild(confetti);
    }

    setTimeout(() => {
      document.body.removeChild(confettiContainer);
    }, 3000);
  };

  const SymbolCard = ({ symbol }) => (
    <div className="symbol-card">
      <div className="symbol-icon" style={{ color: symbol.color }}>
        {symbol.symbol}
      </div>
      <h3 className="symbol-name">{symbol.name}</h3>
      <p className="symbol-description">{symbol.description}</p>
      <div className="symbol-example">
        <strong>Example:</strong> {symbol.example}
      </div>
      <div className="symbol-visual">
        {symbol.visual}
      </div>
      <div className="symbol-actions">
        <button
          className="btn-speak"
          onClick={() => voiceEnabled && speakSymbol(symbol.symbol, symbol.name, symbol.description)}
        >
          🔊 Speak
        </button>
        <button
          className={`btn-learned ${learnedSymbols.includes(symbol.symbol) ? 'learned' : ''}`}
          onClick={() => handleLearnSymbol(symbol)}
          disabled={learnedSymbols.includes(symbol.symbol)}
        >
          {learnedSymbols.includes(symbol.symbol) ? '✅ Learned!' : '⭐ I Learned This!'}
        </button>
      </div>
    </div>
  );

  if (showNamePrompt) {
    return (
      <div className="learn-page">
        <div className="name-prompt-overlay">
          <div className="name-prompt">
            <h2>👋 Hello, Space Explorer!</h2>
            <p>What is your name?</p>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Enter your name"
              className="name-input"
              autoFocus
            />
            <button onClick={handleSaveName} className="btn-save-name">
              🚀 Start Learning!
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = (learnedSymbols.length / 
    (symbolsData.basic.length + symbolsData.special.length + 
     symbolsData.comparison.length + symbolsData.fractions.length)) * 100;

  return (
    <div className="learn-page">
      <div className="learn-header">
        <h1 className="page-title">
          <span className="title-icon">📚</span>
          Math Symbol Lab
          <span className="title-icon">🔬</span>
        </h1>
        <p className="page-subtitle">
          Hello, {childName}! Learn amazing math symbols on your space journey! 🌟
        </p>
        <div className="progress-section">
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progressPercent}%` }}>
              <span className="progress-text">{learnedSymbols.length} symbols learned!</span>
            </div>
          </div>
        </div>
      </div>

      <section className="symbols-section">
        <h2 className="section-title">
          <span className="section-icon">🎯</span>
          Basic Operations
        </h2>
        <div className="symbols-grid">
          {symbolsData.basic.map((symbol, index) => (
            <SymbolCard key={index} symbol={symbol} />
          ))}
        </div>
      </section>

      <section className="symbols-section">
        <h2 className="section-title">
          <span className="section-icon">✨</span>
          Special Symbols
        </h2>
        <div className="symbols-grid">
          {symbolsData.special.map((symbol, index) => (
            <SymbolCard key={index} symbol={symbol} />
          ))}
        </div>
      </section>

      <section className="symbols-section">
        <h2 className="section-title">
          <span className="section-icon">⚖️</span>
          Comparison Symbols
        </h2>
        <div className="symbols-grid">
          {symbolsData.comparison.map((symbol, index) => (
            <SymbolCard key={index} symbol={symbol} />
          ))}
        </div>
      </section>

      <section className="symbols-section">
        <h2 className="section-title">
          <span className="section-icon">🍕</span>
          Fraction Symbols
        </h2>
        <div className="symbols-grid">
          {symbolsData.fractions.map((symbol, index) => (
            <SymbolCard key={index} symbol={symbol} />
          ))}
        </div>
      </section>

      {progressPercent === 100 && (
        <div className="completion-message">
          <h2>🎉 AMAZING JOB! 🎉</h2>
          <p>You learned ALL the symbols! You are a SUPER STAR! 🌟</p>
        </div>
      )}
    </div>
  );
}

export default LearnPage;
