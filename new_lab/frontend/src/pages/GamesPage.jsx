import { useEffect, useMemo, useRef, useState } from 'react';
import { submitScore } from '../api';
import { shuffle, speak } from '../utils';
import './GamesPage.css';

const STAR_CHEF_RECIPES = [
  { text: '8 ___ 2 = 4', answer: '÷' },
  { text: '3 ___ 4 = 12', answer: '×' },
  { text: '7 ___ 5 = 12', answer: '+' },
  { text: '9 ___ 2 = 7', answer: '-' },
  { text: '18 ___ 3 = 6', answer: '÷' }
];

const GRAVITY_PAINTER_PROMPTS = [
  { text: '5 ___ 5 = 10', answer: '+' },
  { text: '9 ___ 4 = 5', answer: '-' },
  { text: '6 ___ 6', answer: '=' },
  { text: '8 ___ 3', answer: '>' },
  { text: '2 ___ 7', answer: '<' }
];

const WORMHOLE_DOORS = [
  { text: '3 ___ 4 = 12', answer: '×' },
  { text: '10 ___ 2 = 5', answer: '÷' },
  { text: '8 ___ 1 = 9', answer: '+' },
  { text: '9 ___ 4 = 5', answer: '-' },
  { text: '7 ___ 2', answer: '>' },
  { text: '1 ___ 8', answer: '<' }
];

const WEATHER_SPELLS = [
  { request: 'We need rain.', text: '10 ___ 2 = 5', answer: '÷', weather: 'Rain' },
  { request: 'Make it sunny.', text: '3 ___ 2 = 6', answer: '×', weather: 'Sunny' },
  { request: 'Make a rainbow.', text: '4 ___ 4 = 8', answer: '+', weather: 'Rainbow' },
  { request: 'Cool with snow.', text: '9 ___ 4 = 5', answer: '-', weather: 'Snow' },
  { request: 'Make balance weather.', text: '6 ___ 6', answer: '=', weather: 'Calm' }
];

const SHADOW_STORIES = [
  {
    title: 'Rabbit Carrot Story',
    lines: 'The rabbit has 6 carrots. He gives some away. 6 ___ 2 = 4 carrots now.',
    answer: '-',
    cast: 'Rabbit'
  },
  {
    title: 'Fox Fruit Story',
    lines: 'Fox finds 3 apples and then 4 more apples. 3 ___ 4 = 7.',
    answer: '+',
    cast: 'Fox'
  },
  {
    title: 'Elephant Sharing Story',
    lines: 'Elephant has 12 leaves and shares equally with 3 friends. 12 ___ 3 = 4.',
    answer: '÷',
    cast: 'Elephant'
  },
  {
    title: 'Robot Balance Story',
    lines: 'Robot puts 9 blocks on one side and 9 on the other. 9 ___ 9.',
    answer: '=',
    cast: 'Robot'
  },
  {
    title: 'Unicorn Hill Story',
    lines: 'Unicorn has 8 stars. Dragon has 5 stars. 8 ___ 5.',
    answer: '>',
    cast: 'Unicorn'
  }
];

const GAME_PROGRESS_TARGETS = {
  game1: 250,
  game2: 180,
  game3: 220,
  game4: 200,
  game5: 160
};

function saveLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

function loadLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function getChoices(answer, pool, count = 4) {
  const rest = shuffle(pool.filter((item) => item !== answer)).slice(0, count - 1);
  return shuffle([answer, ...rest]);
}

