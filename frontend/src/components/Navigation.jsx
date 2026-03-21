import { Link, useLocation } from 'react-router-dom';
import { speakOnHover } from '../utils/voiceService';
import rocketLogo from '../assets/blue_rocket_logo_stellar.png';
import './Navigation.css';

function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', voice: 'Home page' },
    { path: '/learn', label: 'Learn', voice: 'Learn math symbols' },
    { path: '/activities', label: 'Activities', voice: 'Interactive activities' },
    { path: '/rocket-game', label: 'Rocket Game', voice: 'Play rocket game' },
    { path: '/progress', label: 'Progress', voice: 'View progress' },
    { path: '/about', label: 'About', voice: 'About this application' },
    { path: '/team', label: 'Team', voice: 'Team information' }
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
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
