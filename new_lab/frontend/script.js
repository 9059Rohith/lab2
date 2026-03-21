// ===== SYMBOL ACADEMY - MAIN APPLICATION ===== 

const API_BASE = 'http://localhost:3000/api';
let currentUserId = `student_${Date.now()}`;
let voiceEnabled = true;
let currentGame = null;
let gameScore = 0;

// ===== VOICE OVER SYSTEM =====
function speak(text) {
  if (!voiceEnabled) return;
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.2;
    utterance.volume = 0.8;
    window.speechSynthesis.speak(utterance);
  }
}

// ===== NAVIGATION SYSTEM =====
function navigateToPage(pageName) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
  const page = document.getElementById(`${pageName}-page`);
  const btn = document.querySelector(`[data-page="${pageName}"]`);
    
  if (page) {
    page.classList.add('active');
    if (btn) btn.classList.add('active');
        
    if (pageName === 'games') loadGames();
    if (pageName === 'stats') updateStats();
        
    speak(`Welcome to the ${pageName} section! 🎓`);
  }
}

// ===== LOAD GAMES FROM API =====
async function loadGames() {
  try {
    const response = await fetch(`${API_BASE}/games/list`);
    const data = await response.json();
        
    const gamesGrid = document.getElementById('games-grid');
    gamesGrid.innerHTML = '';
        
    data.games.forEach(game => {
      const gameCard = document.createElement('div');
      gameCard.className = 'game-card';
      gameCard.innerHTML = `
        <div class="game-card-header">
          <div class="game-icon">${game.icon}</div>
          <div>${game.name}</div>
        </div>
        <div class="game-card-body">
          <div class="game-name">${game.name}</div>
          <div class="game-description">${game.description}</div>
          <div class="game-meta">
            <span class="difficulty-badge">${game.difficulty}</span>
            <span class="points-badge">+${game.points} pts</span>
          </div>
          <button class="btn-play" onclick="startGame('${game.id}', '${game.name}')">
            Play Now 🚀
          </button>
        </div>
      `;
      gamesGrid.appendChild(gameCard);
    });
  } catch (error) {
    console.error('Error loading games:', error);
  }
}

// ===== GAME TEMPLATES =====
const GAME_TEMPLATES = {
  'symbol-match': createSymbolMatchGame,
  'rocket-flight': createRocketFlightGame,
  'symbol-builder': createSymbolBuilderGame,
  'pattern-explorer': createPatternExplorerGame,
  'symbol-adventure': createSymbolAdventureGame
};

function startGame(gameId, gameName) {
  currentGame = gameId;
  gameScore = 0;
    
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('game-player').classList.add('active');
  document.getElementById('game-title').textContent = gameName;
  document.getElementById('game-score').textContent = '0';
    
  const gameContent = document.getElementById('game-content');
  gameContent.innerHTML = '';
    
  const gameTemplate = GAME_TEMPLATES[gameId];
  if (gameTemplate) {
    gameTemplate(gameContent);
    speak(`Let's play ${gameName}! Good luck! 🌟`);
  }
}

