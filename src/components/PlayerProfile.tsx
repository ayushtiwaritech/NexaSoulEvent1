import React from 'react';
import type { OperativeProfile } from '../types/operative';

interface PlayerProfileProps {
  profile: OperativeProfile;
}

export const PlayerProfile: React.FC<PlayerProfileProps> = ({ profile }) => {
  // Calculate percentage within the current grade bracket
  const gradeSpan = profile.nextGradeXp - profile.prevGradeXp;
  const currentProgress = profile.currentXp - profile.prevGradeXp;
  const rawPercentage = Math.min(Math.max((currentProgress / gradeSpan) * 100, 0), 100);
  const xpPercent = Math.round(rawPercentage);
  const xpRemaining = Math.max(profile.nextGradeXp - profile.currentXp, 0);

  const getNextGradeTitle = (grade: string) => {
    switch (grade) {
      case 'Cadet': return 'Field Operative';
      case 'Field Operative': return 'Specialist';
      case 'Specialist': return 'Vanguard';
      case 'Vanguard': return 'Ghost Elite';
      default: return 'Maximum Tier Reached';
    }
  };

  return (
    <section className="profile-section">
      <div className="profile-card">
        <div className="profile-card-glow"></div>
        
        {/* Left Column: Avatar & Call-sign */}
        <div className="profile-main-meta">
          <div className="avatar-wrapper">
            <img src={profile.avatarUrl} alt={profile.name} className="profile-avatar-img" />
            <div className="avatar-ring-tier">Tier {profile.gradeTier}</div>
          </div>
          
          <div className="profile-details">
            <div className="profile-top-line">
              <span className="operative-id-badge">{profile.campusId}</span>
              <span className="department-tag">{profile.department}</span>
            </div>
            
            <h2 className="operative-name-heading">
              {profile.name} <span className="callsign-bracket">&lt;{profile.callsign}&gt;</span>
            </h2>
            
            <div className="grade-badge-row">
              <span className="grade-pill">
                <span className="grade-icon">◈</span>
                Grade {profile.gradeTier}: {profile.grade}
              </span>
              <span className="standing-pill">
                Rank #{profile.campusRank} on Campus
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: XP Progression Bar */}
        <div className="profile-progression-box">
          <div className="xp-metric-header">
            <div className="xp-metric-left">
              <span className="xp-label">EXPERIENCE (XP) ACCUMULATOR</span>
              <div className="xp-value-main">
                <span className="xp-number">{profile.currentXp.toLocaleString()}</span>
                <span className="xp-denominator">/ {profile.nextGradeXp.toLocaleString()} XP</span>
              </div>
            </div>
            <div className="xp-metric-right">
              <span className="next-grade-hint">Next Grade: <strong>{getNextGradeTitle(profile.grade)}</strong></span>
              <span className="xp-remaining-badge">+{xpRemaining.toLocaleString()} XP Needed</span>
            </div>
          </div>

          {/* Progress Bar Container */}
          <div className="xp-track-outer" role="progressbar" aria-valuenow={xpPercent} aria-valuemin={0} aria-valuemax={100}>
            <div 
              className="xp-track-fill" 
              style={{ width: `${xpPercent}%` }}
            >
              <div className="xp-track-shimmer"></div>
            </div>
            <div className="xp-percent-label">{xpPercent}%</div>
          </div>

          <div className="xp-footer-milestones">
            <span>Tier {profile.gradeTier} ({profile.prevGradeXp.toLocaleString()} XP)</span>
            <span>Current: {profile.currentXp.toLocaleString()} XP</span>
            <span>Tier {profile.gradeTier + 1} ({profile.nextGradeXp.toLocaleString()} XP)</span>
          </div>
        </div>
      </div>

      {/* Operative Stat Badges Grid */}
      <div className="operative-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap accent-blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div>
            <div className="stat-val">{profile.missionsCompleted}</div>
            <div className="stat-lbl">Missions Completed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap accent-amber">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <div>
            <div className="stat-val">{profile.activeMissionsCount}</div>
            <div className="stat-lbl">Active Directives</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap accent-emerald">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div>
            <div className="stat-val">{profile.accuracyRate}%</div>
            <div className="stat-lbl">Verification Rate</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap accent-purple">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div>
            <div className="stat-val">#{profile.campusRank}</div>
            <div className="stat-lbl">Campus Rank</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap accent-cyan">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div>
            <div className="stat-val">{profile.streakDays} Days</div>
            <div className="stat-lbl">Active Ops Streak</div>
          </div>
        </div>
      </div>
    </section>
  );
};
