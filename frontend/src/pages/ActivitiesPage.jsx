import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { speakOnPageLoad, speakText } from '../utils/voiceService';
import { getAllSymbols } from '../data/symbolsData';
import './ActivitiesPage.css';

function ActivitiesPage({ voiceEnabled }) {
  const location = useLocation();
  const [currentGame, setCurrentGame] = useState('quiz');
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
      setFeedback('🎉 Excellent! You got it right!');
      setScore(score + 10);
      if (voiceEnabled) {
        speakText('Excellent! You got it right!');
      }
    } else {
      setFeedback(`❌ Not quite! That's ${answer.name}. The correct answer is ${question.correctSymbol.name}`);
      if (voiceEnabled) {
        speakText(`Not quite! The correct answer is ${question.correctSymbol.name}`);
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
          speakText('Great match!');
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
        speakText('Perfect match!');
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
        speakText('Perfect match!');
      }
    }
  };

  const GameSelector = () => (
    <div className="game-selector">
      <h2>Choose a Space Game! 🎮</h2>
      <div className="games-grid">
        <div className="game-card" onClick={() => handleStartGame('quiz')}>
          <div className="game-icon">❓</div>
          <h3>Symbol Quiz</h3>
          <p>Test your knowledge!</p>
        </div>
        <div className="game-card" onClick={() => handleStartGame('memory')}>
          <div className="game-icon">🧠</div>
          <h3>Memory Match</h3>
          <p>Find matching pairs!</p>
        </div>
        <div className="game-card" onClick={() => handleStartGame('match')}>
          <div className="game-icon">🔗</div>
          <h3>Match Game</h3>
          <p>Match symbols to descriptions!</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="activities-page">
      <div className="activities-header">
        <h1 className="page-title">
          <span className="title-icon">🎮</span>
          Space Activities
          <span className="title-icon">⭐</span>
        </h1>
        <div className="score-display">
          <span className="score-label">Score:</span>
          <span className="score-value">{score}</span>
          <span className="score-icon">🏆</span>
        </div>
      </div>

      {!gameStarted ? (
        <GameSelector />
      ) : (
        <div className="game-container">
          <button className="btn-back" onClick={() => setGameStarted(false)}>
            ← Back to Games
          </button>

          {currentGame === 'quiz' && question && (
            <div className="quiz-game">
              <div className="question-box">
                <h2>What is this symbol?</h2>
                <div className="question-symbol">{question.correctSymbol.symbol}</div>
              </div>
              <div className="options-grid">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-button ${
                      selectedAnswer?.symbol === option.symbol
                        ? option.symbol === question.correctSymbol.symbol
                          ? 'correct'
                          : 'incorrect'
                        : ''
                    }`}
                    onClick={() => !selectedAnswer && handleQuizAnswer(option)}
                    disabled={selectedAnswer !== null}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
              {feedback && (
                <div className={`feedback ${feedback.includes('❌') ? 'wrong' : 'right'}`}>
                  {feedback}
                </div>
              )}
            </div>
          )}

          {currentGame === 'memory' && (
            <div className="memory-game">
              <h2>Find Matching Pairs! 🧠</h2>
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
                    <div className="card-back" style={{ color: card.color }}>
                      {card.symbol}
                    </div>
                  </div>
                ))}
              </div>
              {matchedCards.length === 6 && (
                <div className="game-complete">
                  🎉 Congratulations! You matched all pairs! 🎉
                  <button className="btn-play-again" onClick={() => initializeMemoryGame()}>
                    Play Again
                  </button>
                </div>
              )}
            </div>
          )}

          {currentGame === 'match' && (
            <div className="match-game">
              <h2>Match Symbols with Descriptions! 🔗</h2>
              <div className="match-container">
                <div className="match-column">
                  <h3>Symbols</h3>
                  {matchPairs.map((symbol, index) => (
                    <button
                      key={index}
                      className={`match-button ${
                        selectedSymbol?.symbol === symbol.symbol ? 'selected' : ''
                      } ${matchedPairs.includes(symbol.symbol) ? 'matched' : ''}`}
                      onClick={() => handleSymbolClick(symbol)}
                      disabled={matchedPairs.includes(symbol.symbol)}
                      style={{ color: symbol.color }}
                    >
                      {symbol.symbol} - {symbol.name}
                    </button>
                  ))}
                </div>
                <div className="match-column">
                  <h3>Descriptions</h3>
                  {matchPairs.map((symbol, index) => (
                    <button
                      key={index}
                      className={`match-button ${
                        selectedDescription?.symbol === symbol.symbol ? 'selected' : ''
                      } ${matchedPairs.includes(symbol.symbol) ? 'matched' : ''}`}
                      onClick={() => handleDescriptionClick(symbol)}
                      disabled={matchedPairs.includes(symbol.symbol)}
                    >
                      {symbol.description}
                    </button>
                  ))}
                </div>
              </div>
              {matchedPairs.length === matchPairs.length && (
                <div className="game-complete">
                  🎉 Amazing! You matched all pairs! 🎉
                  <button className="btn-play-again" onClick={() => initializeMatchGame()}>
                    Play Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ActivitiesPage;
