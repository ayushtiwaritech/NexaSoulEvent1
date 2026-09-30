import React from 'react';
import type { OperativeProfile } from '../types/operative';

interface HeaderProps {
  profile: OperativeProfile;
  activeMissionsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ profile, activeMissionsCount }) => {
  return (
    <header className="site-header">
      <div className="header-left">
        <div className="logo-badge">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </div>
        <div>
          <div className="header-title-row">
            <h1 className="header-title">Mission Operatives</h1>
            <span className="pair-badge">PAIR B // DIRECTIVE</span>
          </div>
          <p className="header-subtitle">
            CU Quest & Mission Command System <span className="text-divider">•</span> <span className="status-live-pulse"><span className="pulse-dot"></span>CAMPUS NETWORK ONLINE</span>
          </p>
        </div>
      </div>

      <div className="header-right">
        <div className="header-status-card">
          <div className="header-status-label">ACTIVE DIRECTIVES</div>
          <div className="header-status-value">
            <span className="active-highlight">{activeMissionsCount}</span> Missions Running
          </div>
        </div>

        <div className="header-profile-chip">
          <img src={profile.avatarUrl} alt={profile.name} className="header-avatar" />
          <div className="header-profile-info">
            <div className="header-callsign">{profile.callsign}</div>
            <div className="header-grade-tag">{profile.grade}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
