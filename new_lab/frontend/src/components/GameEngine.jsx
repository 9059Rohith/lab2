import { useEffect, useMemo, useRef, useState } from 'react';
import { submitScore } from '../api';
import { shuffle, speak } from '../utils';

function GameResult({ result, onReplay }) {
  return (
    <div className="result-card">
      <h4>{result.status === 'won' ? 'You Won! 🏆' : 'Great Practice! 🌟'}</h4>
      <p>You scored {result.score} points.</p>
      <p>Correct answers: {result.correctAnswers}/{result.totalQuestions}</p>
      <button type="button" className="btn btn-primary" onClick={onReplay}>Play Again</button>
    </div>
  );
}

function SymbolMatchGame({ onScoreChange, onFinish, voiceEnabled }) {
  const levels = [
    [
      { prompt: 'Which symbol means Addition?', options: ['+', '-', '×', '÷'], answer: '+' },
      { prompt: 'Which symbol means Division?', options: ['=', '÷', '%', '>'], answer: '÷' },
      { prompt: 'Which symbol means Subtraction?', options: ['+', '-', '×', '='], answer: '-' }
    ],
    [
      { prompt: 'Which symbol means Less Than?', options: ['<', '>', '=', '+'], answer: '<' },
      { prompt: 'Which symbol means Greater Than?', options: ['<', '>', '=', '+'], answer: '>' },
      { prompt: 'Which symbol means Equals?', options: ['=', '+', '%', '÷'], answer: '=' }
    ],
    [
      { prompt: 'Which symbol means Percent?', options: ['%', '÷', '+', '='], answer: '%' },
      { prompt: 'Which symbol means Multiplication?', options: ['×', '-', '÷', '<'], answer: '×' },
      { prompt: 'Which symbol means Division?', options: ['>', '÷', '×', '+'], answer: '÷' }
    ]
  ];

  const [levelIndex, setLevelIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState('');

  const currentLevel = levels[levelIndex];
  const totalQuestions = levels.reduce((sum, lvl) => sum + lvl.length, 0);
  const current = currentLevel[index];
  const options = useMemo(() => (current ? shuffle(current.options) : []), [current]);

  useEffect(() => {
    onScoreChange(score);
  }, [score, onScoreChange]);

  const pick = (value) => {
    const right = value === current.answer;
    const nextScore = score + (right ? 40 : 0);
    const nextCorrect = correct + (right ? 1 : 0);

    setScore(nextScore);
    setCorrect(nextCorrect);
    setFeedback(right ? 'Great! That is correct.' : `Nice try. Correct answer: ${current.answer}`);
    speak(right ? 'Great answer!' : `Correct answer is ${current.answer}`, voiceEnabled);

    if (index + 1 >= currentLevel.length) {
      if (levelIndex + 1 < levels.length) {
        setLevelIndex((v) => v + 1);
        setIndex(0);
        setFeedback(`Level ${levelIndex + 1} complete. Welcome to Level ${levelIndex + 2}.`);
        speak(`Great job. Starting level ${levelIndex + 2}`, voiceEnabled);
        return;
      }

      onFinish({
        score: nextScore,
        correctAnswers: nextCorrect,
        totalQuestions,
        status: nextCorrect >= 7 ? 'won' : 'completed'
      });
      return;
    }

    setIndex((v) => v + 1);
  };

  return (
    <>
      <p className="question">{current.prompt}</p>
      <p className="small">Level {levelIndex + 1} of {levels.length}</p>
      <div className="option-grid">
        {options.map((option) => (
          <button key={option} type="button" className="option-btn" onClick={() => pick(option)}>{option}</button>
        ))}
      </div>
      {!!feedback && <p className="game-feedback">{feedback}</p>}
      <p className="small">Question {index + 1} of {currentLevel.length}</p>
    </>
  );
}

function RocketFlightGame({ onScoreChange, onFinish, voiceEnabled }) {
  const GRID_W = 9;
  const GRID_H = 12;
  const LEVELS = [
    { targetHits: 4, spawnEvery: 9, maxTicks: 180 },
    { targetHits: 8, spawnEvery: 7, maxTicks: 220 },
    { targetHits: 12, spawnEvery: 6, maxTicks: 260 }
  ];

  const [state, setState] = useState({
    rocketX: 4,
    bullets: [],
    enemies: [],
    hits: 0,
    levelHits: 0,
    level: 0,
    lives: 3,
    ticks: 0,
    levelTicks: 0,
    score: 0,
    ended: false,
    status: 'in-progress',
    message: 'Use Left/Right keys to move, Space to shoot.'
  });

  const stateRef = useRef(state);
  const submittedRef = useRef(false);

  useEffect(() => {
    stateRef.current = state;
    onScoreChange(state.score);
  }, [state, onScoreChange]);

  useEffect(() => {
    speak('Rocket mission. Use arrow keys to move and space to shoot.', voiceEnabled);
  }, [voiceEnabled]);

  useEffect(() => {
    const onKeyDown = (event) => {
      const snap = stateRef.current;
      if (snap.ended) return;

      if (event.key === 'ArrowLeft') {
        setState((prev) => ({ ...prev, rocketX: Math.max(0, prev.rocketX - 1) }));
      }

      if (event.key === 'ArrowRight') {
        setState((prev) => ({ ...prev, rocketX: Math.min(GRID_W - 1, prev.rocketX + 1) }));
      }

      if (event.key === ' ') {
        event.preventDefault();
        setState((prev) => {
          if (prev.ended) return prev;
          const bullet = { id: `${Date.now()}-${Math.random()}`, x: prev.rocketX, y: GRID_H - 2 };
          return { ...prev, bullets: [...prev.bullets, bullet] };
        });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        if (prev.ended) return prev;

        const levelCfg = LEVELS[prev.level];
        const nextTicks = prev.ticks + 1;
        const nextLevelTicks = prev.levelTicks + 1;
        let bullets = prev.bullets.map((b) => ({ ...b, y: b.y - 1 })).filter((b) => b.y >= 0);
        let enemies = prev.enemies.map((e) => ({ ...e, y: e.y + 1 }));
        let hitsEarned = 0;

        if (nextTicks % levelCfg.spawnEvery === 0) {
          enemies = [...enemies, { id: `e-${nextTicks}-${Math.random()}`, x: Math.floor(Math.random() * GRID_W), y: 0 }];
        }

        const removeBullets = new Set();
        const removeEnemies = new Set();

        for (let bIndex = 0; bIndex < bullets.length; bIndex += 1) {
          for (let eIndex = 0; eIndex < enemies.length; eIndex += 1) {
            if (bullets[bIndex].x === enemies[eIndex].x && bullets[bIndex].y === enemies[eIndex].y) {
              removeBullets.add(bIndex);
              removeEnemies.add(eIndex);
              hitsEarned += 1;
            }
          }
        }

        bullets = bullets.filter((_, idx) => !removeBullets.has(idx));
        enemies = enemies.filter((_, idx) => !removeEnemies.has(idx));

        const slipped = enemies.filter((e) => e.y >= GRID_H - 1).length;
        enemies = enemies.filter((e) => e.y < GRID_H - 1);

        const nextLives = Math.max(0, prev.lives - slipped);
        const nextHits = prev.hits + hitsEarned;
        const nextLevelHits = prev.levelHits + hitsEarned;
        const nextScore = prev.score + (hitsEarned * 25) - (slipped * 15);

        const outOfLives = nextLives <= 0;
        const levelComplete = nextLevelHits >= levelCfg.targetHits;
        const timeout = nextLevelTicks >= levelCfg.maxTicks;

        if (levelComplete) {
          const isFinalLevel = prev.level + 1 >= LEVELS.length;
          if (isFinalLevel) {
            return {
              ...prev,
              bullets: [],
              enemies: [],
              ticks: nextTicks,
              levelTicks: nextLevelTicks,
              hits: nextHits,
              levelHits: nextLevelHits,
              lives: nextLives,
              score: Math.max(0, nextScore),
              ended: true,
              status: 'won',
              message: 'Mission clear. You protected the galaxy!'
            };
          }

          return {
            ...prev,
            bullets: [],
            enemies: [],
            ticks: nextTicks,
            levelTicks: 0,
            hits: nextHits,
            levelHits: 0,
            level: prev.level + 1,
            lives: Math.min(4, nextLives + 1),
            score: Math.max(0, nextScore + 40),
            message: `Level ${prev.level + 1} complete. Entering level ${prev.level + 2}!`
          };
        }

        if (outOfLives || timeout) {
          return {
            ...prev,
            bullets: [],
            enemies: [],
            ticks: nextTicks,
            levelTicks: nextLevelTicks,
            hits: nextHits,
            levelHits: nextLevelHits,
            lives: nextLives,
            score: Math.max(0, nextScore),
            ended: true,
            status: outOfLives ? 'completed' : 'completed',
            message: outOfLives ? 'Mission failed. Rocket shield is down.' : 'Time over on this level. Good try, cadet.'
          };
        }

        let message = prev.message;
        if (hitsEarned > 0) message = `Direct hit! +${hitsEarned * 25} points.`;
        if (slipped > 0) message = `${slipped} enemy escaped. Shield damaged.`;

        return {
          ...prev,
          bullets,
          enemies,
          ticks: nextTicks,
          levelTicks: nextLevelTicks,
          hits: nextHits,
          levelHits: nextLevelHits,
          lives: nextLives,
          score: Math.max(0, nextScore),
          ended: false,
          status: 'in-progress',
          message
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!state.ended || submittedRef.current) return;
    submittedRef.current = true;
    onFinish({
      score: state.score,
      correctAnswers: state.hits,
      totalQuestions: LEVELS[LEVELS.length - 1].targetHits,
      status: state.status
    });
  }, [state, onFinish]);

  const board = useMemo(() => {
    const cells = [];
    for (let y = 0; y < GRID_H; y += 1) {
      for (let x = 0; x < GRID_W; x += 1) {
        let content = '·';
        if (state.enemies.some((e) => e.x === x && e.y === y)) content = '🛸';
        if (state.bullets.some((b) => b.x === x && b.y === y)) content = '💥';
        if (y === GRID_H - 1 && x === state.rocketX) content = '🚀';
        cells.push({ key: `${x}-${y}`, content });
      }
    }
    return cells;
  }, [state]);

  return (
    <>
      <div className="rocket-stage">
        <div className="rocket-meter">
          <div className="rocket-fill" style={{ width: `${Math.min(100, Math.round((state.levelHits / LEVELS[state.level].targetHits) * 100))}%` }} />
        </div>
        <div className="rocket-grid">
          {board.map((cell) => (
            <span key={cell.key} className="rocket-cell">{cell.content}</span>
          ))}
        </div>
        <p className="small">Level {state.level + 1} of {LEVELS.length} | Hits: {state.levelHits}/{LEVELS[state.level].targetHits} | Lives: {state.lives} | Time: {Math.max(0, Math.ceil((LEVELS[state.level].maxTicks - state.levelTicks) / 10))}s</p>
      </div>
      <p className="game-feedback">{state.message}</p>
      <p className="small">Controls: Arrow Left, Arrow Right, Space (shoot)</p>
    </>
  );
}

function SymbolBuilderGame({ onScoreChange, onFinish, voiceEnabled }) {
  const levels = [
    [
      { mode: 'operator', a: 6, b: 2, result: 12, answer: '×', options: ['+', '-', '×', '÷'] },
      { mode: 'result', a: 8, b: 2, op: '÷', answer: 4, options: [2, 3, 4, 5] }
    ],
    [
      { mode: 'operator', a: 10, b: 7, result: 3, answer: '-', options: ['+', '-', '×', '÷'] },
      { mode: 'result', a: 9, b: 3, op: '+', answer: 12, options: [10, 11, 12, 13] }
    ],
    [
      { mode: 'operator', a: 7, b: 5, result: 35, answer: '×', options: ['+', '-', '×', '÷'] },
      { mode: 'result', a: 14, b: 6, op: '-', answer: 8, options: [7, 8, 9, 10] }
    ]
  ];

  const [levelIndex, setLevelIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState('Pick the best piece to build the equation.');

  const currentLevel = levels[levelIndex];
  const totalQuestions = levels.reduce((sum, lvl) => sum + lvl.length, 0);
  const current = currentLevel[index];
  const options = useMemo(() => (current ? shuffle(current.options) : []), [current]);

  useEffect(() => {
    onScoreChange(score);
  }, [score, onScoreChange]);

  const pick = (value) => {
    const right = value === current.answer;
    const nextScore = score + (right ? 45 : 5);
    const nextCorrect = correct + (right ? 1 : 0);

    setScore(nextScore);
    setCorrect(nextCorrect);
    setFeedback(right ? 'Perfect build!' : `Good effort. Correct piece: ${current.answer}`);
    speak(right ? 'Great build!' : 'Good try. Keep building.', voiceEnabled);

    if (index + 1 >= currentLevel.length) {
      if (levelIndex + 1 < levels.length) {
        setLevelIndex((v) => v + 1);
        setIndex(0);
        setFeedback(`Level ${levelIndex + 1} complete. Moving to Level ${levelIndex + 2}.`);
        speak(`Builder level ${levelIndex + 2}`, voiceEnabled);
        return;
      }

      onFinish({
        score: nextScore,
        correctAnswers: nextCorrect,
        totalQuestions,
        status: nextCorrect >= 5 ? 'won' : 'completed'
      });
      return;
    }

    setIndex((v) => v + 1);
  };

  return (
    <>
      <p className="question">
        {current.mode === 'operator'
          ? `${current.a} ? ${current.b} = ${current.result}`
          : `${current.a} ${current.op} ${current.b} = ?`}
      </p>
      <p className="small">Level {levelIndex + 1} of {levels.length}</p>
      <div className="builder-ops">
        {options.map((option) => (
          <button key={String(option)} type="button" className="option-btn" onClick={() => pick(option)}>{option}</button>
        ))}
      </div>
      <p className="game-feedback">{feedback}</p>
      <p className="small">Build {index + 1} of {currentLevel.length}</p>
    </>
  );
}

function PatternExplorerGame({ onScoreChange, onFinish, voiceEnabled }) {
  const levels = [
    [
      { sequence: [2, 4, 6, 8], answer: 10 },
      { sequence: [12, 10, 8, 6], answer: 4 }
    ],
    [
      { sequence: [3, 6, 12, 24], answer: 48 },
      { sequence: [1, 4, 9, 16], answer: 25 }
    ],
    [
      { sequence: [5, 10, 20, 40], answer: 80 },
      { sequence: [7, 14, 28, 56], answer: 112 }
    ]
  ];

  const [levelIndex, setLevelIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState('Type the next number using the keypad.');

  const currentLevel = levels[levelIndex];
  const totalQuestions = levels.reduce((sum, lvl) => sum + lvl.length, 0);
  const current = currentLevel[index];

  useEffect(() => {
    onScoreChange(score);
  }, [score, onScoreChange]);

  const appendDigit = (digit) => {
    if (input.length >= 3) return;
    setInput((v) => `${v}${digit}`);
  };

  const submit = () => {
    if (!input) return;
    const value = Number(input);
    const right = value === current.answer;
    const nextScore = score + (right ? 50 : 5);
    const nextCorrect = correct + (right ? 1 : 0);

    setScore(nextScore);
    setCorrect(nextCorrect);
    setFeedback(right ? 'Pattern cracked! Great work.' : `Close. Correct number was ${current.answer}.`);
    setInput('');
    speak(right ? 'Great pattern solving.' : `Correct answer is ${current.answer}`, voiceEnabled);

    if (index + 1 >= currentLevel.length) {
      if (levelIndex + 1 < levels.length) {
        setLevelIndex((v) => v + 1);
        setIndex(0);
        setFeedback(`Level ${levelIndex + 1} solved. Entering Level ${levelIndex + 2}.`);
        speak(`Pattern level ${levelIndex + 2}`, voiceEnabled);
        return;
      }

      onFinish({
        score: nextScore,
        correctAnswers: nextCorrect,
        totalQuestions,
        status: nextCorrect >= 5 ? 'won' : 'completed'
      });
      return;
    }

    setIndex((v) => v + 1);
  };

  return (
    <>
      <p className="question">{current.sequence.join(', ')}, ?</p>
      <p className="small">Level {levelIndex + 1} of {levels.length}</p>
      <div className="keypad-display">{input || '_'}</div>
      <div className="keypad-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0, 'OK'].map((key) => (
          <button
            key={String(key)}
            type="button"
            className="keypad-btn"
            onClick={() => {
              if (key === '⌫') {
                setInput((v) => v.slice(0, -1));
                return;
              }
              if (key === 'OK') {
                submit();
                return;
              }
              appendDigit(key);
            }}
          >
            {key}
          </button>
        ))}
      </div>
      <p className="game-feedback">{feedback}</p>
      <p className="small">Pattern {index + 1} of {currentLevel.length}</p>
    </>
  );
}

function SymbolAdventureGame({ onScoreChange, onFinish, voiceEnabled }) {
  const scenes = [
    {
      text: 'You reach the sky bridge. Which symbol opens it for 4 and 4 to make 8?',
      choices: [
        { label: '+', points: 40, next: 1, correct: true },
        { label: '-', points: 10, next: 1, correct: false },
        { label: '÷', points: 10, next: 1, correct: false }
      ]
    },
    {
      text: 'A cave door asks: 18 ? 3 = 6. Choose the best symbol.',
      choices: [
        { label: '×', points: 10, next: 2, correct: false },
        { label: '÷', points: 40, next: 2, correct: true },
        { label: '+', points: 10, next: 2, correct: false }
      ]
    },
    {
      text: 'Final gate says: 9 ? 2 = 18. Pick your move.',
      choices: [
        { label: '-', points: 10, next: 3, correct: false },
        { label: '×', points: 40, next: 3, correct: true },
        { label: '+', points: 10, next: 3, correct: false }
      ]
    },
    {
      text: 'Treasure chest challenge: 15 ? 5 = 10. Last choice.',
      choices: [
        { label: '-', points: 40, next: null, correct: true },
        { label: '÷', points: 10, next: null, correct: false },
        { label: '+', points: 10, next: null, correct: false }
      ]
    }
  ];

  const [sceneIndex, setSceneIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [steps, setSteps] = useState(0);
  const [feedback, setFeedback] = useState('Choose your adventure move.');

  const scene = scenes[sceneIndex];

  useEffect(() => {
    onScoreChange(score);
  }, [score, onScoreChange]);

  const choose = (choice) => {
    const nextScore = score + choice.points;
    const nextCorrect = correct + (choice.correct ? 1 : 0);
    const nextSteps = steps + 1;

    setScore(nextScore);
    setCorrect(nextCorrect);
    setSteps(nextSteps);
    setFeedback(choice.correct ? 'Smart choice. Path unlocked!' : 'Path opens, but not the best symbol.');
    speak(choice.correct ? 'Great choice, explorer.' : 'Nice try, keep exploring.', voiceEnabled);

    if (choice.next === null) {
      onFinish({
        score: nextScore,
        correctAnswers: nextCorrect,
        totalQuestions: scenes.length,
        status: nextCorrect >= 3 ? 'won' : 'completed'
      });
      return;
    }

    setSceneIndex(choice.next);
  };

  return (
    <>
      <div className="adventure-card">
        <p className="question">{scene.text}</p>
        <div className="choice-list">
          {scene.choices.map((choice) => (
            <button key={choice.label} type="button" className="option-btn" onClick={() => choose(choice)}>
              {choice.label}
            </button>
          ))}
        </div>
      </div>
      <p className="game-feedback">{feedback}</p>
      <p className="small">Act {Math.min(3, Math.floor(sceneIndex / 2) + 1)} of 3 | Scene {sceneIndex + 1} of {scenes.length}</p>
    </>
  );
}

function SymbolGridQuizGame({ onScoreChange, onFinish, voiceEnabled }) {
  const symbols = [
    { symbol: '+', name: 'Addition', family: 'operation', example: '2 + 3 = 5' },
    { symbol: '-', name: 'Subtraction', family: 'operation', example: '9 - 4 = 5' },
    { symbol: '×', name: 'Multiplication', family: 'operation', example: '3 × 4 = 12' },
    { symbol: '÷', name: 'Division', family: 'operation', example: '12 ÷ 3 = 4' },
    { symbol: '=', name: 'Equals', family: 'relation', example: '5 = 5' },
    { symbol: '<', name: 'Less Than', family: 'relation', example: '2 < 4' },
    { symbol: '>', name: 'Greater Than', family: 'relation', example: '8 > 3' },
    { symbol: '≤', name: 'Less or Equal', family: 'relation', example: '4 ≤ 4' },
    { symbol: '≥', name: 'Greater or Equal', family: 'relation', example: '7 ≥ 5' },
    { symbol: '%', name: 'Percent', family: 'special', example: '50% = half' },
    { symbol: '√', name: 'Square Root', family: 'special', example: '√9 = 3' },
    { symbol: 'π', name: 'Pi', family: 'special', example: 'π ≈ 3.14' }
  ];

  const levels = [
    [
      { type: 'name', prompt: 'Tap the symbol for Division', answerName: 'Division' },
      { type: 'name', prompt: 'Tap the symbol for Greater Than', answerName: 'Greater Than' }
    ],
    [
      { type: 'family', prompt: 'Tap all Operation symbols, then press Check', family: 'operation', multi: true },
      { type: 'name', prompt: 'Tap the symbol for Percent', answerName: 'Percent' }
    ],
    [
      { type: 'family', prompt: 'Tap all Relation symbols, then press Check', family: 'relation', multi: true },
      { type: 'name', prompt: 'Tap the symbol for Square Root', answerName: 'Square Root' }
    ]
  ];

  const [levelIndex, setLevelIndex] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState('Study the full grid and answer the prompt.');

  const currentLevel = levels[levelIndex];
  const totalQuestions = levels.reduce((sum, lvl) => sum + lvl.length, 0);
  const round = currentLevel[roundIndex];

  useEffect(() => {
    onScoreChange(score);
  }, [score, onScoreChange]);

  const goNext = (nextScore, nextCorrect) => {
    setSelected([]);
    if (roundIndex + 1 >= currentLevel.length) {
      if (levelIndex + 1 < levels.length) {
        setLevelIndex((v) => v + 1);
        setRoundIndex(0);
        setFeedback(`Level ${levelIndex + 1} completed. Level ${levelIndex + 2} unlocked.`);
        speak(`Grid quiz level ${levelIndex + 2}`, voiceEnabled);
        return;
      }

      onFinish({
        score: nextScore,
        correctAnswers: nextCorrect,
        totalQuestions,
        status: nextCorrect >= 5 ? 'won' : 'completed'
      });
      return;
    }
    setRoundIndex((v) => v + 1);
  };

  const singlePick = (card) => {
    const right = card.name === round.answerName;
    const nextScore = score + (right ? 45 : 5);
    const nextCorrect = correct + (right ? 1 : 0);
    setScore(nextScore);
    setCorrect(nextCorrect);
    setFeedback(right ? 'Correct pick from the full grid!' : `Not this one. Correct answer: ${round.answerName}`);
    speak(right ? 'Correct symbol.' : `Correct symbol is ${round.answerName}`, voiceEnabled);
    goNext(nextScore, nextCorrect);
  };

  const toggleMulti = (card) => {
    setSelected((prev) => (prev.includes(card.name) ? prev.filter((n) => n !== card.name) : [...prev, card.name]));
  };

  const submitMulti = () => {
    const shouldPick = symbols.filter((s) => s.family === round.family).map((s) => s.name).sort();
    const got = [...selected].sort();
    const right = JSON.stringify(shouldPick) === JSON.stringify(got);
    const nextScore = score + (right ? 60 : 10);
    const nextCorrect = correct + (right ? 1 : 0);
    setScore(nextScore);
    setCorrect(nextCorrect);
    setFeedback(right ? 'Excellent. You selected the full correct family.' : 'Almost. Check which symbols belong to this family.');
    speak(right ? 'Great grid selection.' : 'Good try, check the symbols again.', voiceEnabled);
    goNext(nextScore, nextCorrect);
  };

  return (
    <>
      <p className="question">{round.prompt}</p>
      <p className="small">Level {levelIndex + 1} of {levels.length}</p>
      <div className="symbol-quiz-grid">
        {symbols.map((card) => {
          const active = selected.includes(card.name);
          return (
            <button
              key={card.name}
              type="button"
              className={`symbol-quiz-card ${active ? 'active' : ''}`}
              onClick={() => {
                if (round.multi) {
                  toggleMulti(card);
                } else {
                  singlePick(card);
                }
              }}
            >
              <strong>{card.symbol}</strong>
              <span>{card.name}</span>
              <em>{card.example}</em>
            </button>
          );
        })}
      </div>

      {round.multi && (
        <button type="button" className="btn btn-primary" onClick={submitMulti}>Check Selection</button>
      )}

      <p className="game-feedback">{feedback}</p>
      <p className="small">Grid Quiz {roundIndex + 1} of {currentLevel.length}</p>
    </>
  );
}

function renderGame(id, props) {
  if (id === 'symbol-match') return <SymbolMatchGame {...props} />;
  if (id === 'rocket-flight') return <RocketFlightGame {...props} />;
  if (id === 'symbol-builder') return <SymbolBuilderGame {...props} />;
  if (id === 'pattern-explorer') return <PatternExplorerGame {...props} />;
  if (id === 'symbol-adventure') return <SymbolAdventureGame {...props} />;
  if (id === 'symbol-grid-quiz') return <SymbolGridQuizGame {...props} />;
  return <p className="question">Game not found. Please go back and choose another game.</p>;
}

export default function GameEngine({ game, userId, voiceEnabled, onScoreSaved }) {
  const [liveScore, setLiveScore] = useState(0);
  const [result, setResult] = useState(null);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    setLiveScore(0);
    setResult(null);
    setRunId(0);
  }, [game.id]);

  const finishGame = async ({ score, correctAnswers, totalQuestions, status }) => {
    const payload = {
      gameId: game.id,
      gameName: game.name,
      userId,
      score,
      correctAnswers,
      totalQuestions,
      status
    };

    setResult(payload);
    setLiveScore(score);

    const response = await submitScore(payload).catch(() => null);
    if (response?.success) onScoreSaved();
  };

  return (
    <div className="game-play">
      <div className="score-head">
        <h3>{game.icon} {game.name}</h3>
        <span>Score: {liveScore}</span>
      </div>

      <div className="mission-bar-wrap" aria-label="mission-progress">
        <div className="mission-bar" style={{ width: result ? '100%' : `${Math.min(95, Math.max(8, Math.round((liveScore / 220) * 100)))}%` }} />
      </div>

      <p className="small">Kid-friendly mode: big buttons, simple prompts, instant feedback.</p>

      {!result && (
        <div key={`${game.id}-${runId}`}>
          {renderGame(game.id, {
            onScoreChange: setLiveScore,
            onFinish: finishGame,
            voiceEnabled
          })}
        </div>
      )}

      {result && <GameResult result={result} onReplay={() => {
        setResult(null);
        setLiveScore(0);
        setRunId((v) => v + 1);
      }} />}
    </div>
  );
}
