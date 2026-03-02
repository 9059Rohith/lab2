import { useState, useEffect } from 'react';
import './SensorySettings.css';

function SensorySettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    animationSpeed: localStorage.getItem('animationSpeed') || 'normal',
    soundEnabled: localStorage.getItem('soundEnabled') !== 'false',
    visualComplexity: localStorage.getItem('visualComplexity') || 'normal',
    highContrast: localStorage.getItem('highContrast') === 'true'
  });

  const applySettings = (newSettings) => {
    const root = document.documentElement;
    
    // Animation speed
    if (newSettings.animationSpeed === 'slow') {
      root.style.setProperty('--animation-multiplier', '2');
    } else if (newSettings.animationSpeed === 'off') {
      root.style.setProperty('--animation-multiplier', '0');
    } else {
      root.style.setProperty('--animation-multiplier', '1');
    }

    // Visual complexity
    if (newSettings.visualComplexity === 'simple') {
      root.classList.add('simple-mode');
    } else {
      root.classList.remove('simple-mode');
    }

    // High contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast-mode');
    } else {
      root.classList.remove('high-contrast-mode');
    }

    // Save to localStorage
    Object.keys(newSettings).forEach(key => {
      localStorage.setItem(key, newSettings[key]);
    });
  };

  useEffect(() => {
    // Apply settings to document
    applySettings(settings);
  }, [settings]);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
  };

  return (
    <>
      <button 
        className="sensory-settings-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Sensory Settings"
      >
        ⚙️
      </button>

      {isOpen && (
        <div className="sensory-settings-overlay" onClick={() => setIsOpen(false)}>
          <div className="sensory-settings-panel" onClick={(e) => e.stopPropagation()}>
            <div className="settings-header">
              <h2>🌟 Comfort Settings</h2>
              <button 
                className="close-button"
                onClick={() => setIsOpen(false)}
                aria-label="Close settings"
              >
                ✕
              </button>
            </div>

            <div className="settings-content">
              {/* Animation Speed */}
              <div className="setting-group">
                <label className="setting-label">
                  <span className="label-icon">🎬</span>
                  Animation Speed
                </label>
                <div className="setting-options">
                  <button
                    className={`setting-btn ${settings.animationSpeed === 'normal' ? 'active' : ''}`}
                    onClick={() => updateSetting('animationSpeed', 'normal')}
                  >
                    Normal
                  </button>
                  <button
                    className={`setting-btn ${settings.animationSpeed === 'slow' ? 'active' : ''}`}
                    onClick={() => updateSetting('animationSpeed', 'slow')}
                  >
                    Slow
                  </button>
                  <button
                    className={`setting-btn ${settings.animationSpeed === 'off' ? 'active' : ''}`}
                    onClick={() => updateSetting('animationSpeed', 'off')}
                  >
                    Off
                  </button>
                </div>
              </div>

              {/* Sound */}
              <div className="setting-group">
                <label className="setting-label">
                  <span className="label-icon">🔊</span>
                  Voice & Sounds
                </label>
                <div className="setting-toggle">
                  <button
                    className={`toggle-btn ${settings.soundEnabled ? 'active' : ''}`}
                    onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                  >
                    {settings.soundEnabled ? '✓ On' : '✕ Off'}
                  </button>
                </div>
              </div>

              {/* Visual Complexity */}
              <div className="setting-group">
                <label className="setting-label">
                  <span className="label-icon">👁️</span>
                  Visual Detail
                </label>
                <div className="setting-options">
                  <button
                    className={`setting-btn ${settings.visualComplexity === 'normal' ? 'active' : ''}`}
                    onClick={() => updateSetting('visualComplexity', 'normal')}
                  >
                    Normal
                  </button>
                  <button
                    className={`setting-btn ${settings.visualComplexity === 'simple' ? 'active' : ''}`}
                    onClick={() => updateSetting('visualComplexity', 'simple')}
                  >
                    Simple
                  </button>
                </div>
              </div>

              {/* High Contrast */}
              <div className="setting-group">
                <label className="setting-label">
                  <span className="label-icon">🌓</span>
                  High Contrast
                </label>
                <div className="setting-toggle">
                  <button
                    className={`toggle-btn ${settings.highContrast ? 'active' : ''}`}
                    onClick={() => updateSetting('highContrast', !settings.highContrast)}
                  >
                    {settings.highContrast ? '✓ On' : '✕ Off'}
                  </button>
                </div>
              </div>

              <p className="settings-note">
                💙 Adjust these settings to make your space journey more comfortable!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SensorySettings;
