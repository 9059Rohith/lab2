// Voice Navigation Service for Autism-Friendly Text-to-Speech

let speechSynthesis = null;
let currentUtterance = null;

if (typeof window !== 'undefined') {
  speechSynthesis = window.speechSynthesis;
}

// Voice configuration - autism friendly
const voiceConfig = {
  rate: 0.8,        // Slower for clarity
  pitch: 1.2,       // Slightly higher, friendly
  volume: 1.0,
  lang: 'en-GB'     // British English for warm tone
};

// Page-specific welcome messages
export const pageVoices = {
  '/': `Welcome to Star Math Explorer! 
        I am your space guide Nova. 
        This is your home base. 
        You can start learning, do fun activities, 
        check your progress, or learn about us. 
        Click any big button to begin!`,

  '/learn': `Welcome to the Math Symbol Lab! 
             Here you will learn amazing math symbols. 
             Each card shows you a symbol with pictures. 
             Press the speak button to hear about each symbol. 
             Press the star button when you learn it!`,

  '/activities': `Welcome to Space Activities! 
                  Here you can play fun math games. 
                  There is no hurry. Take your time. 
                  Every answer is a chance to learn. 
                  You are a star explorer!`,

  '/progress': `Welcome to your Progress Page! 
                Fill in your name and details. 
                We will save your space journey. 
                Your parent can help you fill the form. 
                Press any box and I will tell you what to type!`,

  '/about': `Welcome to the About Page! 
             Here you can learn about Star Math Explorer. 
             You can see who made this app. 
             And learn about our amazing teachers!`,

  '/team': `Meet the team! 
            These are the people who built this app for you. 
            They want you to learn and have fun!`
};

// Speak text function
export const speakText = (text, options = {}) => {
  if (!speechSynthesis) return;

  // Cancel any ongoing speech
  stopSpeaking();

  // Create utterance
  currentUtterance = new SpeechSynthesisUtterance(text);
  
  // Apply voice config
  currentUtterance.rate = options.rate || voiceConfig.rate;
  currentUtterance.pitch = options.pitch || voiceConfig.pitch;
  currentUtterance.volume = options.volume || voiceConfig.volume;
  currentUtterance.lang = options.lang || voiceConfig.lang;

  // Try to use a female voice if available
  const voices = speechSynthesis.getVoices();
  const femaleVoice = voices.find(voice => 
    voice.name.includes('Female') || 
    voice.name.includes('Google UK') ||
    voice.name.includes('Samantha')
  );
  
  if (femaleVoice) {
    currentUtterance.voice = femaleVoice;
  }

  // Speak
  speechSynthesis.speak(currentUtterance);
};

// Stop speaking
export const stopSpeaking = () => {
  if (speechSynthesis) {
    speechSynthesis.cancel();
  }
};

// Speak on page load
export const speakOnPageLoad = (pathname, voiceEnabled = true) => {
  if (!voiceEnabled) return;
  
  const message = pageVoices[pathname] || pageVoices['/'];
  
  // Delay slightly to ensure page is loaded
  setTimeout(() => {
    speakText(message);
  }, 500);
};

// Speak symbol information
export const speakSymbol = (symbol, name, description) => {
  const text = `${name}. ${description}`;
  speakText(text);
};

// Speak on hover
export const speakOnHover = (text) => {
  speakText(text, { rate: 0.9 });
};

// Speak celebration
export const speakCelebration = () => {
  const celebrations = [
    'Great job! You are amazing!',
    'Wonderful! You learned it!',
    'Fantastic work, star explorer!',
    'You are a super star!',
    'Excellent! Keep going!'
  ];
  
  const random = Math.floor(Math.random() * celebrations.length);
  speakText(celebrations[random], { pitch: 1.4 });
};

// Speak encouragement
export const speakEncouragement = () => {
  const encouragements = [
    'Try again! You can do it!',
    'That is okay! Let us try once more!',
    'No worries! Every try helps you learn!',
    'You are doing great! Try again!'
  ];
  
  const random = Math.floor(Math.random() * encouragements.length);
  speakText(encouragements[random]);
};

export default {
  speakText,
  stopSpeaking,
  speakOnPageLoad,
  speakSymbol,
  speakOnHover,
  speakCelebration,
  speakEncouragement,
  pageVoices
};
