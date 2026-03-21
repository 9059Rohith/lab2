const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

export async function fetchGames() {
  const res = await fetch(`${API_BASE}/games/list`);
  return res.json();
}

export async function chatWithTutor(payload) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function submitScore(payload) {
  const res = await fetch(`${API_BASE}/games/submit-score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function fetchStats(userId) {
  const res = await fetch(`${API_BASE}/games/user-stats/${userId}`);
  return res.json();
}

// ==================== USER PROFILE CRUD ====================

export async function createUserProfile(profileData) {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData)
  });
  return res.json();
}

export async function fetchUserProfile(userId) {
  const res = await fetch(`${API_BASE}/users/${userId}`);
  return res.json();
}

export async function updateUserProfile(userId, profileData) {
  const res = await fetch(`${API_BASE}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData)
  });
  return res.json();
}

export async function deleteUserProfile(userId) {
  const res = await fetch(`${API_BASE}/users/${userId}`, {
    method: 'DELETE'
  });
  return res.json();
}

// ==================== GAME SCORES CRUD ====================

export async function createGameScore(scoreData) {
  const res = await fetch(`${API_BASE}/crud/game-scores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scoreData)
  });
  return res.json();
}

export async function fetchGameScores(limit = 50) {
  const res = await fetch(`${API_BASE}/crud/game-scores?limit=${limit}`);
  return res.json();
}

export async function fetchUserGameScores(userId) {
  const res = await fetch(`${API_BASE}/crud/game-scores/by-user/${userId}`);
  return res.json();
}

export async function updateGameScore(scoreId, scoreData) {
  const res = await fetch(`${API_BASE}/crud/game-scores/${scoreId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scoreData)
  });
  return res.json();
}

export async function deleteGameScore(scoreId) {
  const res = await fetch(`${API_BASE}/crud/game-scores/${scoreId}`, {
    method: 'DELETE'
  });
  return res.json();
}

// ==================== REWARDS CRUD ====================

export async function createReward(rewardData) {
  const res = await fetch(`${API_BASE}/crud/rewards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rewardData)
  });
  return res.json();
}

export async function fetchUserRewards(userId) {
  const res = await fetch(`${API_BASE}/crud/rewards/by-user/${userId}`);
  return res.json();
}
