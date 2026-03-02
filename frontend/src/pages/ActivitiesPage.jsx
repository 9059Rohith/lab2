import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { speakOnPageLoad, speakText } from '../utils/voiceService';
import { getAllSymbols } from '../data/symbolsData';
import './ActivitiesPage.css';

// Import educational assets
import chefKid from '../assets/chef_kid.png';
import huskyPlaying from '../assets/huskey_playing_with_ball.png';
import jokerLooking from '../assets/joker_seeing_up.png';
import manDancing from '../assets/man_dancing.png';
import guitarPerson from '../assets/person_playing_guitar.png';
import greenCrystal from '../assets/green_crystal.png';
import purpleCrystal from '../assets/purple crystal.png';
import blueCrystal from '../assets/blue_crystal.png';

function ActivitiesPage({ voiceEnabled }) {
  const location = useLocation();
  const [currentGame, setCurrentGame] = useState(null);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (voiceEnabled) {
      speakOnPageLoad(location.pathname, voiceEnabled);
    }
  }, [voiceEnabled, location.pathname]);

  // Quiz Game Logic
  const generateQuizQuestion = () => {
    const allSymbols = getAllSymbols();
    const correctSymbol = allSymbols[Math.floor(Math.random() * allSymbols.length)];
    const wrongSymbols = allSymbols.filter(s => s.symbol !== correctSymbol.symbol);
    const shuffledWrong = wrongSymbols.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [correctSymbol, ...shuffledWrong].sort(() => Math.random() - 0.5);

    setQuestion({
      type: 'identify',
      correctSymbol,
      options,
      question: `What is this symbol? ${correctSymbol.symbol}`
    });
  };

  const handleStartGame = (game) => {
    setCurrentGame(game);
    setGameStarted(true);
    setScore(0);
    setFeedback('');
    if (game === 'quiz') {
      generateQuizQuestion();
    } else if (game === 'memory') {
      initializeMemoryGame();
    } else if (game === 'match') {
      initializeMatchGame();
    }
  };

  const handleQuizAnswer = (answer) => {
    setSelectedAnswer(answer);
    if (answer.symbol === question.correctSymbol.symbol) {
      setFeedback('Correct! Well done.');
      setScore(score + 10);
      if (voiceEnabled) {
        speakText('Correct! Well done.');
      }
    } else {
      setFeedback(`Incorrect. That is ${answer.name}. The correct answer is ${question.correctSymbol.name}`);
      if (voiceEnabled) {
        speakText(`Incorrect. The correct answer is ${question.correctSymbol.name}`);
      }
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setFeedback('');
      generateQuizQuestion();
    }, 3000);
  };

  // Memory Game Logic
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);

  const initializeMemoryGame = () => {
    const allSymbols = getAllSymbols();
    const selectedSymbols = allSymbols.sort(() => Math.random() - 0.5).slice(0, 6);
    const cards = [...selectedSymbols, ...selectedSymbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ ...symbol, id: index }));
    setMemoryCards(cards);
    setFlippedCards([]);
    setMatchedCards([]);
  };

  const handleMemoryCardClick = (card) => {
    if (flippedCards.length === 2 || flippedCards.includes(card.id) || matchedCards.includes(card.symbol)) {
      return;
    }

    const newFlipped = [...flippedCards, card.id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const card1 = memoryCards.find(c => c.id === newFlipped[0]);
      const card2 = memoryCards.find(c => c.id === newFlipped[1]);

      if (card1.symbol === card2.symbol) {
        setMatchedCards([...matchedCards, card1.symbol]);
        setScore(score + 20);
        setFlippedCards([]);
        if (voiceEnabled) {
          speakText('Match found!');
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Matching Game Logic
  const [matchPairs, setMatchPairs] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);

  const initializeMatchGame = () => {
    const allSymbols = getAllSymbols();
    const selectedSymbols = allSymbols.sort(() => Math.random() - 0.5).slice(0, 5);
    setMatchPairs(selectedSymbols);
    setMatchedPairs([]);
    setSelectedSymbol(null);
    setSelectedDescription(null);
  };

  const handleSymbolClick = (symbol) => {
    if (matchedPairs.includes(symbol.symbol)) return;
    setSelectedSymbol(symbol);
    if (selectedDescription && selectedDescription.symbol === symbol.symbol) {
      setMatchedPairs([...matchedPairs, symbol.symbol]);
      setScore(score + 15);
      setSelectedSymbol(null);
      setSelectedDescription(null);
      if (voiceEnabled) {
        speakText('Correct match!');
      }
    }
  };

  const handleDescriptionClick = (symbol) => {
    if (matchedPairs.includes(symbol.symbol)) return;
    setSelectedDescription(symbol);
    if (selectedSymbol && selectedSymbol.symbol === symbol.symbol) {
      setMatchedPairs([...matchedPairs, symbol.symbol]);
      setScore(score + 15);
      setSelectedSymbol(null);
      setSelectedDescription(null);
      if (voiceEnabled) {
        speakText('Correct match!');
      }
    }
  };

  const activities = [
    {
      id: 'quiz',
      title: 'Symbol Quiz',
      description: 'Test your knowledge by identifying mathematical symbols',
      image: chefKid,
      difficulty: 'Beginner'
    },
    {
      id: 'memory',
      title: 'Memory Match',
      description: 'Match pairs of symbols to strengthen recall',
      image: huskyPlaying,
      difficulty: 'Intermediate'
    },
    {
      id: 'match',
      title: 'Symbol Matching',
      description: 'Connect symbols with their correct descriptions',
      image: guitarPerson,
      difficulty: 'Intermediate'
    }
  ];

  if (!gameStarted) {
    return (
      <div className="activities-page">
        <div className="activities-header">
          <h1 className="page-title">Interactive Learning Activities</h1>
          <p className="page-description">
            Strengthen your understanding through educational exercises
          </p>
        </div>

        <div className="activities-grid">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-card">
              <div className="activity-image-container">
                <img src={activity.image} alt={activity.title} className="activity-image" />
              </div>
              <div className="activity-content">
                <h3 className="activity-title">{activity.title}</h3>
                <p className="activity-description">{activity.description}</p>
                <div className="activity-meta">
                  <span className="difficulty-badge">{activity.difficulty}</span>
                </div>
                <button
                  className="start-activity-btn"
                  onClick={() => handleStartGame(activity.id)}
                >
                  Start Activity
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="encouragement-section">
          <img src={manDancing} alt="Encouragement" className="encouragement-image" />
          <p className="encouragement-text">
            Practice makes perfect! Regular activities improve learning retention.
          </p>
        </div>
      </div>
    );
  }

  // Game screens
  if (currentGame === 'quiz' && question) {
    return (
      <div className="activities-page game-active">
        <div className="game-header">
          <h2 className="game-title">Symbol Quiz</h2>
          <div className="game-score">
            <img src={greenCrystal} alt="Score" className="score-icon" />
            <span>Score: {score}</span>
          </div>
          <button className="back-btn" onClick={() => setGameStarted(false)}>
            Return to Activities
          </button>
        </div>

        <div className="quiz-container">
          <div className="question-section">
            <h3 className="question-text">Identify this symbol:</h3>
            <div className="symbol-display">{question.correctSymbol.symbol}</div>
          </div>

          <div className="options-grid">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${selectedAnswer === option ? 'selected' : ''}`}
                onClick={() => handleQuizAnswer(option)}
                disabled={selectedAnswer !== null}
              >
                {option.name}
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`feedback-message ${feedback.includes('Correct') ? 'correct' : 'incorrect'}`}>
              {feedback}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentGame === 'memory') {
    return (
      <div className="activities-page game-active">
        <div className="game-header">
          <h2 className="game-title">Memory Match</h2>
          <div className="game-score">
            <img src={purpleCrystal} alt="Score" className="score-icon" />
            <span>Score: {score}</span>
          </div>
          <button className="back-btn" onClick={() => setGameStarted(false)}>
            Return to Activities
          </button>
        </div>

        <div className="memory-grid">
          {memoryCards.map((card) => (
            <div
              key={card.id}
              className={`memory-card ${
                flippedCards.includes(card.id) || matchedCards.includes(card.symbol)
                  ? 'flipped'
                  : ''
              }`}
              onClick={() => handleMemoryCardClick(card)}
            >
              <div className="card-front">?</div>
              <div className="card-back">
                <span className="card-symbol">{card.symbol}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (currentGame === 'match') {
    return (
      <div className="activities-page game-active">
        <div className="game-header">
          <h2 className="game-title">Symbol Matching</h2>
          <div className="game-score">
            <img src={blueCrystal} alt="Score" className="score-icon" />
            <span>Score: {score}</span>
          </div>
          <button className="back-btn" onClick={() => setGameStarted(false)}>
            Return to Activities
          </button>
        </div>

        <div className="match-container">
          <div className="match-column">
            <h3>Symbols</h3>
            {matchPairs.map((pair, index) => (
              <button
                key={index}
                className={`match-item ${
                  selectedSymbol === pair ? 'selected' : ''
                } ${matchedPairs.includes(pair.symbol) ? 'matched' : ''}`}
                onClick={() => handleSymbolClick(pair)}
                disabled={matchedPairs.includes(pair.symbol)}
              >
                <span className="match-symbol">{pair.symbol}</span>
              </button>
            ))}
          </div>

          <div className="match-column">
            <h3>Descriptions</h3>
            {matchPairs.map((pair, index) => (
              <button
                key={index}
                className={`match-item ${
                  selectedDescription === pair ? 'selected' : ''
                } ${matchedPairs.includes(pair.symbol) ? 'matched' : ''}`}
                onClick={() => handleDescriptionClick(pair)}
                disabled={matchedPairs.includes(pair.symbol)}
              >
                {pair.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default ActivitiesPage;
