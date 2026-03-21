// ============================================
// CRUD OPERATIONS - Complete MongoDB Integration
// ============================================

// ==================== USER PROFILE CRUD ====================

export const createUserProfile = async (app, models) => {
  const { UserProfile } = models;
  
  // CREATE user profile
  app.post('/api/users/', async (req, res) => {
    try {
      const { userId, name, email, age, preferences } = req.body;
      if (!userId || !name || !email) {
        return res.status(400).json({ success: false, error: 'userId, name, and email are required' });
      }
      
      const profile = await UserProfile.create({ userId, name, email, age, preferences });
      res.status(201).json({ success: true, message: 'User profile created', data: profile });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // READ all user profiles
  app.get('/api/users', async (req, res) => {
    try {
      const profiles = await UserProfile.find();
      res.json({ success: true, data: profiles, count: profiles.length });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // READ single user profile
  app.get('/api/users/:userId', async (req, res) => {
    try {
      const profile = await UserProfile.findOne({ userId: req.params.userId });
      if (!profile) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.json({ success: true, data: profile });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // UPDATE user profile
  app.put('/api/users/:userId', async (req, res) => {
    try {
      const { name, email, age, preferences } = req.body;
      const profile = await UserProfile.findOneAndUpdate(
        { userId: req.params.userId },
        { name, email, age, preferences },
        { new: true }
      );
      if (!profile) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.json({ success: true, message: 'User profile updated', data: profile });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // DELETE user profile
  app.delete('/api/users/:userId', async (req, res) => {
    try {
      const profile = await UserProfile.findOneAndDelete({ userId: req.params.userId });
      if (!profile) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.json({ success: true, message: 'User profile deleted', data: profile });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
};

// ==================== GAME SCORE CRUD ====================

export const createGameScoreCrud = async (app, models) => {
  const { GameScore } = models;
  
  // CREATE game score (override existing)
  app.post('/api/crud/game-scores', async (req, res) => {
    try {
      const { gameId, gameName, userId, score, timeSpent, level, correctAnswers, totalQuestions, status } = req.body;
      if (!gameId || !gameName || !userId || score === undefined) {
        return res.status(400).json({ success: false, error: 'gameId, gameName, userId, and score are required' });
      }
      
      const gameScore = await GameScore.create({
        gameId, gameName, userId, score, timeSpent: timeSpent || 0, 
        level: level || 1, correctAnswers: correctAnswers || 0, 
        totalQuestions: totalQuestions || 0, status: status || 'completed'
      });
      res.status(201).json({ success: true, message: 'Game score created', data: gameScore });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // READ all game scores
  app.get('/api/crud/game-scores', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const gameScores = await GameScore.find().limit(limit).sort({ createdAt: -1 });
      res.json({ success: true, data: gameScores, count: gameScores.length });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // READ by game ID
  app.get('/api/crud/game-scores/by-game/:gameId', async (req, res) => {
    try {
      const scores = await GameScore.find({ gameId: req.params.gameId }).sort({ createdAt: -1 });
      res.json({ success: true, data: scores, count: scores.length });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // READ by user ID
  app.get('/api/crud/game-scores/by-user/:userId', async (req, res) => {
    try {
      const scores = await GameScore.find({ userId: req.params.userId }).sort({ createdAt: -1 });
      res.json({ success: true, data: scores, count: scores.length });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // READ single score
  app.get('/api/crud/game-scores/:id', async (req, res) => {
    try {
      const score = await GameScore.findById(req.params.id);
      if (!score) {
        return res.status(404).json({ success: false, error: 'Game score not found' });
      }
      res.json({ success: true, data: score });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // UPDATE game score
  app.put('/api/crud/game-scores/:id', async (req, res) => {
    try {
      const score = await GameScore.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!score) {
        return res.status(404).json({ success: false, error: 'Game score not found' });
      }
      res.json({ success: true, message: 'Game score updated', data: score });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // DELETE game score
  app.delete('/api/crud/game-scores/:id', async (req, res) => {
    try {
      const score = await GameScore.findByIdAndDelete(req.params.id);
      if (!score) {
        return res.status(404).json({ success: false, error: 'Game score not found' });
      }
      res.json({ success: true, message: 'Game score deleted', data: score });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
};

// ==================== REWARD CRUD ====================

export const createRewardCrud = async (app, models) => {
  const { Reward } = models;
  
  // CREATE reward
  app.post('/api/crud/rewards', async (req, res) => {
    try {
      const { userId, type, points, gameId, description, badge } = req.body;
      if (!userId || !type || points === undefined) {
        return res.status(400).json({ success: false, error: 'userId, type, and points are required' });
      }
      
      const reward = await Reward.create({ userId, type, points, gameId, description, badge });
      res.status(201).json({ success: true, message: 'Reward created', data: reward });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // READ all rewards
  app.get('/api/crud/rewards', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const rewards = await Reward.find().limit(limit).sort({ createdAt: -1 });
      res.json({ success: true, data: rewards, count: rewards.length });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // READ by user ID
  app.get('/api/crud/rewards/by-user/:userId', async (req, res) => {
    try {
      const rewards = await Reward.find({ userId: req.params.userId }).sort({ createdAt: -1 });
      const totalPoints = rewards.reduce((sum, r) => sum + (r.points || 0), 0);
      res.json({ success: true, data: rewards, totalPoints, count: rewards.length });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // READ single reward
  app.get('/api/crud/rewards/:id', async (req, res) => {
    try {
      const reward = await Reward.findById(req.params.id);
      if (!reward) {
        return res.status(404).json({ success: false, error: 'Reward not found' });
      }
      res.json({ success: true, data: reward });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // UPDATE reward
  app.put('/api/crud/rewards/:id', async (req, res) => {
    try {
      const reward = await Reward.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!reward) {
        return res.status(404).json({ success: false, error: 'Reward not found' });
      }
      res.json({ success: true, message: 'Reward updated', data: reward });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // DELETE reward
  app.delete('/api/crud/rewards/:id', async (req, res) => {
    try {
      const reward = await Reward.findByIdAndDelete(req.params.id);
      if (!reward) {
        return res.status(404).json({ success: false, error: 'Reward not found' });
      }
      res.json({ success: true, message: 'Reward deleted', data: reward });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
};

// ==================== CHAT HISTORY CRUD ====================

export const createChatHistoryCrud = async (app, models) => {
  const { ChatHistory } = models;
  
  // CREATE chat entry
  app.post('/api/crud/chat-history', async (req, res) => {
    try {
      const { userId, userMessage, botResponse, context, game } = req.body;
      if (!userId || !userMessage || !botResponse) {
        return res.status(400).json({ success: false, error: 'userId, userMessage, and botResponse are required' });
      }
      
      const chat = await ChatHistory.create({ userId, userMessage, botResponse, context, game });
      res.status(201).json({ success: true, message: 'Chat entry created', data: chat });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // READ all chat history
  app.get('/api/crud/chat-history', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const chats = await ChatHistory.find().limit(limit).sort({ createdAt: -1 });
      res.json({ success: true, data: chats, count: chats.length });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // READ by user ID
  app.get('/api/crud/chat-history/by-user/:userId', async (req, res) => {
    try {
      const chats = await ChatHistory.find({ userId: req.params.userId }).sort({ createdAt: -1 });
      res.json({ success: true, data: chats, count: chats.length });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // READ single chat
  app.get('/api/crud/chat-history/:id', async (req, res) => {
    try {
      const chat = await ChatHistory.findById(req.params.id);
      if (!chat) {
        return res.status(404).json({ success: false, error: 'Chat entry not found' });
      }
      res.json({ success: true, data: chat });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // UPDATE chat entry
  app.put('/api/crud/chat-history/:id', async (req, res) => {
    try {
      const chat = await ChatHistory.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!chat) {
        return res.status(404).json({ success: false, error: 'Chat entry not found' });
      }
      res.json({ success: true, message: 'Chat entry updated', data: chat });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // DELETE chat entry
  app.delete('/api/crud/chat-history/:id', async (req, res) => {
    try {
      const chat = await ChatHistory.findByIdAndDelete(req.params.id);
      if (!chat) {
        return res.status(404).json({ success: false, error: 'Chat entry not found' });
      }
      res.json({ success: true, message: 'Chat entry deleted', data: chat });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
};