// ===== GAME 1: SYMBOL MATCHER =====
function createSymbolMatchGame(container) {
  const symbols = [
    { symbol: '+', name: 'Plus (Addition)', example: '2 + 3 = 5' },
    { symbol: '−', name: 'Minus (Subtraction)', example: '5 − 2 = 3' },
    { symbol: '×', name: 'Multiply (Multiplication)', example: '3 × 4 = 12' },
    { symbol: '÷', name: 'Divide (Division)', example: '12 ÷ 3 = 4' },
    { symbol: '=', name: 'Equals', example: 'Is the same as' },
    { symbol: '<', name: 'Less Than', example: '3 < 5' },
    { symbol: '>', name: 'Greater Than', example: '5 > 3' },
    { symbol: '≤', name: 'Less or Equal', example: '3 ≤ 5' },
    { symbol: '%', name: 'Percent', example: '50% = 0.5' },
    { symbol: '√', name: 'Square Root', example: '√9 = 3' }
  ];
    
  let currentQuestion = 0;
  let correctAnswers = 0;
    
  function displayQuestion() {
    if (currentQuestion >= symbols.length) {
      endGame(correctAnswers, symbols.length);
      return;
    }
        
    const symbol = symbols[currentQuestion];
    const options = shuffleArray([
      symbol.name,
      symbols[(currentQuestion + 1) % symbols.length].name,
      symbols[(currentQuestion + 2) % symbols.length].name,
      symbols[(currentQuestion + 3) % symbols.length].name
    ]);
        
    container.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 5rem; margin: 2rem 0; color: #667eea;">
          ${symbol.symbol}
        </div>
        <p style="font-size: 1.2rem; margin-bottom: 1rem;">What does this symbol mean?</p>
        <p style="color: #999; font-style: italic; margin-bottom: 2rem;">Example: ${symbol.example}</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          ${options.map(option => `
            <button class="btn-primary" style="padding: 1rem;" onclick="selectSymbolAnswer('${option}', '${symbol.name}')">
              ${option}
            </button>
          `).join('')}
        </div>
        <p style="margin-top: 2rem; color: #999;">Question ${currentQuestion + 1} of ${symbols.length}</p>
      </div>
    `;
        
    speak(`Question ${currentQuestion + 1}. What does this symbol mean?`);
  }
    
  window.selectSymbolAnswer = (selected, correct) => {
    if (selected === correct) {
      correctAnswers++;
      gameScore += 20;
      speak('Correct! Excellent! 🎉');
    } else {
      speak(`Not quite. The correct answer is ${correct}`);
    }
    currentQuestion++;
    document.getElementById('game-score').textContent = gameScore;
    displayQuestion();
  };
    
  displayQuestion();
}

// ===== GAME 2: ROCKET FLIGHT =====
function createRocketFlightGame(container) {
  let level = 1;
  let distance = 0;
    
  function playLevel() {
    const problems = [
      { operator: '+', num1: 2, num2: 3, options: [5, 4, 6, 7] },
      { operator: '+', num1: 5, num2: 4, options: [9, 8, 10, 11] },
      { operator: '−', num1: 10, num2: 3, options: [7, 6, 8, 5] },
      { operator: '×', num1: 3, num2: 4, options: [12, 11, 13, 10] }
    ];
        
    const problem = problems[(level - 1) % problems.length];
        
    container.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 3rem; margin: 1rem 0;">🚀</div>
        <p style="font-size: 1.3rem; margin: 1rem 0;">Level ${level}</p>
        <p style="font-size: 2rem; margin: 2rem 0; color: #667eea; font-weight: bold;">
          ${problem.num1} ${problem.operator} ${problem.num2} = ?
        </p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 2rem 0;">
          ${problem.options.map(option => `
            <button class="btn-primary" style="padding: 1rem; font-size: 1.2rem;" onclick="selectRocketAnswer(${option}, ${problem.num1 + problem.num2})">
              ${option}
            </button>
          `).join('')}
        </div>
        <p style="margin-top: 2rem; color: #999;">Distance: ${distance} km</p>
      </div>
    `;
        
    speak(`Level ${level}. Solve ${problem.num1} ${problem.operator} ${problem.num2}`);
  }
    
  window.selectRocketAnswer = (selected, correct) => {
    if (selected === correct) {
      gameScore += 30;
      distance += 100;
      speak('Correct! Rocket flying higher! 🚀');
      level++;
      if (level > 4) {
        endGame(4, 4);
      } else {
        playLevel();
      }
    } else {
      speak(`Wrong! The answer is ${correct}. Try again!`);
    }
    document.getElementById('game-score').textContent = gameScore;
  };
    
  playLevel();
}

