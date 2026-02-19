import { useState } from 'react';
import { stopSpeaking } from '../utils/voiceService';
import './VoiceToggle.css';

function VoiceToggle({ voiceEnabled, setVoiceEnabled }) {
  const toggleVoice = () => {
    if (voiceEnabled) {
      stopSpeaking();
    }
    setVoiceEnabled(!voiceEnabled);
  };

  return (
    <button 
      className={`voice-toggle ${voiceEnabled ? 'active' : 'muted'}`}
      onClick={toggleVoice}
      aria-label={voiceEnabled ? 'Mute voice' : 'Unmute voice'}
    >
      <span className="voice-icon">
        {voiceEnabled ? '🔊' : '🔇'}
      </span>
      <span className="voice-text">
        {voiceEnabled ? 'Voice ON' : 'Voice OFF'}
      </span>
    </button>
  );
}

export default VoiceToggle;