function StarChefGame({ voiceEnabled, onScore }) {
  const [recipeIndex, setRecipeIndex] = useState(0);
  const [feedback, setFeedback] = useState('Use the tractor beam to throw the correct ingredient planet.');
  const [blackHole, setBlackHole] = useState(false);
  const [galaxy, setGalaxy] = useState(() => loadLocal('star-chef-galaxy', []));

  useEffect(() => {
    saveLocal('star-chef-galaxy', galaxy);
  }, [galaxy]);

  const recipe = STAR_CHEF_RECIPES[recipeIndex % STAR_CHEF_RECIPES.length];
  const options = useMemo(() => shuffle(['÷', '+', '×', '-']), [recipeIndex]);

  const pick = (symbol) => {
    if (symbol === recipe.answer) {
      setFeedback('Correct ingredient. Pot explodes and a new galaxy star is born.');
      speak('Galaxy created', voiceEnabled);
      setGalaxy((prev) => {
        const next = [...prev, `star-${Date.now()}`];
        onScore(next.length * 25);
        return next;
      });
      setRecipeIndex((v) => v + 1);
      return;
    }

    setBlackHole(true);
    setFeedback('Wrong ingredient. Pot became a black hole and reset the current recipe.');
    speak('Black hole reset', voiceEnabled);
    setTimeout(() => {
      setBlackHole(false);
      setRecipeIndex(0);
    }, 720);
  };

  return (
    <article className="mini-game-card space-card">
      <h3>Game 1: Star Chef</h3>
      <div className={`chef-kitchen ${blackHole ? 'hole' : ''}`}>
        <span>👽</span>
        <span>🫕</span>
        <span>🪐</span>
      </div>
      <p className="game-question">Cosmic recipe: {recipe.text}</p>
      <div className="symbol-row">
        {options.map((symbol) => (
          <button key={symbol} type="button" className="answer-btn symbol-btn" onClick={() => pick(symbol)}>
            {symbol}
          </button>
        ))}
      </div>
      <p className="small">{feedback}</p>
      <div className="mini-map">
        {galaxy.slice(-20).map((star) => (
          <span key={star}>⭐</span>
        ))}
      </div>
      <p className="small">Personal galaxy stars: {galaxy.length}</p>
    </article>
  );
}

function GravityPainterGame({ voiceEnabled, onScore }) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState('Tap the correct comet to paint your universe.');
  const [splats, setSplats] = useState(() => loadLocal('gravity-painter-splats', []));

  useEffect(() => {
    saveLocal('gravity-painter-splats', splats);
  }, [splats]);

  const prompt = GRAVITY_PAINTER_PROMPTS[index % GRAVITY_PAINTER_PROMPTS.length];
  const options = useMemo(() => getChoices(prompt.answer, ['+', '-', '=', '>', '<'], 4), [index]);

  const pick = (symbol) => {
    if (symbol !== prompt.answer) {
      setFeedback('Wrong comet flew into the void. A new set is coming.');
      speak('Try another comet', voiceEnabled);
      return;
    }

    setFeedback('Correct comet. Massive color explosion painted your universe.');
    speak('Paint explosion', voiceEnabled);
    setSplats((prev) => {
      const next = [
        ...prev,
        {
          id: `s-${Date.now()}-${Math.random()}`,
          x: Math.floor(Math.random() * 88),
          y: Math.floor(Math.random() * 72),
          size: 24 + Math.floor(Math.random() * 70),
          hue: Math.floor(Math.random() * 360)
        }
      ];
      onScore(next.length * 18);
      return next;
    });
    setIndex((v) => v + 1);
  };

  return (
    <article className="mini-game-card space-card painter-card">
      <h3>Game 2: Gravity Painter</h3>
      <div className="universe-canvas">
        {splats.map((splat) => (
          <span
            key={splat.id}
            className="paint-splat"
            style={{
              left: `${splat.x}%`,
              top: `${splat.y}%`,
              width: `${splat.size}px`,
              height: `${splat.size}px`,
              background: `hsla(${splat.hue}, 95%, 62%, 0.6)`
            }}
          />
        ))}
      </div>
      <p className="game-question">{prompt.text}</p>
      <div className="comet-row">
        {options.map((symbol, idx) => (
          <button
            key={`${symbol}-${idx}`}
            type="button"
            className="answer-btn symbol-btn comet-btn"
            onClick={() => pick(symbol)}
            style={{ animationDuration: `${3.5 + (idx % 2)}s` }}
          >
            ☄ {symbol}
          </button>
        ))}
      </div>
      <p className="small">{feedback}</p>
      <p className="small">Saved artwork layers: {splats.length}</p>
    </article>
  );
}

