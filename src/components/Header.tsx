import React from 'react';
import type { OperativeProfile } from '../types/operative';

interface HeaderProps {
  profile: OperativeProfile;
  activeMissionsCount: number;
  onResetProgress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ profile, activeMissionsCount, onResetProgress }) => {
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
    <header className="site-header">
      <div className="header-left">
        <div className="logo-badge cursed-logo-glow">
          <span className="logo-glyph" aria-hidden="true">呪</span>
        </div>
        <div>
          <div className="header-title-row">
            <h1 className="header-title">Mission Operatives</h1>
            <span className="pair-badge cursed-tag">PAIR B // DIRECTIVE</span>
          </div>
          <p className="header-subtitle">
            CU Quest & Exorcism Command <span className="text-divider">•</span>{' '}
            <span className="status-live-pulse cursed-pulse">
              <span className="pulse-dot-cursed"></span>
              CURSED ENERGY STABLE // 呪力同期
            </span>
          </p>
        </div>
      </div>

      <div className="header-right">
        {onResetProgress && (
          <button 
            className="header-reset-btn" 
            onClick={onResetProgress}
            title="Reset demo progress back to initial Grade 3 / 3,450 XP state"
          >
            <span className="reset-glyph">↺</span> Reset Demo
          </button>
        )}

        <div className="header-status-card cursed-panel">
          <div className="header-status-label">ACTIVE EXORCISMS</div>
          <div className="header-status-value">
            <span className="active-highlight">{activeMissionsCount}</span> Directives Engaged
          </div>
        </div>

        <div className="header-profile-chip cursed-chip">
          <img src={profile.avatarUrl} alt={profile.name} className="header-avatar" />
          <div className="header-profile-info">
            <div className="header-callsign">{profile.callsign}</div>
            <div className="header-grade-tag">
              {profile.grade} <span className="kanji-pill">{getGradeKanji(profile.grade)}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
