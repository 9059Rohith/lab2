import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { speakOnPageLoad, speakSymbol, speakCelebration } from '../utils/voiceService';
import { getAllSymbols } from '../data/symbolsData';
import apiClient from '../utils/apiClient';
import './LearnPage.css';

// Import educational illustrations
import happyBear from '../assets/happy_bear.png';
import happyBell from '../assets/happy_bell.png';
import fruitHappy from '../assets/fruit_happy.png';

function LearnPage({ voiceEnabled }) {
  const location = useLocation();
  const [learnedSymbols, setLearnedSymbols] = useState([]);
  const [childName, setChildName] = useState(localStorage.getItem('childName') || '');
  const [showNamePrompt, setShowNamePrompt] = useState(!childName);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Load voices for speech synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
    if (voiceEnabled) {
      speakOnPageLoad(location.pathname, voiceEnabled);
    }
  }, [voiceEnabled, location.pathname]);

  useEffect(() => {
    const loadLearnedSymbols = async () => {
      if (!childName) return;

      try {
        const response = await apiClient.get(`/symbol-learned/${encodeURIComponent(childName)}`);
        const learned = response.data?.data?.map((item) => item.symbol) || [];
        setLearnedSymbols(Array.from(new Set(learned)));
      } catch (error) {
        console.error('Error loading learned symbols:', error);
      }
    };

    loadLearnedSymbols();
  }, [childName]);

  const handleSaveName = () => {
    const normalizedName = childName.trim();
    if (normalizedName) {
      localStorage.setItem('childName', normalizedName);
      setChildName(normalizedName);
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
          await apiClient.post('/symbol-learned', {
            childName,
            symbol: symbol.symbol,
            symbolName: symbol.name,
            category: symbol.category
          });
        } catch (error) {
          console.error('Error saving symbol:', error);
        }
      }

      // Show subtle success indicator
      showSuccessIndicator(symbol.name);
    }
  };

  const showSuccessIndicator = (symbolName) => {
    const indicator = document.createElement('div');
    indicator.className = 'success-indicator';
    indicator.textContent = `✓ ${symbolName} Learned!`;
    document.body.appendChild(indicator);

    setTimeout(() => {
      indicator.classList.add('fade-out');
      setTimeout(() => document.body.removeChild(indicator), 300);
    }, 2000);
  };

  const allSymbols = getAllSymbols();
  
  const categories = ['all', ...new Set(allSymbols.map(s => s.category))];
  const filteredSymbols = selectedCategory === 'all' 
    ? allSymbols 
    : allSymbols.filter(s => s.category === selectedCategory);

  if (showNamePrompt) {
    return (
      <div className="learn-page">
        <div className="name-prompt-container">
          <div className="name-prompt-card">
            <img src={happyBear} alt="Welcome" className="welcome-image" />
            <h2>Welcome to Star Math Explorer</h2>
            <p>Please enter your name to begin your learning journey</p>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Enter your name"
              className="name-input"
              onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
            />
            <button onClick={handleSaveName} className="btn-start">
              Begin Learning
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="learn-page">
      <div className="learn-container">
        {/* Header Section */}
        <header className="learn-header">
          <div className="header-content">
            <img src={happyBell} alt="Learning" className="header-icon" />
            <div className="header-text">
              <h1>Mathematical Symbols Learning</h1>
              <p className="welcome-text">Welcome, {childName}!</p>
              <p className="progress-text">
                Symbols Mastered: <strong>{learnedSymbols.length}</strong> / {allSymbols.length}
              </p>
            </div>
          </div>
        </header>

        {/* Category Filter */}
        <section className="category-section">
          <h2 className="section-title">Select Category</h2>
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All Symbols' : category}
              </button>
            ))}
          </div>
        </section>

        {/* Symbols Grid */}
        <section className="symbols-section">
          {filteredSymbols.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#a8c5da' }}>
              <p style={{ fontSize: '1.5rem' }}>No symbols found for this category.</p>
              <p>Total symbols loaded: {allSymbols.length}</p>
            </div>
          ) : (
            <div className="symbols-grid">
              {filteredSymbols.map((symbol, index) => (
              <div 
                key={index} 
                className={`symbol-card ${learnedSymbols.includes(symbol.symbol) ? 'learned' : ''}`}
              >
                <div className="symbol-header">
                  <div className="symbol-icon" style={{ backgroundColor: symbol.color || '#4fd1c5' }}>
                    {symbol.symbol}
                  </div>
                  {learnedSymbols.includes(symbol.symbol) && (
                    <span className="learned-badge">✓ Mastered</span>
                  )}
                </div>

                <div className="symbol-content">
                  <h3 className="symbol-name">{symbol.name}</h3>
                  <p className="symbol-description">{symbol.description}</p>
                  
                  <div className="symbol-example-box">
                    <strong>Example:</strong>
                    <div className="example-text">{symbol.example}</div>
                  </div>

                  {symbol.visual && (
                    <div className="symbol-visual">
                      {symbol.visual}
                    </div>
                  )}
                </div>

                <div className="symbol-actions">
                  <button
                    className="btn-speak"
                    onClick={() => {
                      if ('speechSynthesis' in window) {
                        speakSymbol(symbol.symbol, symbol.name, symbol.description);
                      } else {
                        alert('Speech synthesis not supported in your browser');
                      }
                    }}
                    title="Hear pronunciation"
                  >
                    🔊 Speak
                  </button>
                  <button
                    className={`btn-learned ${learnedSymbols.includes(symbol.symbol) ? 'learned' : ''}`}
                    onClick={() => handleLearnSymbol(symbol)}
                    disabled={learnedSymbols.includes(symbol.symbol)}
                  >
                    {learnedSymbols.includes(symbol.symbol) ? '✓ Learned' : 'Mark as Learned'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}
        </section>

        {/* Encouragement Section */}
        {learnedSymbols.length > 0 && (
          <section className="encouragement-section">
            <img src={fruitHappy} alt="Great job" className="encouragement-icon" />
            <p className="encouragement-text">
              {learnedSymbols.length < 5 ? "Great start! Keep learning!" :
               learnedSymbols.length < 10 ? "Excellent progress! You're doing amazing!" :
               learnedSymbols.length < allSymbols.length ? "Outstanding work! Almost there!" :
               "🎉 Congratulations! You've mastered all symbols!"}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

export default LearnPage;