function WormholeEscapeGame({ voiceEnabled, onScore }) {
  const [doorIndex, setDoorIndex] = useState(0);
  const [choiceIndex, setChoiceIndex] = useState(0);
  const [feedback, setFeedback] = useState('Move with arrow keys. Press Enter to use selected key.');
  const [bounce, setBounce] = useState(false);
  const [robotX, setRobotX] = useState(1);
  const [mazeLevel, setMazeLevel] = useState(1);
  const [opened, setOpened] = useState(0);

  const currentDoor = WORMHOLE_DOORS[doorIndex % WORMHOLE_DOORS.length];
  const options = useMemo(
    () => getChoices(currentDoor.answer, ['×', '÷', '+', '-', '>', '<'], 4),
    [doorIndex]
  );

  const pick = (symbol) => {
    if (symbol === currentDoor.answer) {
      setFeedback('Correct key. Door blasts open with lightning.');
      speak('Door opened', voiceEnabled);
      setOpened((prev) => {
        const next = prev + 1;
        onScore(next * 24);
        return next;
      });
      const nextDoor = doorIndex + 1;
      setDoorIndex(nextDoor);
      if (nextDoor % 4 === 0) {
        setMazeLevel((v) => v + 1);
        setFeedback('Wormhole portal unlocked. Robot reached a new planet.');
      }
      return;
    }

    setBounce(true);
    setFeedback('Wrong key. Robot got a funny zap bounce. New key spawned.');
    speak('Funny bounce', voiceEnabled);
    setTimeout(() => setBounce(false), 380);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        setChoiceIndex((v) => (v - 1 + options.length) % options.length);
        setRobotX((v) => Math.max(0, v - 1));
      }
      if (event.key === 'ArrowRight') {
        setChoiceIndex((v) => (v + 1) % options.length);
        setRobotX((v) => Math.min(4, v + 1));
      }
      if (event.key === 'ArrowUp') {
        setRobotX((v) => Math.min(4, v + 1));
      }
      if (event.key === 'ArrowDown') {
        setRobotX((v) => Math.max(0, v - 1));
      }
      if (event.key === 'Enter') {
        pick(options[choiceIndex]);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [choiceIndex, options]);

  return (
    <article className="mini-game-card space-card wormhole-card">
      <h3>Game 3: Wormhole Escape</h3>
      <div className="maze-strip">
        <span className={`robot ${bounce ? 'bounce' : ''}`} style={{ left: `${robotX * 18}%` }}>🤖</span>
        <span className="door-lock">🚪</span>
        <span className="portal">🌀</span>
      </div>
      <p className="game-question">Door lock: {currentDoor.text}</p>
      <div className="symbol-row">
        {options.map((symbol, idx) => (
          <button
            key={`${symbol}-${idx}`}
            type="button"
            className={`answer-btn symbol-btn ${choiceIndex === idx ? 'active-key' : ''}`}
            onClick={() => {
              setChoiceIndex(idx);
              pick(symbol);
            }}
          >
            {symbol}
          </button>
        ))}
      </div>
      <p className="small">{feedback}</p>
      <p className="small">Maze level: {mazeLevel} | Doors opened: {opened}</p>
    </article>
  );
}