// ===== GAME 3: SYMBOL BUILDER =====
function createSymbolBuilderGame(container) {
  const equations = [
    { question: '2 + 3 = ?', answer: '5', symbols: ['+', '='] },
    { question: '10 − 4 = ?', answer: '6', symbols: ['−', '='] },
    { question: '4 × 5 = ?', answer: '20', symbols: ['×', '='] },
    { question: '6 ÷ 2 = ?', answer: '3', symbols: ['÷', '='] }
  ];
    
  let currentEq = 0;
    
  function showEquation() {
    if (currentEq >= equations.length) {
      endGame(currentEq, equations.length);
      return;
    }
        
    const eq = equations[currentEq];
        
    container.innerHTML = `
      <div style="text-align: center;">
        <p style="font-size: 1.3rem; margin: 2rem 0;">Build the equation:</p>
        <div style="font-size: 2rem; margin: 2rem 0; background: #f0f0f0; padding: 2rem; border-radius: 1rem;">
          ${eq.question}
        </div>
        <div style="margin: 2rem 0;">
          <button class="btn-primary" style="padding: 1rem 2rem; margin: 0.5rem;" onclick="buildEquationAnswer('${eq.answer}', ${currentEq})">
            ${eq.answer}
          </button>
        </div>
        <p style="margin-top: 2rem; color: #999;">Equation ${currentEq + 1} of ${equations.length}</p>
      </div>
    `;
        
    speak(`Build the equation. ${eq.question.split('?')[0]}`);
  }
    
  window.buildEquationAnswer = (answer, index) => {
    gameScore += 25;
    speak('Great! You built the equation correctly! 🎯');
    currentEq++;
    document.getElementById('game-score').textContent = gameScore;
    showEquation();
  };
    
  showEquation();
}

// ===== GAME 4: PATTERN EXPLORER =====
function createPatternExplorerGame(container) {
  const patterns = [
    { sequence: [2, 4, 6, 8], next: 10, description: 'Even numbers' },
    { sequence: [1, 3, 5, 7], next: 9, description: 'Odd numbers' },
    { sequence: [2, 4, 8, 16], next: 32, description: 'Doubling' },
    { sequence: [1, 1, 2, 3, 5], next: 8, description: 'Fibonacci sequence' }
  ];
    
  let currentPattern = 0;
    
  function showPattern() {
    if (currentPattern >= patterns.length) {
      endGame(currentPattern, patterns.length);
      return;
    }
        
    const pattern = patterns[currentPattern];
    const options = shuffleArray([
      pattern.next,
      pattern.next + 1,
      pattern.next - 1,
      pattern.next + 2
    ]);
        
    container.innerHTML = `
      <div style="text-align: center;">
        <p style="font-size: 1.3rem; margin: 2rem 0;">Find the next number in the pattern:</p>
        <p style="font-size: 1.2rem; color: #666; margin-bottom: 1rem;">${pattern.description}</p>
        <div style="font-size: 2rem; margin: 2rem 0; letter-spacing: 1rem;">
          ${pattern.sequence.join(', ')} , ?
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 2rem 0;">
          ${options.map(opt => `
            <button class="btn-primary" style="padding: 1rem; font-size: 1.5rem;" onclick="selectPatternAnswer(${opt}, ${pattern.next})">
              ${opt}
            </button>
          `).join('')}
        </div>
        <p style="margin-top: 2rem; color: #999;">Pattern ${currentPattern + 1} of ${patterns.length}</p>
      </div>
    `;
        
    speak(`What is the next number in this pattern?`);
  }
    
  window.selectPatternAnswer = (selected, correct) => {
    if (selected === correct) {
      gameScore += 35;
      speak('Correct! You found the pattern! 🌟');
    } else {
      speak(`Not quite. The next number is ${correct}`);
    }
    currentPattern++;
    document.getElementById('game-score').textContent = gameScore;
    showPattern();
  };
    
  showPattern();
}

