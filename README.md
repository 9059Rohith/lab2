# 🚀 Star Math Explorer

**A Professional Educational Platform for Mathematical Symbol Learning**

[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)

An interactive web application designed specifically for children with Autism Spectrum Disorder (ASD) to learn mathematical symbols through evidence-based educational approaches.

---

## 🌟 Features

- **27+ Mathematical Symbols** organized by category (Basic, Special, Comparison, Fractions)
- **Interactive Learning Activities** including Quiz, Memory Match, and Symbol Matching games
- **Progress Tracking** with achievements and category-specific analytics
- **Speech Synthesis** for audio pronunciation of symbols and descriptions
- **Professional Educational Design** with minimal animations and clear visual hierarchy
- **Responsive Design** works on desktop, tablet, and mobile devices

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/9059Rohith/lab2.git
cd lab2
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Configure environment variables**
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB connection string
```

4. **Start the application**

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

5. **Open your browser**
```
http://localhost:5173
```

---

## 📁 Project Structure

```
lab2/
├── frontend/              # React + Vite application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── assets/       # Images and static files
│   │   ├── data/         # Symbol data
│   │   └── utils/        # Helper functions
│   ├── package.json
│   └── vercel.json       # Vercel deployment config
│
├── backend/              # Express + MongoDB API
│   ├── server.js         # Main server file
│   ├── package.json
│   ├── .env.example      # Environment variables template
│   └── vercel.json       # Vercel deployment config
│
├── netlify.toml          # Netlify deployment config
├── start.bat             # Windows startup script
├── start.sh              # Unix startup script
└── README.md
```

---

## 🌐 Deployment

### Deploy Frontend to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Deploy!

### Deploy Frontend to Netlify

The project is preconfigured with `netlify.toml`:

1. Push your code to GitHub
2. Import your repository on [Netlify](https://netlify.com)
3. Netlify will automatically detect the configuration
4. Deploy!

### Deploy Backend to Vercel

1. Import your repository on Vercel
2. Create a new project for the backend
3. Set root directory to `backend`
4. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: production
5. Deploy!

**Environment Variables Required:**
- `MONGODB_URI`: MongoDB Atlas connection string
- `PORT`: (Optional) Default is 3000

---

## 🎮 Usage

### Learning Module
1. Enter your name on the welcome screen
2. Browse symbols by category (All, Basic, Special, Comparison, Fractions)
3. Click "🔊 Speak" to hear pronunciation
4. Click "Mark as Learned" to track progress

### Interactive Activities
- **Symbol Quiz**: Identify symbols from multiple choices
- **Memory Match**: Find matching pairs of symbols
- **Symbol Matching**: Connect symbols with their descriptions

### Progress Tracking
- View overall learning progress
- Track symbols learned by category
- Earn achievement badges
- Monitor activity completion

---

## 🛠️ Technologies

### Frontend
- React 19.2.0
- React Router 6.30.3
- Vite 8.0.0
- Axios for API calls

### Backend
- Node.js & Express 4.18.2
- MongoDB with Mongoose 8.0.0
- CORS enabled
- RESTful API design

### Deployment
- Vercel (Frontend & Backend)
- Netlify (Alternative for Frontend)
- MongoDB Atlas (Database)

---

## 📊 API Endpoints

### Progress API
- `GET /api/progress/:childName` - Get user progress
- `POST /api/symbol-learned` - Mark symbol as learned
- `POST /api/game-played` - Record game activity

---

## 🎨 Design Philosophy

This application follows evidence-based principles for autism education:

- **Visual Clarity**: Clean layouts with clear visual hierarchy
- **Predictable Interface**: Consistent navigation and interaction patterns
- **Minimal Distractions**: Reduced animations and sensory overload
- **Self-Paced Learning**: No time pressure or forced progression
- **Positive Reinforcement**: Encouraging feedback and achievement system

---

## 👨‍💻 Developer

**Rohith Kumar**  
Roll No: CB.SC.U4CSE23018  
Amrita Vishwa Vidyapeetham, Coimbatore

**Course Teacher:** Dr. T. Senthil Kumar  
Amrita School of Computing

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Special thanks to parents, educators, and children who provided feedback
- Research community for evidence-based practices in autism education
- Open source community for the amazing tools and libraries

---

## 📞 Support

For issues, questions, or contributions:
- GitHub Issues: [https://github.com/9059Rohith/lab2/issues](https://github.com/9059Rohith/lab2/issues)
- Repository: [https://github.com/9059Rohith/lab2](https://github.com/9059Rohith/lab2)

---

<div align="center">
Made with ❤️ for accessible education
</div>