function SymbolWeatherWizardGame({ voiceEnabled, onScore }) {
  const [spellIndex, setSpellIndex] = useState(0);
  const [weather, setWeather] = useState('Sunny');
  const [villageLevel, setVillageLevel] = useState(1);
  const [frog, setFrog] = useState(false);
  const [feedback, setFeedback] = useState('Choose the correct wand symbol to cast weather magic.');

  const spell = WEATHER_SPELLS[spellIndex % WEATHER_SPELLS.length];
  const options = useMemo(() => getChoices(spell.answer, ['÷', '×', '+', '-', '='], 4), [spellIndex]);

  const cast = (symbol) => {
    if (symbol !== spell.answer) {
      setFrog(true);
      setFeedback('Spell backfired. Wizard turned into a frog for a moment.');
      speak('Ribbit', voiceEnabled);
      setTimeout(() => setFrog(false), 700);
      return;
    }

    setWeather(spell.weather);
    setVillageLevel((prev) => {
      const next = prev + 1;
      onScore(next * 28);
      return next;
    });
    setSpellIndex((v) => v + 1);
    setFeedback(`Perfect spell. Weather changed to ${spell.weather} and villagers are happy.`);
    speak('Magic success', voiceEnabled);
  };

  return (
    <article className="mini-game-card wizard-card">
      <h3>Game 4: Symbol Weather Wizard</h3>
      <div className="village-scene">
        <span>{frog ? '🐸' : '🧙'}</span>
        <span>🏠</span>
        <span>🌾</span>
        <span>🌊</span>
        <span>{weather === 'Rain' ? '🌧' : weather === 'Snow' ? '❄' : weather === 'Rainbow' ? '🌈' : weather === 'Calm' ? '🌤' : '☀'}</span>
      </div>
      <p className="small">Villager request: {spell.request}</p>
      <p className="game-question">Spell lock: {spell.text}</p>
      <div className="symbol-row">
        {options.map((symbol) => (
          <button key={symbol} type="button" className="answer-btn symbol-btn" onClick={() => cast(symbol)}>
            🪄 {symbol}
          </button>
        ))}
      </div>
      <p className="small">{feedback}</p>
      <p className="small">Village growth level: {villageLevel}</p>
    </article>
  );
}

function SymbolShadowPuppetsGame({ voiceEnabled, onScore }) {
  const [storyIndex, setStoryIndex] = useState(0);
  const [feedback, setFeedback] = useState('Pick the correct shadow hand to continue the story.');
  const [unlocked, setUnlocked] = useState(() => loadLocal('shadow-unlocked', ['Rabbit']));

  useEffect(() => {
    saveLocal('shadow-unlocked', unlocked);
  }, [unlocked]);

  const story = SHADOW_STORIES[storyIndex % SHADOW_STORIES.length];
  const options = useMemo(() => getChoices(story.answer, ['+', '-', '×', '÷', '=', '>', '<'], 4), [storyIndex]);
  const unlockPool = ['Dragon', 'Unicorn', 'Robot', 'Phoenix'];

  const select = (symbol) => {
    if (symbol !== story.answer) {
      setFeedback('Hmm, let us try again warmly.');
      speak('Lets try again', voiceEnabled);
      return;
    }

    setFeedback(`${story.cast} story completed. New puppet unlocked.`);
    setUnlocked((prev) => {
      const candidate = unlockPool.find((item) => !prev.includes(item));
      const next = candidate ? [...prev, candidate] : prev;
      onScore(next.length * 22);
      return next;
    });
    speak('Story complete', voiceEnabled);
    setStoryIndex((v) => v + 1);
  };

  return (
    <article className="mini-game-card puppet-card">
      <h3>Game 5: Symbol Shadow Puppets</h3>
      <div className="puppet-stage">
        <div className="puppet-light" />
        <div className="puppet-screen">
          <span>🐇</span>
          <span>🦊</span>
          <span>🐘</span>
        </div>
      </div>
      <p className="small">Story: {story.title}</p>
      <p className="small">{story.lines}</p>
      <div className="symbol-row">
        {options.map((symbol, idx) => (
          <button key={`${symbol}-${idx}`} type="button" className="answer-btn symbol-btn shadow-hand" onClick={() => select(symbol)}>
            ✋ {symbol}
          </button>
        ))}
      </div>
      <p className="small">{feedback}</p>
      <p className="small">Unlocked puppets: {unlocked.join(', ')}</p>
    </article>
  );
}

