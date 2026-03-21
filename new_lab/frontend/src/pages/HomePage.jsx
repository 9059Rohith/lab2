import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';

export default function HomePage() {
  return (
    <section className="page-wrap">
      <AnimatedBackground />
      <div className="hero-grid">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="kicker">Inclusive Learning For Autism Kids</p>
          <h1>Learn Math Symbols With Play, Voice, and Joy</h1>
          <p>
            A beautiful, sensory-friendly learning world with five interactive games,
            live AI tutor support, and rewards that celebrate every win.
          </p>
          <div className="hero-actions">
            <Link to="/games" className="btn btn-primary">Play Games</Link>
            <Link to="/chat" className="btn btn-ghost">Ask AI Tutor</Link>
          </div>
        </motion.div>

        <motion.div
          className="hero-art"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img src="/image/blue_rocket_logo_stellar.png" alt="Symbol learning rocket" />
        </motion.div>
      </div>

      <div className="card-grid">
        <article className="info-card"><h3>5 Symbol Games</h3><p>Each game teaches core math symbols in a creative way.</p></article>
        <article className="info-card"><h3>Voice Guidance</h3><p>Speech helps kids understand prompts and feedback clearly.</p></article>
        <article className="info-card"><h3>AI Tutor</h3><p>Ask questions any time and get calm, simple explanations.</p></article>
        <article className="info-card"><h3>Rewards</h3><p>Points, stars, and progress history keep learning motivating.</p></article>
      </div>
    </section>
  );
}
