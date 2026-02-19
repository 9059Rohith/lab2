import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { speakOnPageLoad } from '../utils/voiceService';
import './AboutPage.css';

function AboutPage({ voiceEnabled }) {
  const location = useLocation();

  useEffect(() => {
    if (voiceEnabled) {
      speakOnPageLoad(location.pathname, voiceEnabled);
    }
  }, [voiceEnabled, location.pathname]);

  const features = [
    {
      icon: '🎨',
      title: 'Visual Learning',
      description: 'Colorful symbols and space-themed design make learning fun and engaging!'
    },
    {
      icon: '🔊',
      title: 'Audio Support',
      description: 'Hear every symbol pronounced clearly to support multi-sensory learning!'
    },
    {
      icon: '🎮',
      title: 'Interactive Games',
      description: 'Play exciting games to practice and reinforce what you learn!'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Watch your progress grow as you learn more symbols!'
    },
    {
      icon: '🌟',
      title: 'Rewards & Achievements',
      description: 'Earn badges and celebrate your learning milestones!'
    },
    {
      icon: '👨‍👩‍👧',
      title: 'Parent-Friendly',
      description: 'Safe, ad-free environment designed specifically for kids!'
    }
  ];

  const benefits = [
    {
      title: 'For Children with Autism',
      points: [
        'Visual learning style perfectly suited for autism education',
        'Predictable and consistent interface reduces anxiety',
        'Self-paced learning allows comfortable progression',
        'Clear, simple design minimizes sensory overload',
        'Repetitive practice reinforces memory and retention',
        'Positive reinforcement builds confidence'
      ]
    },
    {
      title: 'For Parents & Educators',
      points: [
        'Track learning progress and achievements',
        'Safe and controlled learning environment',
        'Evidence-based educational approach',
        'Engaging content keeps children motivated',
        'Accessible on multiple devices',
        'Supports independent learning'
      ]
    }
  ];

  return (
    <div className="about-page">
      <div className="about-header">
        <h1 className="page-title">
          <span className="title-icon">ℹ️</span>
          About Star Math Explorer
          <span className="title-icon">🌟</span>
        </h1>
        <p className="page-subtitle">
          A Space Adventure for Learning Math Symbols
        </p>
      </div>

      {/* Mission Statement */}
      <div className="about-section">
        <div className="card mission-card">
          <h2>Our Mission 🚀</h2>
          <p className="mission-text">
            Star Math Explorer is designed specifically for children with Autism Spectrum Disorder (ASD) 
            to make learning math symbols fun, engaging, and accessible. We believe every child deserves 
            the opportunity to explore the wonderful world of mathematics at their own pace, in a safe and 
            supportive environment.
          </p>
          <p className="mission-text">
            Through space-themed adventures, interactive games, and visual learning, we help children 
            build confidence, master essential math concepts, and develop a love for learning that will 
            last a lifetime.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="about-section">
        <h2 className="section-title">Amazing Features ✨</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="about-section">
        <h2 className="section-title">Who Benefits? 💝</h2>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <h3>{benefit.title}</h3>
              <ul className="benefit-list">
                {benefit.points.map((point, idx) => (
                  <li key={idx}>
                    <span className="checkmark">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Educational Approach */}
      <div className="about-section">
        <div className="card approach-card">
          <h2>Our Educational Approach 📚</h2>
          <div className="approach-content">
            <div className="approach-item">
              <h3>🎯 Evidence-Based Design</h3>
              <p>
                Built on research in autism education, cognitive science, and special education best practices.
              </p>
            </div>
            <div className="approach-item">
              <h3>🧩 Multi-Sensory Learning</h3>
              <p>
                Combines visual symbols, audio pronunciation, and interactive elements for comprehensive learning.
              </p>
            </div>
            <div className="approach-item">
              <h3>🔄 Repetition & Reinforcement</h3>
              <p>
                Allows unlimited practice and repetition, crucial for memory retention and mastery.
              </p>
            </div>
            <div className="approach-item">
              <h3>⭐ Positive Psychology</h3>
              <p>
                Focuses on achievements, rewards, and encouragement to build confidence and motivation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology */}
      <div className="about-section">
        <div className="card tech-card">
          <h2>Built With Love & Modern Technology 💻</h2>
          <p>
            Star Math Explorer is built using cutting-edge web technologies to ensure a smooth, 
            fast, and reliable experience:
          </p>
          <div className="tech-stack">
            <div className="tech-item">
              <span className="tech-icon">⚛️</span>
              <span className="tech-name">React</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">🎨</span>
              <span className="tech-name">CSS3</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">📱</span>
              <span className="tech-name">Responsive Design</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">🔊</span>
              <span className="tech-name">Web Speech API</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">⚡</span>
              <span className="tech-name">Vite</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">🗄️</span>
              <span className="tech-name">MongoDB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact/Support */}
      <div className="about-section">
        <div className="card contact-card">
          <h2>Get In Touch 📧</h2>
          <p>
            We love hearing from parents, educators, and children using Star Math Explorer! 
            Whether you have questions, feedback, or just want to share your learning journey, 
            we're here to help.
          </p>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <span>Email: support@starmathexplorer.com</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">🌐</span>
              <span>GitHub: github.com/9059Rohith/lab2</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">🎓</span>
              <span>Institution: Amrita Vishwa Vidyapeetham</span>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="about-section">
        <div className="cta-card">
          <h2>Ready to Start Your Space Adventure? 🚀</h2>
          <p>Join thousands of children exploring the amazing world of math!</p>
          <div className="cta-buttons">
            <a href="/learn" className="btn-primary">Start Learning</a>
            <a href="/activities" className="btn-secondary">Play Games</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
