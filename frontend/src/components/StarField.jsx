import { useEffect } from 'react';
import './StarField.css';

function StarField() {
  useEffect(() => {
    // Create static stars with minimal animation
    const starFieldContainer = document.querySelector('.star-field');
    if (!starFieldContainer) return;

    // Create fewer, subtler stars
    for (let i = 0; i < 50; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Random position
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      // Smaller, more subtle stars
      const size = Math.random() * 2 + 0.5;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.opacity = Math.random() * 0.4 + 0.3;
      
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
