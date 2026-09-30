import React, { useState } from 'react';
import type { LeaderboardEntry, LeaderboardTimeframe } from '../types/leaderboard';

interface LeaderboardSectionProps {
  entries: LeaderboardEntry[];
}

export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ entries }) => {
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>('Current Cycle');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = entries.filter((entry) => {
    const match = 
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.callsign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.department.toLowerCase().includes(searchQuery.toLowerCase());
    return match;
  });

  const topThree = entries.slice(0, 3);

  const getRankBadgeClass = (rank: number) => {
    switch (rank) {
      case 1: return 'podium-rank rank-1';
      case 2: return 'podium-rank rank-2';
      case 3: return 'podium-rank rank-3';
      default: return 'podium-rank rank-standard';
    }
  };

  return (
    <section className="leaderboard-section">
      <div className="section-header-row">
        <div>
          <h2 className="section-title">Campus Operatives Leaderboard</h2>
          <p className="section-subtitle">
            Real-time rankings based on verified mission completions, tactical accuracy, and XP points.
          </p>
        </div>

        <div className="timeframe-picker">
          {(['Current Cycle', 'This Week', 'All-Time'] as const).map((t) => (
            <button
              key={t}
              className={`timeframe-btn ${timeframe === t ? 'active' : ''}`}
              onClick={() => setTimeframe(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="podium-grid">
        {topThree.map((op, idx) => {
          const podiumOrder = idx === 0 ? 1 : idx === 1 ? 2 : 3;
          return (
            <div key={op.operativeId} className={`podium-card card-rank-${podiumOrder}`}>
              <div className="podium-crown">
                {podiumOrder === 1 && '👑 1ST PLACE'}
                {podiumOrder === 2 && '🥈 2ND PLACE'}
                {podiumOrder === 3 && '🥉 3RD PLACE'}
              </div>

              <div className={getRankBadgeClass(op.rank)}>#{op.rank}</div>

              <div className="podium-callsign">{op.callsign}</div>
              <div className="podium-name">{op.name}</div>
              <div className="podium-dept">{op.department}</div>

              <div className="podium-xp-box">
                <span className="podium-xp-number">{op.totalXp.toLocaleString()}</span>
                <span className="podium-xp-unit">XP EARNED</span>
              </div>

              <div className="podium-footer-meta">
                <span>{op.completedMissionsCount} Missions</span>
                <span>•</span>
                <span>{op.streakDays} Day Streak</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leaderboard Table */}
      <div className="leaderboard-table-card">
        <div className="table-search-bar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className="table-search-input"
            placeholder="Search by callsign, operative name, or squad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th className="col-rank">RANK</th>
                <th className="col-op">OPERATIVE</th>
                <th className="col-dept">SQUAD / DEPT</th>
                <th className="col-grade">GRADE</th>
                <th className="col-missions">MISSIONS</th>
                <th className="col-streak">STREAK</th>
                <th className="col-xp">TOTAL XP</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((row) => (
                <tr 
                  key={row.operativeId} 
                  className={`table-row ${row.isCurrentUser ? 'current-user-row' : ''}`}
                >
                  <td className="col-rank">
                    <div className="rank-indicator-cell">
                      <span className="rank-number">#{row.rank}</span>
                      {row.rankChange === 'up' && <span className="trend-up" title="Trending Up">▲</span>}
                      {row.rankChange === 'down' && <span className="trend-down" title="Trending Down">▼</span>}
                      {row.rankChange === 'same' && <span className="trend-same" title="Stable">—</span>}
                    </div>
                  </td>
                  <td className="col-op">
                    <div className="op-info-cell">
                      <div className="op-callsign-text">
                        {row.callsign}
                        {row.isCurrentUser && <span className="you-pill">YOU</span>}
                      </div>
                      <div className="op-fullname">{row.name}</div>
                    </div>
                  </td>
                  <td className="col-dept">{row.department}</td>
                  <td className="col-grade">
                    <span className="table-grade-pill">{row.grade}</span>
                  </td>
                  <td className="col-missions">{row.completedMissionsCount} verified</td>
                  <td className="col-streak">
                    <span className="streak-tag">🔥 {row.streakDays}d</span>
                  </td>
                  <td className="col-xp">
                    <span className="table-xp-val">{row.totalXp.toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
