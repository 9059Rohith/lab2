import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { speakOnPageLoad, speakOnHover } from '../utils/voiceService';
import apiClient from '../utils/apiClient';
import rocketLogo from '../assets/blue_rocket_logo_stellar.png';
import blueCrystal from '../assets/blue_crystal.png';
import greenCrystal from '../assets/green_crystal.png';
import purpleCrystal from '../assets/purple crystal.png';
import superCrystal from '../assets/super_main_crystal.png';
import AssetShowcase from '../components/AssetShowcase';
import './LandingPage.css';

function LandingPage({ voiceEnabled }) {
  const location = useLocation();
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    if (voiceEnabled) {
      speakOnPageLoad(location.pathname, voiceEnabled);
    }
  }, [voiceEnabled, location.pathname]);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await apiClient.get('/health');
        setApiStatus(response.data?.status === 'ok' ? 'online' : 'offline');
      } catch {
        setApiStatus('offline');
      }
    };

    checkBackend();
  }, []);

  const navigationCards = [
    {
      to: '/learn',
      icon: blueCrystal,
      title: 'Mathematical Symbols',
      description: 'Learn fundamental math symbols and their meanings',
      voice: 'Click to start learning mathematical symbols',
    },
    {
      to: '/activities',
      icon: greenCrystal,
      title: 'Interactive Practice',
      description: 'Practice with interactive exercises and activities',
      voice: 'Click to access practice activities',
    },
    {
      to: '/progress',
      icon: purpleCrystal,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey and achievements',
      voice: 'Click to view your progress',
    },
    {
      to: '/about',
      icon: superCrystal,
      title: 'About This Portal',
      description: 'Learn more about our educational approach',
      voice: 'Click to learn about this portal',
    }
  ];

  return (
    <div className="landing-page">
      <div className="landing-container">
        {/* Header Section */}
        <header className="landing-header">
          <div className="logo-section">
            <img src={rocketLogo} alt="Star Math Explorer Logo" className="main-logo" />
          </div>
          <h1 className="portal-title">Star Math Explorer</h1>
          <p className="portal-subtitle">
            An Educational Portal for Mathematical Symbol Learning
          </p>
          <div className={`api-status ${apiStatus}`}>
            Backend Status: {apiStatus === 'checking' ? 'Checking...' : apiStatus === 'online' ? 'Connected' : 'Offline'}
          </div>
          <div className="portal-description">
            <p>Designed specifically for children with autism spectrum disorder to learn mathematical concepts through structured, visual learning experiences.</p>
          </div>
          <div className="landing-marquee" aria-label="learning highlights">
            <div className="landing-marquee-track">
              <span>27+ math symbols</span>
              <span>voice support</span>
              <span>progress tracking</span>
              <span>rocket game</span>
              <span>memory and quiz activities</span>
              <span>calm visual mode</span>
            </div>
          </div>
        </header>

        {/* Navigation Cards */}
        <section className="navigation-section">
          <h2 className="section-title">Learning Portal</h2>
          <div className="nav-cards-grid">
            {navigationCards.map((card, index) => (
              <Link
                key={index}
                to={card.to}
                className="nav-card"
                onMouseEnter={() => voiceEnabled && speakOnHover(card.voice)}
              >
                <div className="card-icon-wrapper">
                  <img src={card.icon} alt={card.title} className="card-icon" />
                </div>
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.description}</p>
                <span className="card-arrow">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title">Portal Features</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-number">01</div>
              <h3>Visual Learning</h3>
              <p>Color-coded symbols and structured layouts designed for visual processing strengths</p>
            </div>
            <div className="feature-item">
              <div className="feature-number">02</div>
              <h3>Audio Support</h3>
              <p>Optional text-to-speech functionality for multi-sensory learning experiences</p>
            </div>
            <div className="feature-item">
              <div className="feature-number">03</div>
              <h3>Self-Paced</h3>
              <p>Learn at your own comfortable pace without time pressures or constraints</p>
            </div>
            <div className="feature-item">
              <div className="feature-number">04</div>
              <h3>Progress Tracking</h3>
              <p>Monitor learning journey with detailed analytics and achievement milestones</p>
            </div>
          </div>
          <div className="games-cta-wrap">
            <Link to="/rocket-game" className="games-cta-btn">
              Launch Rocket Game
            </Link>
          </div>
        </section>

        <AssetShowcase />

        {/* Information Section */}
        <footer className="landing-footer">
          <p className="footer-text">
            This portal is designed using evidence-based pedagogical strategies<br />
            for children with autism spectrum disorder.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;
