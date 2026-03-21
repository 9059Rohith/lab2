import { Link, NavLink } from 'react-router-dom';

export default function Navbar({ totalPoints }) {
  return (
    <header className="nav-shell">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="brand-star">✦</span>
          <span>Symbol Galaxy</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/games">Games</NavLink>
          <NavLink to="/symbols">Symbols Grid</NavLink>
          <NavLink to="/profile">👤 Profile</NavLink>
          <NavLink to="/chat" className="ai-tutor-link">AI Tutor</NavLink>
          <NavLink to="/rewards">Rewards</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>

        <div className="points-pill">⭐ {totalPoints} pts</div>
      </div>
    </header>
  );
}
