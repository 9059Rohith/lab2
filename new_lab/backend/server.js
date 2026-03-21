import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fetch from 'node-fetch';

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT || 3000);
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5500,http://localhost:8000,http://localhost:8080')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let dbMode = 'memory';

const memoryStore = {
  contacts: [],
  visits: [],
  terminalLogs: [],
  gameScores: [],
  rewards: [],
  chatHistory: []
};

// Game Schemas
const gameScoreSchema = new mongoose.Schema(
  {
    gameId: { type: String, required: true },
    gameName: { type: String, required: true },
    userId: { type: String, required: true },
    score: { type: Number, required: true },
    timeSpent: { type: Number },
    level: { type: Number, default: 1 },
    correctAnswers: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    status: { type: String, enum: ['won', 'lost', 'in-progress', 'completed'], default: 'in-progress' }
  },
  { timestamps: true }
);

const rewardSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    type: { type: String, required: true },
    points: { type: Number, required: true },
    gameId: { type: String },
    description: String,
    badge: String
  },
  { timestamps: true }
);

const chatHistorySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userMessage: { type: String, required: true },
    botResponse: { type: String, required: true },
    context: String,
    game: String
  },
  { timestamps: true }
);

const visitSchema = new mongoose.Schema(
  {
    page: { type: String, required: true },
    sessionId: { type: String, required: true },
    userAgent: String,
    metadata: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true }
  },
  { timestamps: true }
);

const terminalLogSchema = new mongoose.Schema(
  {
    command: { type: String, required: true },
    sessionId: { type: String, required: true },
    output: String,
    theme: String
  },
  { timestamps: true }
);

const Visit = mongoose.model('Visit', visitSchema);
const Contact = mongoose.model('Contact', contactSchema);
const TerminalLog = mongoose.model('TerminalLog', terminalLogSchema);
const GameScore = mongoose.model('GameScore', gameScoreSchema);
const Reward = mongoose.model('Reward', rewardSchema);
const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

const timeline = [
  {
    id: 'journey-1',
    title: 'Curious Start',
    year: '2020',
    description: 'Started experimenting with raw HTML, CSS, and handwritten animations.',
    lat: 12.9716,
    lng: 77.5946,
    location: 'Bengaluru'
  },
  {
    id: 'journey-2',
    title: 'Frontend Playground Era',
    year: '2022',
    description: 'Built interactive projects with map controls, playful UI systems, and terminal interfaces.',
    lat: 13.0827,
    lng: 80.2707,
    location: 'Chennai'
  },
  {
    id: 'journey-3',
    title: 'Design Meets Storytelling',
    year: '2024',
    description: 'Combined motion storytelling, neo-brutal patterns, and personality-driven interfaces.',
    lat: 11.0168,
    lng: 76.9558,
    location: 'Coimbatore'
  }
];

async function connectDbIfAvailable() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('[backend] MONGODB_URI missing, running in memory mode');
    return;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
    dbMode = 'mongo';
    console.log('[backend] MongoDB connected');
  } catch (error) {
    console.warn(`[backend] MongoDB unavailable, fallback to memory mode: ${error.message}`);
  }
}

function getRuntimeMeta() {
  return {
    mode: dbMode,
    now: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  };
}

function generateFallbackTutorReply(message) {
  const normalized = String(message || '').toLowerCase();

  const symbolHints = [
    { keys: ['plus', '+', 'add', 'addition'], text: 'The plus symbol (+) means to add numbers together. Example: 2 + 3 = 5.' },
    { keys: ['minus', '-', 'subtract', 'subtraction'], text: 'The minus symbol (-) means to take away. Example: 7 - 2 = 5.' },
    { keys: ['multiply', 'times', 'x', '×'], text: 'The multiply symbol (×) means repeated addition. Example: 3 × 4 = 12.' },
    { keys: ['divide', 'division', '÷'], text: 'The divide symbol (÷) splits into equal groups. Example: 12 ÷ 3 = 4.' },
    { keys: ['equal', '='], text: 'The equals symbol (=) means both sides have the same value.' },
    { keys: ['less', '<'], text: 'The symbol < means less than. Example: 3 < 5.' },
    { keys: ['greater', '>'], text: 'The symbol > means greater than. Example: 8 > 2.' },
    { keys: ['percent', '%'], text: 'The percent symbol (%) means out of 100. Example: 50% means 50 out of 100.' }
  ];

  const match = symbolHints.find((item) => item.keys.some((k) => normalized.includes(k)));
  if (match) {
    return `Great question! ${match.text} You are doing amazing. Keep going!`;
  }

  return 'I am your symbol tutor. We can learn +, -, ×, ÷, =, <, >, and % together. Ask me about one symbol and I will explain it with a fun example.';
}

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    service: 'neo-brutal-portfolio-api',
    ...getRuntimeMeta()
  });
});

