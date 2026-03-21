# CRUD API Documentation - new_lab

## Overview
This backend implements complete CRUD (Create, Read, Update, Delete) operations with MongoDB integration for the Autism Learn Portal. All endpoints work with both MongoDB and in-memory storage (fallback).

## Base URL
```
http://localhost:3000
```

## Collections & Endpoints

---

## 🧑‍💻 USER PROFILES

### Create User Profile
**POST** `/api/users/`
```json
{
  "userId": "user123",
  "name": "John",
  "email": "john@example.com",
  "age": 8,
  "preferences": {
    "voiceEnabled": true,
    "theme": "light",
    "notificationsEnabled": true
  }
}
```

### Get All Users
**GET** `/api/users`

### Get Single User
**GET** `/api/users/:userId`

### Update User Profile
**PUT** `/api/users/:userId`
```json
{
  "name": "John Updated",
  "age": 9,
  "preferences": { "theme": "dark" }
}
```

### Delete User Profile
**DELETE** `/api/users/:userId`

---

## 🎮 GAME SCORES

### Create Game Score
**POST** `/api/crud/game-scores`
```json
{
  "gameId": "star-chef",
  "gameName": "Star Chef",
  "userId": "user123",
  "score": 250,
  "timeSpent": 120,
  "level": 2,
  "correctAnswers": 8,
  "totalQuestions": 10,
  "status": "completed"
}
```

### Get All Game Scores (with pagination)
**GET** `/api/crud/game-scores?limit=50`

### Get Scores by Game ID
**GET** `/api/crud/game-scores/by-game/star-chef`

### Get Scores by User ID
**GET** `/api/crud/game-scores/by-user/user123`

### Get Single Score
**GET** `/api/crud/game-scores/:scoreId`

### Update Game Score
**PUT** `/api/crud/game-scores/:scoreId`
```json
{
  "score": 300,
  "status": "won"
}
```

### Delete Game Score
**DELETE** `/api/crud/game-scores/:scoreId`

---

## 🏆 REWARDS

### Create Reward
**POST** `/api/crud/rewards`
```json
{
  "userId": "user123",
  "type": "game-completion",
  "points": 500,
  "gameId": "star-chef",
  "description": "Completed Star Chef with 8/10 correct answers!",
  "badge": "🏆"
}
```

### Get All Rewards (with pagination)
**GET** `/api/crud/rewards?limit=50`

### Get Rewards by User (includes total points)
**GET** `/api/crud/rewards/by-user/user123`

### Get Single Reward
**GET** `/api/crud/rewards/:rewardId`

### Update Reward
**PUT** `/api/crud/rewards/:rewardId`
```json
{
  "points": 600,
  "badge": "⭐"
}
```

### Delete Reward
**DELETE** `/api/crud/rewards/:rewardId`

---

## 💬 CHAT HISTORY

### Create Chat Entry
**POST** `/api/crud/chat-history`
```json
{
  "userId": "user123",
  "userMessage": "What is the plus symbol?",
  "botResponse": "The plus symbol (+) means to add numbers together!",
  "context": "learning-session",
  "game": "star-chef"
}
```

### Get All Chat History (with pagination)
**GET** `/api/crud/chat-history?limit=50`

### Get Chat by User ID
**GET** `/api/crud/chat-history/by-user/user123`

### Get Single Chat Entry
**GET** `/api/crud/chat-history/:chatId`

### Update Chat Entry
**PUT** `/api/crud/chat-history/:chatId`
```json
{
  "botResponse": "Updated response"
}
```

### Delete Chat Entry
**DELETE** `/api/crud/chat-history/:chatId`

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed",
  "data": { /* entity data */ },
  "count": 5
}
```

### Error Response
```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

---

## 🗄️ Database Models

### UserProfile
- `userId` (String, unique, required)
- `name` (String, required)
- `email` (String, required)
- `age` (Number)
- `preferences` (Object)
- `totalPoints` (Number)
- `gamesPlayed` (Number)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### GameScore
- `gameId` (String, required)
- `gameName` (String, required)
- `userId` (String, required)
- `score` (Number, required)
- `timeSpent` (Number)
- `level` (Number)
- `correctAnswers` (Number)
- `totalQuestions` (Number)
- `status` (String: 'won', 'lost', 'in-progress', 'completed')
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Reward
- `userId` (String, required)
- `type` (String, required)
- `points` (Number, required)
- `gameId` (String)
- `description` (String)
- `badge` (String)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### ChatHistory
- `userId` (String, required)
- `userMessage` (String, required)
- `botResponse` (String, required)
- `context` (String)
- `game` (String)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

---

## 🔧 Setup Instructions

### 1. MongoDB Connection (Optional)
```bash
# Set environment variable
export MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/autism-learn-portal

# Without MongoDB, app runs in memory mode (data lost on restart)
```

### 2. Start Backend
```bash
cd backend
npm install
npm start
# or for development with auto-reload:
npm run dev
```

### 3. Test CRUD Endpoints
```bash
# Example: Create a game score
curl -X POST http://localhost:3000/api/crud/game-scores \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": "star-chef",
    "gameName": "Star Chef",
    "userId": "user123",
    "score": 250
  }'

# Example: Get all scores for a user
curl http://localhost:3000/api/crud/game-scores/by-user/user123

# Example: Update a score
curl -X PUT http://localhost:3000/api/crud/game-scores/SCORE_ID \
  -H "Content-Type: application/json" \
  -d '{ "score": 300 }'
```

---

## 💾 Data Persistence

**With MongoDB:**
- All data persists permanently
- Suitable for production
- Requires `MONGODB_URI` env variable

**Without MongoDB (Memory Mode):**
- Data stored in RAM
- Lost when server restarts
- Useful for development/testing
- No setup required

---

## 🚀 Deployment Notes

1. Set `MONGODB_URI` in Vercel environment variables
2. All CRUD routes automatically use MongoDB when connected
3. API returns same response format for both storage modes
4. Indexes automatically created for `userId` and `gameId` fields

---

## 📝 Example Workflow

```javascript
// 1. Create user profile
const user = await fetch('/api/users/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user123',
    name: 'Emma',
    email: 'emma@example.com'
  })
});

// 2. Submit game score
await fetch('/api/crud/game-scores', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    gameId: 'gravity-painter',
    gameName: 'Gravity Painter',
    userId: 'user123',
    score: 180
  })
});

// 3. Get user rewards
const rewards = await fetch('/api/crud/rewards/by-user/user123');
const data = await rewards.json();
```

---

## ⚠️ Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (missing required fields) |
| 404 | Not Found |
| 500 | Server Error |