// ===== GAME 5: SYMBOL ADVENTURE =====
function createSymbolAdventureGame(container) {
  const adventure = [
    { description: 'You see a sign with "3 + 2". What does it mean?', options: ['5', 'Total of 5', 'Three plus two', 'All of the above'], correct: 'All of the above' },
    { description: 'A rocket needs 10 fuel. You have 4. How much more? (10 − 4 = ?)', options: ['6', '14', '2', '4'], correct: '6' },
    { description: 'You find 3 treasure chests with 5 coins each. (3 × 5 = ?)', options: ['8', '15', '2', '12'], correct: '15' }
  ];
    
  let currentStep = 0;
    
  function showStep() {
    if (currentStep >= adventure.length) {
      endGame(currentStep, adventure.length);
      return;
    }
        
    const step = adventure[currentStep];
        
    container.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 4rem; margin: 1rem 0;">🗺️</div>
        <p style="font-size: 1.3rem; margin: 1.5rem 0; color: #333;">
          ${step.description}
        </p>
        <div style="display: grid; grid-template-columns: 1fr; gap: 1rem; margin: 2rem 0;">
          ${step.options.map(opt => `
            <button class="btn-primary" style="padding: 1.5rem; text-align: left;" onclick="selectAdventureAnswer('${opt}', '${step.correct}')">
              ${opt}
            </button>
          `).join('')}
        </div>
        <p style="margin-top: 2rem; color: #999;">Adventure Step ${currentStep + 1} of ${adventure.length}</p>
      </div>
    `;
        
    speak(step.description);
  }
    
  window.selectAdventureAnswer = (selected, correct) => {
    if (selected === correct) {
      gameScore += 40;
      speak('Correct! You completed this step! 🎉');
    } else {
      speak(`The correct answer was ${correct}`);
    }
    currentStep++;
    document.getElementById('game-score').textContent = gameScore;
    showStep();
  };
    
  showStep();
}

// ===== END GAME AND SAVE SCORE =====
async function endGame(correct, total) {
  const statusMessage = correct === total ? 'YOU WON! 🏆' : 'Game Completed! 🎉';
    
  document.getElementById('game-content').innerHTML = `
    <div style="text-align: center; padding: 3rem;">
      <div style="font-size: 3rem; margin: 1rem 0;">
        ${correct === total ? '🏆' : '⭐'}
      </div>
      <h2 style="font-size: 2rem; margin: 1rem 0; color: #667eea;">
        ${statusMessage}
      </h2>
      <p style="font-size: 1.3rem; margin: 1rem 0;">
        You got ${correct} out of ${total} correct!
      </p>
      <p style="font-size: 2rem; margin: 2rem 0; color: #14b8a6; font-weight: bold;">
        Score: ${gameScore} points
      </p>
      <button class="btn-primary" onclick="nextStep()" style="padding: 1rem 2rem; margin-top: 1rem;">
        Continue 👉
      </button>
    </div>
  `;
    
  // Save score to backend
  try {
    await fetch(`${API_BASE}/games/submit-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gameId: currentGame,
        gameName: document.getElementById('game-title').textContent,
        userId: currentUserId,
        score: gameScore,
        correctAnswers: correct,
        totalQuestions: total,
        status: correct === total ? 'won' : 'completed'
      })
    });
  } catch (error) {
    console.error('Error saving score:', error);
  }
    
  speak(statusMessage);
}

window.nextStep = () => {
  navigateToPage('games');
};

// ===== CHAT SYSTEM =====
async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const message = input.value.trim();
    
  if (!message) return;
    
  input.value = '';
    
  // Display user message
  const messagesDiv = document.getElementById('chat-messages');
  const userMsgDiv = document.createElement('div');
  userMsgDiv.className = 'message user-message';
  userMsgDiv.innerHTML = `<div class="message-content">${message}</div>`;
  messagesDiv.appendChild(userMsgDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        userId: currentUserId,
        gameContext: currentGame ? `Learning about ${currentGame}` : 'General learning'
      })
    });
        
    const data = await response.json();
        
    // Display bot message
    const botMsgDiv = document.createElement('div');
    botMsgDiv.className = 'message bot-message';
    botMsgDiv.innerHTML = `<div class="message-content">${data.response}</div>`;
    messagesDiv.appendChild(botMsgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
        
    speak(data.response);
  } catch (error) {
    console.error('Chat error:', error);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message bot-message';
    errorDiv.innerHTML = `<div class="message-content">Sorry, I had trouble connecting. Please try again!</div>`;
    messagesDiv.appendChild(errorDiv);
  }
}