app.get('/api/portfolio-data', (req, res) => {
  res.json({
    success: true,
    timeline,
    highlights: [
      'Neo-brutalist design system with animated tape and tear effects',
      'Interactive map journey linked to timeline events',
      'Terminal mode with split panes and snake mini-game',
      'No frontend framework and no build pipeline'
    ]
  });
});

app.post('/api/visit', async (req, res) => {
  try {
    const payload = {
      page: req.body.page || 'unknown',
      sessionId: req.body.sessionId || 'anonymous',
      userAgent: req.headers['user-agent'] || '',
      metadata: req.body.metadata || {}
    };

    if (dbMode === 'mongo') {
      const doc = await Visit.create(payload);
      return res.json({ success: true, data: doc });
    }

    memoryStore.visits.push({ ...payload, createdAt: new Date().toISOString() });
    return res.json({ success: true, data: payload });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'name, email, and message are required' });
    }

    const payload = { name: String(name).trim(), email: String(email).trim(), message: String(message).trim() };

    if (dbMode === 'mongo') {
      const doc = await Contact.create(payload);
      return res.json({ success: true, message: 'Message saved', data: doc });
    }

    memoryStore.contacts.push({ ...payload, createdAt: new Date().toISOString() });
    return res.json({ success: true, message: 'Message saved (memory mode)' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/terminal-log', async (req, res) => {
  try {
    const payload = {
      command: String(req.body.command || '').trim(),
      sessionId: String(req.body.sessionId || 'anonymous').trim(),
      output: String(req.body.output || '').slice(0, 3000),
      theme: String(req.body.theme || 'default')
    };

    if (!payload.command) {
      return res.status(400).json({ success: false, error: 'command is required' });
    }

    if (dbMode === 'mongo') {
      const doc = await TerminalLog.create(payload);
      return res.json({ success: true, data: doc });
    }

    memoryStore.terminalLogs.push({ ...payload, createdAt: new Date().toISOString() });
    return res.json({ success: true, data: payload });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    if (dbMode === 'mongo') {
      const [contacts, visits, terminalLogs] = await Promise.all([
        Contact.countDocuments(),
        Visit.countDocuments(),
        TerminalLog.countDocuments()
      ]);

      return res.json({ success: true, stats: { contacts, visits, terminalLogs }, ...getRuntimeMeta() });
    }

    return res.json({
      success: true,
      stats: {
        contacts: memoryStore.contacts.length,
        visits: memoryStore.visits.length,
        terminalLogs: memoryStore.terminalLogs.length
      },
      ...getRuntimeMeta()
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 🎓 GROQ AI CHATBOT ENDPOINT
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userId = 'anonymous', gameContext = '' } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const groqApiKey = process.env.GROQ_API_KEY;

    const systemPrompt = `You are an enthusiastic AI tutor named "Symbol Academy" helping autistic children learn mathematical and special symbols in a creative, fun way. 
    Be encouraging, use simple language, break down concepts into small digestible parts, use emojis, and celebrate achievements. 
    ${gameContext ? `Here's the learning context: ${gameContext}` : ''}
    Respond in a warm, supportive tone suitable for children.`;

    let botResponse = '';

    if (groqApiKey) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 600
        })
      });

      if (response.ok) {
        const data = await response.json();
        botResponse = data?.choices?.[0]?.message?.content || '';
      } else {
        const error = await response.text();
        console.warn('Groq API fallback triggered:', error);
      }
    }

    if (!botResponse) {
      botResponse = generateFallbackTutorReply(message);
    }

    // Save chat history
    const chatEntry = {
      userId,
      userMessage: message,
      botResponse,
      context: gameContext,
      createdAt: new Date().toISOString()
    };

    if (dbMode === 'mongo') {
      await ChatHistory.create(chatEntry);
    } else {
      memoryStore.chatHistory.push(chatEntry);
    }

    res.json({ success: true, response: botResponse, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 🎮 GAME SCORE ENDPOINT
app.post('/api/games/submit-score', async (req, res) => {
  try {
    const { gameId, gameName, userId = 'anonymous', score, timeSpent, level, correctAnswers, totalQuestions, status } = req.body;

    if (!gameId || !gameName || score === undefined) {
      return res.status(400).json({ success: false, error: 'gameId, gameName, and score are required' });
    }

    const scoreData = {
      gameId,
      gameName,
      userId,
      score,
      timeSpent,
      level: level || 1,
      correctAnswers: correctAnswers || 0,
      totalQuestions: totalQuestions || 0,
      status: status || 'completed'
    };

    let savedScore;
    if (dbMode === 'mongo') {
      savedScore = await GameScore.create(scoreData);
    } else {
      savedScore = { ...scoreData, createdAt: new Date().toISOString(), _id: Math.random().toString(36).substr(2, 9) };
      memoryStore.gameScores.push(savedScore);
    }

    // Award points
    const points = Math.round(score * (correctAnswers / Math.max(totalQuestions, 1)) * 10);
    const rewardData = {
      userId,
      type: 'game-completion',
      points,
      gameId,
      description: `Completed ${gameName} with ${correctAnswers}/${totalQuestions} correct answers!`,
      badge: status === 'won' ? '🏆' : '⭐'
    };

    if (dbMode === 'mongo') {
      await Reward.create(rewardData);
    } else {
      memoryStore.rewards.push({ ...rewardData, createdAt: new Date().toISOString() });
    }

    res.json({ success: true, message: 'Score submitted', score: savedScore, reward: rewardData });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 📊 GET USER STATS/REWARDS
app.get('/api/games/user-stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    let gameScores, rewards, totalPoints;

    if (dbMode === 'mongo') {
      gameScores = await GameScore.find({ userId });
      rewards = await Reward.find({ userId });
      totalPoints = await Reward.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: '$points' } } }
      ]);
    } else {
      gameScores = memoryStore.gameScores.filter(g => g.userId === userId);
      rewards = memoryStore.rewards.filter(r => r.userId === userId);
      totalPoints = rewards.reduce((sum, r) => sum + (r.points || 0), 0);
    }

    res.json({
      success: true,
      userId,
      gameScores,
      rewards,
      totalPoints: dbMode === 'mongo' ? (totalPoints[0]?.total || 0) : totalPoints,
      gamesPlayed: gameScores.length,
      lastGameTime: gameScores[gameScores.length - 1]?.createdAt || null
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 🎯 GET ALL GAMES LIST
app.get('/api/games/list', (req, res) => {
  const games = [
    {
      id: 'symbol-match',
      name: 'Symbol Match Arena',
      description: 'Match mathematical symbols with their meanings.',
      difficulty: 'Easy',
      points: 100,
      icon: '🔢'
    },
    {
      id: 'rocket-flight',
      name: 'Rocket Flight Mission',
      description: 'Solve rounds correctly to fuel and launch the rocket.',
      difficulty: 'Medium',
      points: 200,
      icon: '🚀'
    },
    {
      id: 'symbol-builder',
      name: 'Equation Builder Lab',
      description: 'Build complete equations using operators and results.',
      difficulty: 'Medium',
      points: 150,
      icon: '🧩'
    },
    {
      id: 'pattern-explorer',
      name: 'Pattern Explorer Quest',
      description: 'Discover and complete number patterns.',
      difficulty: 'Hard',
      points: 250,
      icon: '✨'
    },
    {
      id: 'symbol-adventure',
      name: 'Math Treasure Adventure',
      description: 'Choose paths and symbols to unlock treasure.',
      difficulty: 'Hard',
      points: 300,
      icon: '🎪'
    },
    {
      id: 'symbol-grid-quiz',
      name: 'Symbol Grid Quiz',
      description: 'Learn with a full symbol grid and family quiz rounds.',
      difficulty: 'Medium',
      points: 220,
      icon: '🧠'
    }
  ];

  res.json({ success: true, games });
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

await connectDbIfAvailable();

app.listen(PORT, () => {
  console.log(`🚀 Autism Learn Portal Backend running on http://localhost:${PORT}`);
  console.log(`📚 6 Educational Games | 🎓 AI Chatbot | 🏆 Reward System Active`);
});
