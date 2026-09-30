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
      case 1: return 'podium-rank rank-1 cursed-rank-1';
      case 2: return 'podium-rank rank-2 cursed-rank-2';
      case 3: return 'podium-rank rank-3 cursed-rank-3';
      default: return 'podium-rank rank-standard';
    }
  };

  const getGradeKanji = (grade: string) => {
    switch (grade) {
      case 'Special Grade': return '特級';
      case 'Grade 1': return '一級';
      case 'Grade 2': return '二級';
      case 'Grade 3': return '三級';
      case 'Grade 4': return '四級';
      default: return '術師';
    }
  };

  return (
    <section className="leaderboard-section">
      <div className="section-header-row">
        <div>
          <div className="section-title-with-badge">
            <h2 className="section-title">Campus Sorcerer & Operative Leaderboard</h2>
            <span className="kanji-header-tag">呪術階位番付</span>
          </div>
          <p className="section-subtitle">
            Real-time rankings calibrated by verified exorcisms, tactical talisman precision, and acquired cursed energy (XP).
          </p>
        </div>

        <div className="timeframe-picker cursed-timeframe">
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
            <div key={op.operativeId} className={`podium-card card-rank-${podiumOrder} cursed-podium-card`}>
              <div className="podium-crown">
                {podiumOrder === 1 && '👑 特級 // SPECIAL GRADE'}
                {podiumOrder === 2 && '🥈 一級 // GRADE 1 ELITE'}
                {podiumOrder === 3 && '🥉 一級 // GRADE 1 VANGUARD'}
              </div>

              <div className={getRankBadgeClass(op.rank)}>#{op.rank}</div>

              <div className="podium-callsign">{op.callsign}</div>
              <div className="podium-name">{op.name}</div>
              <div className="podium-dept">{op.department}</div>

              <div className="podium-xp-box cursed-podium-xp">
                <span className="podium-xp-number">{op.totalXp.toLocaleString()}</span>
                <span className="podium-xp-unit">XP ACCUMULATED (呪力)</span>
              </div>

              <div className="podium-footer-meta">
                <span>{op.completedMissionsCount} Exorcised</span>
                <span>•</span>
                <span>{op.streakDays}d Streak</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leaderboard Table */}
      <div className="leaderboard-table-card cursed-table-card">
        <div className="table-search-bar cursed-search-bar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className="table-search-input cursed-search-input"
            placeholder="Search by callsign, operative name, or squad branch..."
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
                <th className="col-dept">SQUAD / DOMAIN</th>
                <th className="col-grade">GRADE</th>
                <th className="col-missions">EXORCISMS</th>
                <th className="col-streak">STREAK</th>
                <th className="col-xp">CURSED ENERGY</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((row) => (
                <tr 
                  key={row.operativeId} 
                  className={`table-row ${row.isCurrentUser ? 'current-user-row cursed-user-row' : ''}`}
                >
                  <td className="col-rank">
                    <div className="rank-indicator-cell">
                      <span className="rank-number">#{row.rank}</span>
                      {row.rankChange === 'up' && <span className="trend-up" title="Ascending">▲</span>}
                      {row.rankChange === 'down' && <span className="trend-down" title="Descending">▼</span>}
                      {row.rankChange === 'same' && <span className="trend-same" title="Stable">—</span>}
                    </div>
                  </td>
                  <td className="col-op">
                    <div className="op-info-cell">
                      <div className="op-callsign-text">
                        {row.callsign}
                        {row.isCurrentUser && <span className="you-pill cursed-you-pill">YOU // 術師</span>}
                      </div>
                      <div className="op-fullname">{row.name}</div>
                    </div>
                  </td>
                  <td className="col-dept">{row.department}</td>
                  <td className="col-grade">
                    <span className="table-grade-pill cursed-table-grade">
                      {row.grade} <span className="table-kanji">({getGradeKanji(row.grade)})</span>
                    </span>
                  </td>
                  <td className="col-missions">{row.completedMissionsCount} verified</td>
                  <td className="col-streak">
                    <span className="streak-tag cursed-streak">🔥 {row.streakDays}d</span>
                  </td>
                  <td className="col-xp">
                    <span className="table-xp-val cursed-table-xp">{row.totalXp.toLocaleString()} XP</span>
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
