import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { speakOnPageLoad } from '../utils/voiceService';
import './TeamPage.css';

function TeamPage({ voiceEnabled }) {
  const location = useLocation();

  useEffect(() => {
    if (voiceEnabled) {
      speakOnPageLoad(location.pathname, voiceEnabled);
    }
  }, [voiceEnabled, location.pathname]);

  const developer = {
    name: 'Rohith Kumar',
    role: 'Full Stack Developer & Creator',
    rollNo: 'CB.SC.U4CSE23018',
    department: 'CSE-A',
    institution: 'Amrita Vishwa Vidyapeetham',
    location: 'Coimbatore',
    avatar: '👨‍💻',
    bio: 'Passionate about creating accessible educational technology for children with special needs. Dedicated to making learning fun, engaging, and inclusive for all children.',
    skills: ['React', 'Node.js', 'MongoDB', 'UI/UX Design', 'Educational Technology'],
    github: 'https://github.com/9059Rohith/lab2',
    email: 'rohithkumar@example.com'
  };

  const advisor = {
    name: 'Dr. T. Senthil Kumar',
    role: 'Course Teacher & Project Advisor',
    designation: 'Professor',
    department: 'Amrita School of Computing',
    institution: 'Amrita Vishwa Vidyapeetham',
    location: 'Coimbatore - 641112',
    avatar: '👨‍🏫',
    bio: 'Experienced educator and researcher dedicated to guiding students in creating meaningful technology solutions.',
    email: 't_senthilkumar@cb.amrita.edu'
  };

  const specialThanks = [
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Parents & Families',
      description: 'For valuable feedback and support in developing this application'
    },
    {
      icon: '🧑‍🏫',
      title: 'Special Education Teachers',
      description: 'For sharing expertise and insights in autism education'
    },
    {
      icon: '🌟',
      title: 'Young Learners',
      description: 'For inspiring the development of accessible educational tools'
    },
    {
      icon: '🔬',
      title: 'Research Community',
      description: 'For providing evidence-based practices in autism education'
    }
  ];

  return (
    <div className="team-page">
      <div className="team-header">
        <h1 className="page-title">Project Team</h1>
        <p className="page-subtitle">
          Development and Academic Information
        </p>
      </div>

      {/* Developer Section */}
      <div className="team-section">
        <div className="team-member-card main-card">
          <div className="member-avatar">{developer.avatar}</div>
          <div className="member-info">
            <h2>{developer.name}</h2>
            <div className="member-role">{developer.role}</div>
            <div className="member-details">
              <div className="detail-item">
                <span className="detail-icon">🎓</span>
                <span>Roll No: {developer.rollNo}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📚</span>
                <span>Department: {developer.department}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🏛️</span>
                <span>{developer.institution}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <span>{developer.location}</span>
              </div>
            </div>
            <p className="member-bio">{developer.bio}</p>
            <div className="member-skills">
              {developer.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
            <div className="member-links">
              <a href={developer.github} target="_blank" rel="noopener noreferrer" className="link-button">
                <span className="link-icon">🔗</span>
                GitHub Repository
              </a>
              <a href={`mailto:${developer.email}`} className="link-button">
                <span className="link-icon">✉️</span>
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Advisor Section */}
      <div className="team-section">
        <h2 className="section-title">Project Guidance 🎓</h2>
        <div className="team-member-card advisor-card">
          <div className="member-avatar">{advisor.avatar}</div>
          <div className="member-info">
            <h2>{advisor.name}</h2>
            <div className="member-role">{advisor.role}</div>
            <div className="member-details">
              <div className="detail-item">
                <span className="detail-icon">👔</span>
                <span>{advisor.designation}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🏫</span>
                <span>{advisor.department}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🏛️</span>
                <span>{advisor.institution}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <span>{advisor.location}</span>
              </div>
            </div>
            <p className="member-bio">{advisor.bio}</p>
            <div className="member-links">
              <a href={`mailto:${advisor.email}`} className="link-button">
                <span className="link-icon">✉️</span>
                {advisor.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Special Thanks Section */}
      <div className="team-section">
        <h2 className="section-title">Special Thanks 💝</h2>
        <div className="thanks-grid">
          {specialThanks.map((item, index) => (
            <div key={index} className="thanks-card">
              <div className="thanks-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Project Info */}
      <div className="team-section">
        <div className="project-info-card">
          <h2>About This Project 🚀</h2>
          <div className="project-details">
            <div className="project-item">
              <h3>🎯 Purpose</h3>
              <p>
                Star Math Explorer is an educational web application designed specifically for children 
                with Autism Spectrum Disorder (ASD) to learn math symbols in an engaging, interactive, 
                and accessible way.
              </p>
            </div>
            <div className="project-item">
              <h3>💡 Vision</h3>
              <p>
                To create inclusive educational technology that empowers every child to learn at their 
                own pace, celebrate their achievements, and develop confidence in their mathematical abilities.
              </p>
            </div>
            <div className="project-item">
              <h3>🌟 Impact</h3>
              <p>
                Making math education accessible, enjoyable, and effective for children with special needs, 
                while supporting parents and educators with valuable learning tools and progress tracking.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Join Us Section */}
      <div className="team-section">
        <div className="join-card">
          <h2>Want to Contribute? 🤝</h2>
          <p>
            We welcome contributions, feedback, and collaboration from educators, developers, 
            and anyone passionate about accessible education!
          </p>
          <div className="join-buttons">
            <a href={developer.github} target="_blank" rel="noopener noreferrer" className="btn-contribute">
              <span className="btn-icon">💻</span>
              Contribute on GitHub
            </a>
            <a href={`mailto:${developer.email}`} className="btn-feedback">
              <span className="btn-icon">💬</span>
              Send Feedback
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamPage;
