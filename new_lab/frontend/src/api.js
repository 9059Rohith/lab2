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
