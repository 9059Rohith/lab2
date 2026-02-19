import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌟 MongoDB Atlas Connected Successfully!');
    console.log('🚀 Database: autism-space-learn');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

connectDB();

// ==================== MONGODB SCHEMAS ====================

// Progress Schema - Child Learning Progress
const progressSchema = new mongoose.Schema({
  childName: { type: String, required: true },
  age: { type: Number, required: true },
  level: { type: String, enum: ['Beginner', 'Explorer', 'Star Commander'], default: 'Beginner' },
  parentName: String,
  parentEmail: { type: String, required: true },
  favoriteSpace: { type: String, enum: ['Moon', 'Star', 'Rocket', 'Planet'] },
  symbolsLearned: [String],
  score: { type: Number, default: 0 },
  specialNotes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Feedback Schema - Activity Feedback
const feedbackSchema = new mongoose.Schema({
  childName: { type: String, required: true },
  activitiesTried: [String],
  symbolsCount: { type: Number, default: 0 },
  funRating: { type: String, enum: ['😊', '😐', '😢'] },
  favSymbol: String,
  parentComments: String,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

// Symbol Learned Schema - Individual Symbol Tracking
const symbolLearnedSchema = new mongoose.Schema({
  childName: { type: String, required: true },
  symbol: { type: String, required: true },
  symbolName: { type: String, required: true },
  category: String,
  learnedAt: { type: Date, default: Date.now }
});

// Contact Schema - Contact Form
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

// Models
const Progress = mongoose.model('Progress', progressSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);
const SymbolLearned = mongoose.model('SymbolLearned', symbolLearnedSchema);
const Contact = mongoose.model('Contact', contactSchema);

// ==================== API ROUTES ====================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '🚀 Star Math Explorer API is running!',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ========== PROGRESS ROUTES ==========

// Save child progress
app.post('/api/progress', async (req, res) => {
  try {
    const progress = new Progress(req.body);
    await progress.save();
    res.json({ 
      success: true, 
      message: '🌟 Your progress is saved in space!',
      data: progress
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get progress by child name
app.get('/api/progress/:name', async (req, res) => {
  try {
    const data = await Progress.find({ 
      childName: { $regex: new RegExp(req.params.name, 'i') }
    }).sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all progress
app.get('/api/all-progress', async (req, res) => {
  try {
    const data = await Progress.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update progress
app.put('/api/progress/:id', async (req, res) => {
  try {
    const progress = await Progress.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json({ success: true, message: 'Progress updated!', data: progress });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== FEEDBACK ROUTES ==========

// Save activity feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.json({ 
      success: true, 
      message: '⭐ Thank you for your feedback!',
      data: feedback
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all feedback
app.get('/api/feedback', async (req, res) => {
  try {
    const data = await Feedback.find().sort({ date: -1 });
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== SYMBOL LEARNED ROUTES ==========

// Mark symbol as learned
app.post('/api/symbol-learned', async (req, res) => {
  try {
    const symbol = new SymbolLearned(req.body);
    await symbol.save();
    
    // Update progress count
    if (req.body.childName) {
      const progress = await Progress.findOne({ childName: req.body.childName });
      if (progress) {
        if (!progress.symbolsLearned.includes(req.body.symbol)) {
          progress.symbolsLearned.push(req.body.symbol);
          progress.score += 10;
          await progress.save();
        }
      }
    }
    
    res.json({ 
      success: true, 
      message: '🌟 Great job! Symbol learned!',
      data: symbol
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get learned symbols by child
app.get('/api/symbol-learned/:name', async (req, res) => {
  try {
    const data = await SymbolLearned.find({ 
      childName: { $regex: new RegExp(req.params.name, 'i') }
    }).sort({ learnedAt: -1 });
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== CONTACT ROUTES ==========

// Save contact message
app.post('/api/contact', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.json({ 
      success: true, 
      message: '📧 Message sent successfully!',
      data: contact
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all contact messages
app.get('/api/contact', async (req, res) => {
  try {
    const data = await Contact.find().sort({ date: -1 });
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== STATISTICS ROUTES ==========

// Get overall statistics
app.get('/api/stats', async (req, res) => {
  try {
    const totalChildren = await Progress.countDocuments();
    const totalSymbolsLearned = await SymbolLearned.countDocuments();
    const totalFeedback = await Feedback.countDocuments();
    const avgScore = await Progress.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$score' } } }
    ]);
    
    res.json({
      success: true,
      stats: {
        totalChildren,
        totalSymbolsLearned,
        totalFeedback,
        averageScore: avgScore[0]?.avgScore || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ERROR HANDLERS ====================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: '🌌 Lost in space! Route not found.' 
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong in space!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ==================== SERVER START ====================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('');
  console.log('🌟✨🚀 ================================== 🚀✨🌟');
  console.log('');
  console.log('     🌟 STAR MATH EXPLORER API 🌟');
  console.log('');
  console.log('🚀✨ Server running on port:', PORT);
  console.log('🌐 API URL: http://localhost:' + PORT);
  console.log('💾 Database: MongoDB Atlas Connected');
  console.log('👨‍🚀 Developer: Rohith Kumar');
  console.log('🎓 Roll No: CB.SC.U4CSECSE23018');
  console.log('🏫 Institution: Amrita School of Computing');
  console.log('');
  console.log('🌟✨🚀 ================================== 🚀✨🌟');
  console.log('');
});

export default app;
