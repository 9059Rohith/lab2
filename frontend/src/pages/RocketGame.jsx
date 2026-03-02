import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './RocketGame.css';

function RocketGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(localStorage.getItem('rocketHighScore') || 0);
  const [rocketPosition, setRocketPosition] = useState(50);
  const [obstacles, setObstacles] = useState([]);
  const [stars, setStars] = useState([]);
  const gameLoopRef = useRef(null);
  const obstacleTimerRef = useRef(null);
  const starTimerRef = useRef(null);

  // Handle rocket movement
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted || gameOver) return;
      
      if (e.key === 'ArrowUp' && rocketPosition > 10) {
        setRocketPosition(prev => prev - 5);
      } else if (e.key === 'ArrowDown' && rocketPosition < 90) {
        setRocketPosition(prev => prev + 5);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, rocketPosition]);

  // Handle touch/mouse movement
  const handleTouchMove = (e) => {
    if (!gameStarted || gameOver) return;
    
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    let clientY = e.clientY;
    
    if (e.touches) {
      clientY = e.touches[0].clientY;
    }
    
    const relativeY = ((clientY - rect.top) / rect.height) * 100;
    if (relativeY >= 10 && relativeY <= 90) {
      setRocketPosition(relativeY);
    }
  };

  // Start game
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setRocketPosition(50);
    setObstacles([]);
    setStars([]);

    // Game loop
    gameLoopRef.current = setInterval(() => {
      setScore(prev => prev + 1);
    }, 100);

    // Spawn obstacles
    obstacleTimerRef.current = setInterval(() => {
      const newObstacle = {
        id: Date.now(),
        position: Math.random() * 80 + 10,
        left: 100
      };
      setObstacles(prev => [...prev, newObstacle]);
    }, 2000);

    // Spawn stars
    starTimerRef.current = setInterval(() => {
      const newStar = {
        id: Date.now(),
        position: Math.random() * 80 + 10,
        left: 100
      };
      setStars(prev => [...prev, newStar]);
    }, 1500);
  };

  // Update obstacles and stars
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const updateInterval = setInterval(() => {
      // Move obstacles
      setObstacles(prev => 
        prev.map(obstacle => ({
          ...obstacle,
          left: obstacle.left - 2
        })).filter(obstacle => obstacle.left > -10)
      );

      // Move stars
      setStars(prev => 
        prev.map(star => ({
          ...star,
          left: star.left - 2
        })).filter(star => star.left > -10)
      );
    }, 50);

    return () => clearInterval(updateInterval);
  }, [gameStarted, gameOver]);

  // End game function
  const endGame = useCallback(() => {
    setGameOver(true);
    setGameStarted(false);
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('rocketHighScore', score);
    }

    clearInterval(gameLoopRef.current);
    clearInterval(obstacleTimerRef.current);
    clearInterval(starTimerRef.current);
  }, [score, highScore]);

  // Collision detection
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    // Check obstacle collisions
    obstacles.forEach(obstacle => {
      if (obstacle.left < 15 && obstacle.left > 5) {
        if (Math.abs(obstacle.position - rocketPosition) < 10) {
          endGame();
        }
      }
    });

    // Check star collection
    stars.forEach(star => {
      if (star.left < 15 && star.left > 5) {
        if (Math.abs(star.position - rocketPosition) < 8) {
          setScore(prev => prev + 50);
          setStars(prev => prev.filter(s => s.id !== star.id));
        }
      }
    });
  }, [obstacles, stars, rocketPosition, gameStarted, gameOver, endGame]);

  return (
    <div className="rocket-game-page">
      <div className="game-header">
        <Link to="/" className="back-button">← Back to Home</Link>
        <h1 className="game-title">
          <span className="title-icon">🚀</span>
          Space Rocket Adventure
          <span className="title-icon">⭐</span>
        </h1>
        <div className="score-board">
          <div className="score-item">
            <span className="score-label">Score:</span>
            <span className="score-value">{score}</span>
          </div>
          <div className="score-item">
            <span className="score-label">High Score:</span>
            <span className="score-value">{highScore}</span>
          </div>
        </div>
      </div>

      {!gameStarted && !gameOver && (
        <div className="game-instructions">
          <h2>🎮 How to Play</h2>
          <div className="instructions-content">
            <p>🚀 Control your rocket using:</p>
            <ul>
              <li><strong>Arrow Keys</strong> (Up/Down) on keyboard</li>
              <li><strong>Touch & Drag</strong> on touchscreen</li>
              <li><strong>Mouse Click & Drag</strong> on desktop</li>
            </ul>
            <p>⭐ Collect stars for bonus points!</p>
            <p>🌑 Avoid the asteroids!</p>
          </div>
          <button className="start-button" onClick={startGame}>
            🚀 Start Adventure!
          </button>
        </div>
      )}

      {gameStarted && (
        <div 
          className="game-container"
          onMouseMove={handleTouchMove}
          onTouchMove={handleTouchMove}
        >
          {/* Rocket */}
          <div 
            className="rocket" 
            style={{ top: `${rocketPosition}%` }}
          >
            🚀
          </div>

          {/* Obstacles */}
          {obstacles.map(obstacle => (
            <div
              key={obstacle.id}
              className="obstacle"
              style={{
                top: `${obstacle.position}%`,
                left: `${obstacle.left}%`
              }}
            >
              🌑
            </div>
          ))}

          {/* Stars */}
          {stars.map(star => (
            <div
              key={star.id}
              className="star-collectible"
              style={{
                top: `${star.position}%`,
                left: `${star.left}%`
              }}
            >
              ⭐
            </div>
          ))}

          {/* Instructions Overlay */}
          <div className="game-controls-hint">
            Use ↑↓ keys or Touch to move
          </div>
        </div>
      )}

      {gameOver && (
        <div className="game-over-screen">
          <h2 className="game-over-title">🎉 Adventure Complete!</h2>
          <div className="final-score">
            <p>Your Score: <strong>{score}</strong></p>
            {score > highScore && <p className="new-record">🏆 New High Score!</p>}
          </div>
          <div className="game-over-buttons">
            <button className="play-again-button" onClick={startGame}>
              🚀 Play Again
            </button>
            <Link to="/activities" className="activities-button">
              🎮 More Games
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default RocketGame;
