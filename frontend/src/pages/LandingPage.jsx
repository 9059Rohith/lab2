import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { speakOnPageLoad, speakOnHover } from '../utils/voiceService';
import rocket from '../assets/rocket.png';
import earth from '../assets/earth.png';
import moon from '../assets/moon.png';
import saturn from '../assets/saturn.png';
import './LandingPage.css';

function LandingPage({ voiceEnabled }) {
  const location = useLocation();

  useEffect(() => {
    if (voiceEnabled) {
      speakOnPageLoad(location.pathname, voiceEnabled);
    }
  }, [voiceEnabled]);

  const buttons = [
    {
      to: '/learn',
      icon: '🚀',
      label: 'Start Learning',
      voice: 'Click to start learning amazing math symbols!',
      color: 'blue'
    },
    {
      to: '/activities',
      icon: '🌟',
      label: 'Play Activities',
      voice: 'Click to play fun space games!',
      color: 'gold'
    },
    {
      to: '/progress',
      icon: '📊',
      label: 'My Progress',
      voice: 'Click to see your space journey!',
      color: 'pink'
    },
    {
      to: '/about',
      icon: '👨‍👩‍👧',
      label: 'About Us',
      voice: 'Click to learn about this app!',
      color: 'green'
    }
  ];

  const floatingSymbols = ['➕', '➖', '✖️', '➗', '=', '∑', 'π', '∞', '√', '²'];

  return (
    <div className="landing-page">
      {/* Floating Planets */}
      <img src={earth} alt="Earth" className="floating-planet earth" />
      <img src={moon} alt="Moon" className="floating-planet moon" />
      <img src={saturn} alt="Saturn" className="floating-planet saturn" />
      <img src={rocket} alt="Rocket" className="floating-rocket" />

      {/* Floating Math Symbols */}
      {floatingSymbols.map((symbol, index) => (
        <div
          key={index}
          className="floating-symbol"
          style={{
            left: `${10 + (index * 9)}%`,
            top: `${20 + (index % 3) * 25}%`,
            animationDelay: `${index * 0.5}s`
          }}
        >
          {symbol}
        </div>
      ))}

      {/* Main Content */}
      <div className="landing-content">
        <h1 className="main-title">
          <span className="title-icon">🚀</span>
          STAR MATH EXPLORER
          <span className="title-icon">🌟</span>
        </h1>
        
        <p className="main-subtitle">
          A Space Adventure for Amazing Kids
        </p>

        <div className="buttons-grid">
          {buttons.map((button, index) => (
            <Link
              key={index}
              to={button.to}
              className={`landing-button ${button.color}`}
              onMouseEnter={() => voiceEnabled && speakOnHover(button.voice)}
            >
              <span className="button-icon">{button.icon}</span>
              <span className="button-label">{button.label}</span>
            </Link>
          ))}
        </div>

        <div className="welcome-message">
          <p className="message-text">
            🌌 Welcome, Space Explorer! Your math adventure awaits! 🌌
          </p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
