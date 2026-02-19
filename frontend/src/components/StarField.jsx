import { useEffect } from 'react';
import './StarField.css';

function StarField() {
  useEffect(() => {
    // Create stars dynamically
    const starFieldContainer = document.querySelector('.star-field');
    if (!starFieldContainer) return;

    // Create multiple layers of stars
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Random position
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      // Random size
      const size = Math.random() * 3 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // Random animation delay
      star.style.animationDelay = `${Math.random() * 3}s`;
      star.style.animationDuration = `${Math.random() * 2 + 2}s`;
      
      starFieldContainer.appendChild(star);
    }
  }, []);

  return (
    <div className="star-field-wrapper">
      <div className="star-field"></div>
      <div className="space-gradient"></div>
    </div>
  );
}

export default StarField;
