import { Link, useLocation } from 'react-router-dom';
import { speakOnHover } from '../utils/voiceService';
import rocketLogo from '../assets/blue_rocket_logo_stellar.png';
import './Navigation.css';

function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home', voice: 'Home page - your starting point!' },
    { path: '/learn', icon: '📚', label: 'Learn', voice: 'Learn math symbols!' },
    { path: '/activities', icon: '🎮', label: 'Activities', voice: 'Fun space games!' },
    { path: '/progress', icon: '📊', label: 'Progress', voice: 'Track your journey!' },
    { path: '/about', icon: 'ℹ️', label: 'About', voice: 'About this app!' },
    { path: '/team', icon: '👥', label: 'Team', voice: 'Meet the team!' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src={rocketLogo} alt="Star Math Explorer Logo" className="logo-img" />
          <span className="nav-title">STAR MATH EXPLORER</span>
        </Link>
        
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onMouseEnter={() => speakOnHover(item.voice)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
