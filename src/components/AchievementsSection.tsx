import React, { useState } from 'react';
import type { Achievement, BadgeRarity } from '../types/achievement';

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ achievements }) => {
  const [filter, setFilter] = useState<'All' | 'Unlocked' | 'In Progress'>('All');

  const filteredAchievements = achievements.filter((a) => {
    if (filter === 'Unlocked') return a.isUnlocked;
    if (filter === 'In Progress') return !a.isUnlocked;
    return true;
  });

  const getRarityBadgeClass = (rarity: BadgeRarity) => {
    switch (rarity) {
      case 'Classified': return 'rarity-tag rarity-classified';
      case 'Elite': return 'rarity-tag rarity-elite';
      case 'Tactical': return 'rarity-tag rarity-tactical';
      case 'Common': return 'rarity-tag rarity-common';
    }
  };

  const renderIcon = (type: Achievement['iconType']) => {
    switch (type) {
      case 'shield':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        );
      case 'zap':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        );
      case 'terminal':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="4 17 10 11 4 5"/>
            <line x1="12" y1="19" x2="20" y2="19"/>
          </svg>
        );
      case 'crosshair':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="22" y1="12" x2="18" y2="12"/>
            <line x1="6" y1="12" x2="2" y2="12"/>
            <line x1="12" y1="6" x2="12" y2="2"/>
            <line x1="12" y1="22" x2="12" y2="18"/>
          </svg>
        );
      case 'cpu':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="4" width="16" height="16" rx="2"/>
            <rect x="9" y="9" width="6" height="6"/>
            <line x1="9" y1="1" x2="9" y2="4"/>
            <line x1="15" y1="1" x2="15" y2="4"/>
            <line x1="9" y1="20" x2="9" y2="23"/>
            <line x1="15" y1="20" x2="15" y2="23"/>
            <line x1="20" y1="9" x2="23" y2="9"/>
            <line x1="20" y1="14" x2="23" y2="14"/>
            <line x1="1" y1="9" x2="4" y2="9"/>
            <line x1="1" y1="14" x2="4" y2="14"/>
          </svg>
        );
      case 'trophy':
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
            <path d="M4 22h16"/>
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
          </svg>
        );
    }
  };

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;

  return (
    <section className="achievements-section">
      <div className="section-header-row">
        <div>
          <div className="section-title-with-badge">
            <h2 className="section-title">Commendations & Badges</h2>
            <span className="unlocked-counter-pill">
              {unlockedCount} of {achievements.length} Unlocked
            </span>
          </div>
          <p className="section-subtitle">
            Earn prestigious tactical badges and bonus XP awards through operational excellence.
          </p>
        </div>

        <div className="filter-pill-group">
          {(['All', 'Unlocked', 'In Progress'] as const).map((tab) => (
            <button
              key={tab}
              className={`filter-pill-btn ${filter === tab ? 'active' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="achievements-grid">
        {filteredAchievements.map((ach) => {
          const percent = Math.round((ach.progress / ach.maxProgress) * 100);
          return (
            <div 
              key={ach.id} 
              className={`achievement-card ${ach.isUnlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-top">
                <div className={`achievement-icon-wrapper ${ach.isUnlocked ? 'icon-glowing' : 'icon-dim'}`}>
                  {renderIcon(ach.iconType)}
                  {ach.isUnlocked && (
                    <div className="unlocked-check-chip">
                      ✓
                    </div>
                  )}
                </div>

                <div className="achievement-meta">
                  <span className={getRarityBadgeClass(ach.rarity)}>{ach.rarity}</span>
                  <span className="achievement-xp-bonus">+{ach.xpBonus} XP</span>
                </div>
              </div>

              <h4 className="achievement-name">{ach.name}</h4>
              <p className="achievement-desc">{ach.description}</p>

              {ach.isUnlocked ? (
                <div className="unlocked-footer">
                  <span className="unlocked-date">Awarded {ach.unlockedAt}</span>
                  <span className="status-secured">SECURED</span>
                </div>
              ) : (
                <div className="progress-footer">
                  <div className="progress-labels">
                    <span>Progress</span>
                    <span>{ach.progress} / {ach.maxProgress} ({percent}%)</span>
                  </div>
                  <div className="achievement-progress-track">
                    <div 
                      className="achievement-progress-fill"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