export default function GamesPage({ userId, voiceEnabled, onScoreSaved }) {
  const [scores, setScores] = useState({
    game1: 0,
    game2: 0,
    game3: 0,
    game4: 0,
    game5: 0
  });
  const sentRef = useRef(new Set());

  const saveScore = async (gameId, score) => {
    setScores((prev) => ({ ...prev, [gameId]: Math.max(prev[gameId], score) }));

    const key = `${gameId}:${score}`;
    if (!userId || sentRef.current.has(key)) return;

    sentRef.current.add(key);
    try {
      await submitScore({
        userId,
        gameId,
        score,
        correctAnswers: score,
        totalQuestions: 1,
        status: 'completed'
      });
      if (onScoreSaved) onScoreSaved();
    } catch {
      sentRef.current.delete(key);
    }
  };

  const total = Object.values(scores).reduce((sum, value) => sum + value, 0);
  const progressByGame = useMemo(() => ({
    game1: Math.min(100, Math.round((scores.game1 / GAME_PROGRESS_TARGETS.game1) * 100)),
    game2: Math.min(100, Math.round((scores.game2 / GAME_PROGRESS_TARGETS.game2) * 100)),
    game3: Math.min(100, Math.round((scores.game3 / GAME_PROGRESS_TARGETS.game3) * 100)),
    game4: Math.min(100, Math.round((scores.game4 / GAME_PROGRESS_TARGETS.game4) * 100)),
    game5: Math.min(100, Math.round((scores.game5 / GAME_PROGRESS_TARGETS.game5) * 100))
  }), [scores]);
  const overallProgress = Math.round(
    (progressByGame.game1 + progressByGame.game2 + progressByGame.game3 + progressByGame.game4 + progressByGame.game5) / 5
  );

  return (
    <section className="page-wrap games-one-page">
      <header className="games-hero-mango">
        <p className="kicker">Light Yellow + White Mango Theme</p>
        <h2>Five New Symbol Adventures In One Page</h2>
        <p className="small">Space trio first, then two cozy story games. Calm, playful, and rewarding.</p>
        <div className="score-badge">Total Points: {total}</div>
        <div className="progress-panel">
          <div className="progress-title-row">
            <strong>Overall Learning Progress</strong>
            <span>{overallProgress}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${overallProgress}%` }} />
          </div>
          <div className="progress-grid">
            <div className="progress-item">
              <span>Star Chef</span>
              <span>{progressByGame.game1}%</span>
              <div className="progress-track small-track"><div className="progress-fill" style={{ width: `${progressByGame.game1}%` }} /></div>
            </div>
            <div className="progress-item">
              <span>Gravity Painter</span>
              <span>{progressByGame.game2}%</span>
              <div className="progress-track small-track"><div className="progress-fill" style={{ width: `${progressByGame.game2}%` }} /></div>
            </div>
            <div className="progress-item">
              <span>Wormhole Escape</span>
              <span>{progressByGame.game3}%</span>
              <div className="progress-track small-track"><div className="progress-fill" style={{ width: `${progressByGame.game3}%` }} /></div>
            </div>
            <div className="progress-item">
              <span>Weather Wizard</span>
              <span>{progressByGame.game4}%</span>
              <div className="progress-track small-track"><div className="progress-fill" style={{ width: `${progressByGame.game4}%` }} /></div>
            </div>
            <div className="progress-item">
              <span>Shadow Puppets</span>
              <span>{progressByGame.game5}%</span>
              <div className="progress-track small-track"><div className="progress-fill" style={{ width: `${progressByGame.game5}%` }} /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="mini-games-stack">
        <StarChefGame voiceEnabled={voiceEnabled} onScore={(value) => saveScore('game1', value)} />
        <GravityPainterGame voiceEnabled={voiceEnabled} onScore={(value) => saveScore('game2', value)} />
        <WormholeEscapeGame voiceEnabled={voiceEnabled} onScore={(value) => saveScore('game3', value)} />
        <SymbolWeatherWizardGame voiceEnabled={voiceEnabled} onScore={(value) => saveScore('game4', value)} />
        <SymbolShadowPuppetsGame voiceEnabled={voiceEnabled} onScore={(value) => saveScore('game5', value)} />
      </div>
    </section>
  );
}