// ===== UPDATE STATS =====
async function updateStats() {
  try {
    const response = await fetch(`${API_BASE}/games/user-stats/${currentUserId}`);
    const data = await response.json();
        
    document.getElementById('stat-total-points').textContent = data.totalPoints;
    document.getElementById('stat-games-played').textContent = data.gamesPlayed;
    document.getElementById('stat-badges').textContent = data.rewards.length;
    document.getElementById('stat-level').textContent = Math.ceil(data.totalPoints / 500) || 1;
        
    // Display badges
    const badgesContainer = document.getElementById('badges-container');
    badgesContainer.innerHTML = '';
        
    const badgeEmojis = ['🏆', '⭐', '🌟', '💫', '✨'];
    data.rewards.forEach((reward, index) => {
      const badge = document.createElement('div');
      badge.className = 'badge';
      badge.innerHTML = `
        <div class="badge-icon">${badgeEmojis[index % badgeEmojis.length]}</div>
        <div class="badge-name">${reward.description.substr(0, 20)}...</div>
      `;
      badgesContainer.appendChild(badge);
    });
        
    // Display game history
    const historyList = document.getElementById('game-history');
    historyList.innerHTML = '';
        
    data.gameScores.forEach(score => {
      const item = document.createElement('div');
      item.className = 'history-item';
      const date = new Date(score.createdAt).toLocaleDateString();
      item.innerHTML = `
        <span>${score.gameName}</span>
        <span>${score.status === 'won' ? '🏆' : '⭐'} ${score.score} pts</span>
        <span style="color: #999; font-size: 0.9rem;">${date}</span>
      `;
      historyList.appendChild(item);
    });
        
    // Update total points display
    document.getElementById('total-points').textContent = data.totalPoints;
  } catch (error) {
    console.error('Error updating stats:', error);
  }
}

// ===== UTILITY FUNCTIONS =====
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
  // Navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateToPage(btn.dataset.page);
    });
  });
    
  // Start button
  document.getElementById('start-btn')?.addEventListener('click', () => {
    navigateToPage('games');
  });
    
  // Chat
  document.getElementById('chat-send')?.addEventListener('click', sendChatMessage);
  document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
  });
    
  // Back button
  document.getElementById('back-to-games')?.addEventListener('click', () => {
    navigateToPage('games');
  });
    
  // Voice toggle
  document.getElementById('voice-btn')?.addEventListener('click', () => {
    voiceEnabled = !voiceEnabled;
    const btn = document.getElementById('voice-btn');
    btn.textContent = voiceEnabled ? '🔊' : '🔇';
    speak(voiceEnabled ? 'Voice enabled!' : 'Voice disabled!');
  });
    
  speak('Welcome to Symbol Academy! Let\'s learn together! 🌟');
});
const input = document.getElementById('cmdInput');
const sideContent = document.getElementById('sideContent');
const wrap = document.getElementById('terminalWrap');
const themeSelect = document.getElementById('themeSelect');

const history = [];
let historyIdx = -1;
let snakeInstance = null;

const commands = {
  help: () => `Available commands:\nhelp, about, skills, projects, contact, clear, theme [name], split [h|v|off], snake, whoami, map`,
  about: () => 'Creative frontend developer building loud, playful, handcrafted interfaces.',
  skills: () => 'HTML, CSS, JavaScript, Interaction Design, Motion, Maps, UX writing',
  projects: () => '1) Neo Brutal Portfolio\n2) Terminal Resume\n3) Map Journey Experiments',
  contact: () => 'mail: hello@example.dev\nlinkedin: /in/neo-playground',
  whoami: () => 'guest@neo',
  map: () => 'Use the main page journey section to explore map markers.',
  clear: () => {
    output.textContent = '';
    return '';
  }
};

function printLine(text = '') {
  output.textContent += `${text}\n`;
  output.scrollTop = output.scrollHeight;
}

function setTheme(name) {
  document.body.className = `theme-${name}`;
  themeSelect.value = name;
  localStorage.setItem('terminalTheme', name);
}

function setSplit(mode) {
  wrap.classList.remove('single', 'split-h', 'split-v');
  if (mode === 'h') wrap.classList.add('split-h');
  else if (mode === 'v') wrap.classList.add('split-v');
  else wrap.classList.add('single');
}

