# 🚀 Star Math Explorer - Autism Education Portal

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-19.2.0-blue.svg)
![Node](https://img.shields.io/badge/Node.js-18+-green.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)

**An Interactive Space-Themed Math Learning Platform for Children with Autism Spectrum Disorder**

[Live Demo](#) | [Documentation](./autism_portal_documentation.tex) | [Deployment Guide](./DEPLOYMENT_GUIDE.md)

</div>

---

## 📖 Table of Contents

- [About](#about)
- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

---

## 🌟 About

**Star Math Explorer** is a comprehensive educational web application specifically designed for children with Autism Spectrum Disorder (ASD). It combines engaging space-themed visuals, interactive games, and evidence-based learning approaches to teach mathematical symbols in an accessible and enjoyable way.

### Why This Application?

Children with ASD often face unique challenges in traditional educational settings:
- Visual learning preferences
- Need for predictable, consistent interfaces
- Benefits from repetition and self-paced learning
- Require reduced sensory overload

Star Math Explorer addresses these needs through:
- ✨ Clear, colorful visual symbols
- 🔊 Optional audio pronunciation
- 🎮 Interactive learning games
- 📊 Progress tracking and achievements
- 🚀 Engaging space adventure theme

---

## ✨ Features

### 🏠 Landing Page
- Welcoming space-themed interface
- Animated background with stars
- Easy navigation to all sections
- Voice-guided welcome messages

### 📚 Learning Module
- **27+ Math Symbols** organized by category:
  - Basic Operations (➕ ➖ ✖️ ➗ =)
  - Special Symbols (π ∞ √ ∑ ² ³)
  - Comparison Operators (< > ≤ ≥ ≠ ≈)
  - Fractions (½ ⅓ ¼ ¾)
- Visual cards with descriptions
- Audio pronunciation with text-to-speech
- Real-world examples and emoji visualizations
- "I Learned This!" tracking system
- Celebratory confetti animations

### 🎮 Interactive Activities
Three engaging game modes:
1. **Symbol Quiz** - Identify math symbols
2. **Memory Match** - Find matching symbol pairs
3. **Match Game** - Connect symbols with descriptions

Features:
- Score tracking
- Instant feedback
- Encouraging messages
- No time pressure - learn at your own pace

### 📊 Progress Tracking
- Personalized progress dashboard
- Overall completion percentage
- Category-specific progress
- Achievement badges system
- Recently learned symbols
- Total score and games played
- Encouraging progress messages

### ℹ️ About Page
- Application mission and purpose
- Feature highlights
- Educational approach
- Technology stack information
- Contact information

### 👥 Team Page
- Developer information
- Project advisor details
- Special thanks section
- Project purpose and vision
- Contribution guidelines

### 🎨 User Experience
- **Voice Toggle** - Enable/disable audio throughout app
- **Animated Backgrounds** - Calming star field animations
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Autism-Friendly UI**:
  - High contrast colors
  - Clear, large buttons
  - Consistent navigation
  - Minimal distractions
  - Predictable interactions

---

## 🛠️ Technologies

### Frontend
- **React 19.2.0** - UI framework
- **React Router 6** - Navigation
- **Vite 8.0** - Build tool and dev server
- **Axios** - HTTP client
- **Web Speech API** - Text-to-speech functionality
- **CSS3** - Styling with animations

### Backend
- **Node.js 18+** - Runtime environment
- **Express.js 4** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose 8** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Tools
- **ESLint** - Code linting
- **Vite HMR** - Hot module replacement
- **Git** - Version control

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (free tier works)
- Modern web browser with speech synthesis support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/9059Rohith/lab2.git
   cd lab2
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Backend Environment**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Edit .env and add your MongoDB URI
   MONGODB_URI=your_mongodb_connection_string
   PORT=3000
   NODE_ENV=development
   ```

4. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Start Development Servers**

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

6. **Open Your Browser**
   ```
   Frontend: http://localhost:5173
   Backend API: http://localhost:3000
   ```

---

## 📁 Project Structure

```
lab2/
├── frontend/                      # React frontend application
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── assets/               # Images and media files
│   │   ├── components/           # Reusable React components
│   │   │   ├── Navigation.jsx
│   │   │   ├── StarField.jsx
│   │   │   └── VoiceToggle.jsx
│   │   ├── pages/                # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LearnPage.jsx
│   │   │   ├── ActivitiesPage.jsx
│   │   │   ├── ProgressPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   └── TeamPage.jsx
│   │   ├── data/                 # Data files
│   │   │   └── symbolsData.js
│   │   ├── utils/                # Utility functions
│   │   │   └── voiceService.js
│   │   ├── App.jsx               # Main app component
│   │   ├── App.css               # App styles
│   │   ├── index.css             # Global styles
│   │   └── main.jsx              # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json               # Vercel deployment config
│
├── backend/                       # Express backend API
│   ├── server.js                 # Main server file
│   ├── package.json
│   ├── .env                      # Environment variables (gitignored)
│   ├── .env.example              # Example environment file
│   └── vercel.json               # Vercel deployment config
│
├── autism_portal_documentation.tex  # LaTeX documentation
├── DEPLOYMENT_GUIDE.md              # Deployment instructions
├── netlify.toml                     # Netlify config
└── README.md                        # This file
```

---

## 📖 Usage

### For Children

1. **Start Learning**
   - Click "Start Learning" on the home page
   - Browse through colorful symbol cards
   - Click "🔊 Speak" to hear each symbol
   - Click "⭐ I Learned This!" when you master a symbol

2. **Play Games**
   - Click "Play Activities"
   - Choose between three fun games
   - Earn points and have fun learning!

3. **Check Progress**
   - Click "My Progress"
   - See how many symbols you've learned
   - Unlock achievement badges
   - Get encouraging messages

### For Parents & Educators

1. **Monitor Progress**
   - View the child's progress dashboard
   - Track learned symbols and scores
   - See category-specific progress

2. **Customize Experience**
   - Use the voice toggle to enable/disable audio based on sensory needs
   - Allow the child to work at their own pace
   - Encourage achievement celebration

3. **Provide Support**
   - Sit with the child during initial sessions
   - Help connect learned symbols to real-world objects
   - Celebrate achievements together

---

## 🔌 API Documentation

### Base URL
```
Development: http://localhost:3000/api
Production: https://your-backend-url.com/api
```

### Endpoints

#### Health Check
```http
GET /api/health
```
Returns API status and database connection state.

#### Progress Management

**Save Child Progress**
```http
POST /api/progress
Content-Type: application/json

{
  "childName": "John",
  "age": 8,
  "level": "Beginner",
  "parentEmail": "parent@example.com"
}
```

**Get Progress by Name**
```http
GET /api/progress/:name
```

**Update Progress**
```http
PUT /api/progress/:id
```

#### Symbol Learning

**Mark Symbol as Learned**
```http
POST /api/symbol-learned
Content-Type: application/json

{
  "childName": "John",
  "symbol": "➕",
  "symbolName": "Plus",
  "category": "basic"
}
```

**Get Learned Symbols**
```http
GET /api/symbol-learned/:name
```

#### Feedback

**Submit Feedback**
```http
POST /api/feedback
Content-Type: application/json

{
  "childName": "John",
  "activitiesTried": ["Quiz", "Memory"],
  "funRating": "😊",
  "parentComments": "Great app!"
}
```

#### Statistics

**Get Overall Stats**
```http
GET /api/stats
```

---

## 🚀 Deployment

See the comprehensive [Deployment Guide](./DEPLOYMENT_GUIDE.md) for detailed instructions on deploying to:
- Vercel
- Netlify
- Render
- Railway
- GitHub Pages

Quick Deploy Options:

**Frontend to Netlify:**
```bash
cd frontend
npm run build
netlify deploy --prod
```

**Backend to Vercel:**
```bash
cd backend
vercel --prod
```

---

## 🤝 Contributing

We welcome contributions from educators, developers, and anyone passionate about accessible education!

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Areas for Contribution

- Adding more math symbols and concepts
- Creating additional learning games
- Improving accessibility features
- Translating to other languages
- Enhancing mobile experience
- Adding more achievement badges
- Improving documentation

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Credits

### Developer
**Rohith Kumar**
- Roll No: CB.SC.U4CSE23018
- Department: CSE-A
- Institution: Amrita Vishwa Vidyapeetham
- GitHub: [@9059Rohith](https://github.com/9059Rohith)

### Project Advisor
**Dr. T. Senthil Kumar**
- Professor, Amrita School of Computing
- Amrita Vishwa Vidyapeetham, Coimbatore
- Email: t_senthilkumar@cb.amrita.edu

### Special Thanks
- Parents and families who provided valuable feedback
- Special education teachers for their expertise
- The autism education research community
- All children who inspired this project

---

## 📞 Contact & Support

- **Email:** rohithkumar@example.com
- **GitHub Issues:** [Report a bug](https://github.com/9059Rohith/lab2/issues)
- **GitHub Repository:** [9059Rohith/lab2](https://github.com/9059Rohith/lab2)

---

## 🌟 Acknowledgments

This project was developed as part of academic coursework at Amrita Vishwa Vidyapeetham, with the goal of creating meaningful educational technology that serves children with special needs.

Special acknowledgment to the autism education community for research and best practices that informed this application's design and development.

---

<div align="center">

**Made with ❤️ for amazing kids exploring the world of mathematics**

⭐ Star this repository if you find it helpful!

</div>
