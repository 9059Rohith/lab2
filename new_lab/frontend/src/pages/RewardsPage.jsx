import { useEffect, useState } from 'react';
import { fetchStats } from '../api';
import { speak } from '../utils';

export default function RewardsPage({ userId, voiceEnabled, refreshTrigger }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats(userId).then((data) => {
      if (data?.success) {
        setStats(data);
        if (voiceEnabled) {
          speak(`Your total points are ${data.totalPoints}. Great job!`, true);
        }
      }
    }).catch(() => undefined);
  }, [userId, refreshTrigger, voiceEnabled]);

  if (!stats) {
    return <section className="page-wrap"><h2>Rewards</h2><p>Loading progress...</p></section>;
  }

  return (
    <section className="page-wrap">
      <h2>Your Rewards</h2>
      <div className="stats-grid">
        <div className="stat"><span>Total Points</span><strong>{stats.totalPoints}</strong></div>
        <div className="stat"><span>Games Played</span><strong>{stats.gamesPlayed}</strong></div>
        <div className="stat"><span>Badges</span><strong>{stats.rewards.length}</strong></div>
      </div>

      <h3>Recent Scores</h3>
      <div className="history-list">
        {stats.gameScores.length === 0 && <p>No games played yet.</p>}
        {stats.gameScores.map((item) => (
          <div className="history-item" key={item._id || `${item.gameId}-${item.createdAt}`}>
            <span>{item.gameName}</span>
            <span>{item.score} pts</span>
            <span>{item.status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