function runSnake() {
  const modal = document.getElementById('snakeModal');
  const root = document.getElementById('snakeRoot');
  modal.classList.remove('hidden');

  if (snakeInstance) snakeInstance.remove();
  root.innerHTML = '';

  const sketch = (p) => {
    const scale = 20;
    let snake = [{ x: 5, y: 5 }];
    let food = { x: 10, y: 8 };
    let dir = { x: 1, y: 0 };

    const resetFood = () => {
      food = {
        x: Math.floor(p.random(0, 20)),
        y: Math.floor(p.random(0, 20))
      };
    };

    p.setup = () => {
      p.createCanvas(400, 400).parent(root);
      p.frameRate(10);
    };

    p.draw = () => {
      p.background(20);
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      if (head.x < 0 || head.y < 0 || head.x >= 20 || head.y >= 20 || snake.some((s) => s.x === head.x && s.y === head.y)) {
        snake = [{ x: 5, y: 5 }];
        dir = { x: 1, y: 0 };
        resetFood();
      } else {
        snake.unshift(head);
      }

      if (head.x === food.x && head.y === food.y) {
        resetFood();
      } else {
        snake.pop();
      }

      p.fill(70, 230, 80);
      snake.forEach((part) => p.rect(part.x * scale, part.y * scale, scale - 1, scale - 1));
      p.fill(255, 80, 140);
      p.rect(food.x * scale, food.y * scale, scale - 1, scale - 1);
    };

    p.keyPressed = () => {
      if (p.keyCode === p.LEFT_ARROW && dir.x !== 1) dir = { x: -1, y: 0 };
      if (p.keyCode === p.RIGHT_ARROW && dir.x !== -1) dir = { x: 1, y: 0 };
      if (p.keyCode === p.UP_ARROW && dir.y !== 1) dir = { x: 0, y: -1 };
      if (p.keyCode === p.DOWN_ARROW && dir.y !== -1) dir = { x: 0, y: 1 };
    };
  };

  snakeInstance = new p5(sketch);
}

async function logCommand(command, result) {
  const sessionId = localStorage.getItem('neoSessionId') || crypto.randomUUID();
  localStorage.setItem('neoSessionId', sessionId);

  await fetch(`${API_BASE}/terminal-log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      command,
      output: result,
      sessionId,
      theme: themeSelect.value
    })
  }).catch(() => undefined);
}

async function execute(raw) {
  const line = raw.trim();
  if (!line) return;

  printLine(`> ${line}`);
  history.push(line);
  historyIdx = history.length;

  const [cmd, ...args] = line.split(/\s+/);
  let result = '';

  if (cmd === 'theme') {
    const theme = args[0] || 'default';
    setTheme(theme);
    result = `Theme switched to ${theme}`;
  } else if (cmd === 'split') {
    const mode = args[0] || 'off';
    setSplit(mode);
    result = `Split mode: ${mode}`;
  } else if (cmd === 'snake') {
    runSnake();
    result = 'Launching snake...';
  } else if (commands[cmd]) {
    result = commands[cmd](args);
  } else {
    result = `Unknown command: ${cmd}. Try help.`;
  }

  if (result) printLine(result);
  sideContent.textContent = `Last command: ${line}`;
  await logCommand(line, result);
}

input.addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {
    const value = input.value;
    input.value = '';
    await execute(value);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    if (history.length === 0) return;
    historyIdx = Math.max(0, historyIdx - 1);
    input.value = history[historyIdx] || '';
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (history.length === 0) return;
    historyIdx = Math.min(history.length, historyIdx + 1);
    input.value = historyIdx === history.length ? '' : history[historyIdx] || '';
  }
});

document.getElementById('splitH').addEventListener('click', () => setSplit('h'));
document.getElementById('splitV').addEventListener('click', () => setSplit('v'));
document.getElementById('singlePane').addEventListener('click', () => setSplit('off'));

document.getElementById('closeSnake').addEventListener('click', () => {
  document.getElementById('snakeModal').classList.add('hidden');
  if (snakeInstance) {
    snakeInstance.remove();
    snakeInstance = null;
  }
});

themeSelect.addEventListener('change', () => setTheme(themeSelect.value));

(function init() {
  const saved = localStorage.getItem('terminalTheme') || 'default';
  setTheme(saved);
  printLine('Neo Terminal Resume v1.0');
  printLine('Type help to begin.');
})();
