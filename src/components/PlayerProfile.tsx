import React from 'react';
import type { OperativeProfile, OperativeGrade } from '../types/operative';

interface PlayerProfileProps {
  profile: OperativeProfile;
  isSurging?: boolean;
}

export const PlayerProfile: React.FC<PlayerProfileProps> = ({ profile, isSurging }) => {
  // Progression brackets: Grade 4 -> Grade 3 -> Grade 2 -> Grade 1 -> Special Grade
  const gradeSpan = Math.max(profile.nextGradeXp - profile.prevGradeXp, 1);
  const currentProgress = profile.currentXp - profile.prevGradeXp;
  const rawPercentage = Math.min(Math.max((currentProgress / gradeSpan) * 100, 0), 100);
  const xpPercent = Math.round(rawPercentage);
  const xpRemaining = Math.max(profile.nextGradeXp - profile.currentXp, 0);

  const allGrades: { grade: OperativeGrade; label: string; kanji: string }[] = [
    { grade: 'Grade 4', label: 'Grade 4', kanji: '四級' },
    { grade: 'Grade 3', label: 'Grade 3', kanji: '三級' },
    { grade: 'Grade 2', label: 'Grade 2', kanji: '二級' },
    { grade: 'Grade 1', label: 'Grade 1', kanji: '一級' },
    { grade: 'Special Grade', label: 'Special Grade', kanji: '特級' },
  ];

  const getNextGradeTitle = (grade: OperativeGrade) => {
    switch (grade) {
      case 'Grade 4': return 'Grade 3 (三級)';
      case 'Grade 3': return 'Grade 2 (二級)';
      case 'Grade 2': return 'Grade 1 (一級)';
      case 'Grade 1': return 'Special Grade (特級)';
      default: return 'Maximum Domain Reached';
    }
  };

  const getGradeKanji = (grade: string) => {
    switch (grade) {
      case 'Special Grade': return '特級術師';
      case 'Grade 1': return '一級術師';
      case 'Grade 2': return '二級術師';
      case 'Grade 3': return '三級術師';
      case 'Grade 4': return '四級術師';
      default: return '呪術師';
    }
  };

  return (
    <section className="profile-section">
      <div className={`profile-card cursed-profile-frame ${isSurging ? 'card-surging' : ''}`}>
        <div className="profile-card-glow"></div>
        
        {/* Left Column: Avatar & Callsign */}
        <div className="profile-main-meta">
          <div className="avatar-wrapper">
            <img src={profile.avatarUrl} alt={profile.name} className="profile-avatar-img" />
            <div className="avatar-ring-tier cursed-tier-tag">
              {getGradeKanji(profile.grade)}
            </div>
          </div>
          
          <div className="profile-details">
            <div className="profile-top-line">
              <span className="operative-id-badge cursed-id">{profile.campusId}</span>
              <span className="department-tag">{profile.department}</span>
            </div>
            
            <h2 className="operative-name-heading">
              {profile.name} <span className="callsign-bracket">&lt;{profile.callsign}&gt;</span>
            </h2>
            
            <div className="grade-badge-row">
              <span className="grade-pill cursed-grade-pill">
                <span className="grade-icon">☯</span>
                {profile.grade}
              </span>
              <span className="standing-pill cursed-standing">
                Campus Rank #{profile.campusRank}
              </span>
            </div>

            {/* Visual Grade Progression Sequence: Grade 4 -> Grade 3 -> Grade 2 -> Grade 1 -> Special Grade */}
            <div className="grade-stepper-visual" aria-label="Grade progression track">
              {allGrades.map((g, idx) => {
                const isCurrent = g.grade === profile.grade;
                const isPassed = profile.gradeTier > (5 - idx); // or by tier
                return (
                  <React.Fragment key={g.grade}>
                    <div 
                      className={`stepper-node ${isCurrent ? 'node-active' : ''} ${isPassed ? 'node-passed' : ''}`}
                      title={`${g.label} (${g.kanji})`}
                    >
                      <span className="node-kanji">{g.kanji}</span>
                      <span className="node-text">{g.label}</span>
                    </div>
                    {idx < allGrades.length - 1 && <span className="stepper-arrow">→</span>}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Cursed Energy / XP Progression */}
        <div className="profile-progression-box cursed-progression-frame">
          <div className="xp-metric-header">
            <div className="xp-metric-left">
              <span className="xp-label">
                CURSED ENERGY (呪力) ACCUMULATOR
              </span>
              <div className="xp-value-main">
                <span className={`xp-number ${isSurging ? 'xp-text-surging' : ''}`}>
                  {profile.currentXp.toLocaleString()}
                </span>
                <span className="xp-denominator">/ {profile.nextGradeXp.toLocaleString()} XP</span>
              </div>
            </div>
            <div className="xp-metric-right">
              <span className="next-grade-hint">
                Threshold: <strong>{getNextGradeTitle(profile.grade)}</strong>
              </span>
              <span className="xp-remaining-badge cursed-remaining-pill">
                +{xpRemaining.toLocaleString()} XP to Ascend
              </span>
            </div>
          </div>

          {/* Cursed Energy Progress Bar */}
          <div 
            className={`xp-track-outer cursed-xp-track ${isSurging ? 'track-surging' : ''}`}
            role="progressbar" 
            aria-valuenow={xpPercent} 
            aria-valuemin={0} 
            aria-valuemax={100}
          >
            <div 
              className="xp-track-fill cursed-energy-fill" 
              style={{ width: `${xpPercent}%` }}
            >
              <div className="xp-track-shimmer"></div>
              {/* Flame aura tip */}
              <div className="energy-leading-spark"></div>
            </div>
            <div className="xp-percent-label">{xpPercent}% OUTPUT</div>
          </div>

          <div className="xp-footer-milestones">
            <span>Floor: {profile.prevGradeXp.toLocaleString()} XP</span>
            <span className="active-xp-readout">Active: {profile.currentXp.toLocaleString()} XP</span>
            <span>Ascension: {profile.nextGradeXp.toLocaleString()} XP</span>
          </div>
        </div>
      </div>

      {/* Operative Stat Badges Grid */}
      <div className="operative-stats-grid">
        <div className="stat-card cursed-stat">
          <div className="stat-icon-wrap accent-violet">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div>
            <div className="stat-val">{profile.missionsCompleted}</div>
            <div className="stat-lbl">Missions Exorcised</div>
          </div>
        </div>

        <div className="stat-card cursed-stat">
          <div className="stat-icon-wrap accent-amber">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <div>
            <div className="stat-val">{profile.activeMissionsCount}</div>
            <div className="stat-lbl">Directives Engaged</div>
          </div>
        </div>

        <div className="stat-card cursed-stat">
          <div className="stat-icon-wrap accent-cyan">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div>
            <div className="stat-val">{profile.accuracyRate}%</div>
            <div className="stat-lbl">Seal Accuracy</div>
          </div>
        </div>

        <div className="stat-card cursed-stat">
          <div className="stat-icon-wrap accent-crimson">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div>
            <div className="stat-val">#{profile.campusRank}</div>
            <div className="stat-lbl">Campus Standing</div>
          </div>
        </div>

        <div className="stat-card cursed-stat">
          <div className="stat-icon-wrap accent-emerald">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div>
            <div className="stat-val">{profile.streakDays} Days</div>
            <div className="stat-lbl">Consecutive Ops</div>
          </div>
        </div>
      </div>
    </section>
  );
};
