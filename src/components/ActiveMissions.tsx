import React, { useState } from 'react';
import type { Mission, MissionStatus } from '../types/mission';

interface ActiveMissionsProps {
  missions: Mission[];
  onOpenProofModal: (mission: Mission) => void;
  onToggleObjective: (missionId: string, objectiveId: string) => void;
  onStartMission: (missionId: string) => void;
  onSimulateApprove: (missionId: string) => void;
}

export const ActiveMissions: React.FC<ActiveMissionsProps> = ({
  missions,
  onOpenProofModal,
  onToggleObjective,
  onStartMission,
  onSimulateApprove,
}) => {
  const [filter, setFilter] = useState<'All' | MissionStatus>('All');

  const filteredMissions = missions.filter((m) => {
    if (filter === 'All') return true;
    return m.status === filter;
  });

  const getStatusBadgeClass = (status: MissionStatus) => {
    switch (status) {
      case 'Accepted': return 'status-badge status-accepted';
      case 'In Progress': return 'status-badge status-in-progress';
      case 'Submitted': return 'status-badge status-submitted';
      case 'Completed': return 'status-badge status-completed';
    }
  };

  const getDifficultyClass = (diff: string) => {
    if (diff.includes('Critical') || diff.includes('Classified')) return 'diff-tag diff-critical';
    if (diff.includes('Tactical')) return 'diff-tag diff-tactical';
    return 'diff-tag diff-routine';
  };

  const statusCounts = {
    All: missions.length,
    Accepted: missions.filter(m => m.status === 'Accepted').length,
    'In Progress': missions.filter(m => m.status === 'In Progress').length,
    Submitted: missions.filter(m => m.status === 'Submitted').length,
    Completed: missions.filter(m => m.status === 'Completed').length,
  };

  return (
    <section className="missions-section">
      <div className="section-header-row">
        <div>
          <h2 className="section-title">Active Missions & Directives</h2>
          <p className="section-subtitle">
            Accept campus quests, complete objective criteria, and submit cryptographic proof for verification.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="status-tabs-container">
          {(['All', 'Accepted', 'In Progress', 'Submitted', 'Completed'] as const).map((tab) => (
            <button
              key={tab}
              className={`status-tab-btn ${filter === tab ? 'active' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab} <span className="tab-count">{statusCounts[tab]}</span>
            </button>
          ))}
        </div>
      </div>

      {filteredMissions.length === 0 ? (
        <div className="empty-missions-state">
          <div className="empty-icon">🛡️</div>
          <div className="empty-title">No Directives in "{filter}"</div>
          <p className="empty-desc">Switch filter or accept new missions from the campus board.</p>
        </div>
      ) : (
        <div className="missions-grid">
          {filteredMissions.map((mission) => {
            return (
              <div 
                key={mission.id} 
                className={`mission-card status-border-${mission.status.toLowerCase().replace(' ', '-')}`}
              >
                {/* Mission Header */}
                <div className="mission-card-top">
                  <div className="mission-code-row">
                    <span className="mission-code-pill">{mission.code}</span>
                    <span className="mission-category-pill">{mission.category}</span>
                    <span className={getDifficultyClass(mission.difficulty)}>{mission.difficulty}</span>
                  </div>

                  <div className={getStatusBadgeClass(mission.status)}>
                    <span className="status-indicator-dot"></span>
                    {mission.status}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="mission-card-title">{mission.title}</h3>
                <p className="mission-card-summary">{mission.summary}</p>

                {/* Objectives Checklist */}
                <div className="mission-objectives-box">
                  <div className="objectives-header">
                    <span>OBJECTIVES CRITERIA ({mission.objectives.filter(o => o.isCompleted).length}/{mission.objectives.length})</span>
                    <span className="progress-percent-text">{mission.progressPercent}% Completed</span>
                  </div>
                  
                  {/* Progress indicator */}
                  <div className="objective-progress-bar">
                    <div 
                      className={`objective-progress-fill status-fill-${mission.status.toLowerCase().replace(' ', '-')}`}
                      style={{ width: `${mission.progressPercent}%` }}
                    />
                  </div>

                  <ul className="objectives-list">
                    {mission.objectives.map((obj) => (
                      <li key={obj.id} className="objective-item">
                        <label className={`objective-checkbox-label ${mission.status === 'Completed' ? 'disabled' : ''}`}>
                          <input
                            type="checkbox"
                            checked={obj.isCompleted}
                            disabled={mission.status === 'Completed' || mission.status === 'Submitted'}
                            onChange={() => onToggleObjective(mission.id, obj.id)}
                            className="custom-checkbox"
                          />
                          <span className={`objective-text ${obj.isCompleted ? 'completed-text' : ''}`}>
                            {obj.title}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Proof Submission Details (If already submitted or completed) */}
                {mission.proofSubmission && (
                  <div className="proof-preview-banner">
                    <div className="proof-banner-header">
                      <span className="proof-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                        </svg>
                        Proof Submitted:
                      </span>
                      <span className={`verification-badge badge-${mission.proofSubmission.verificationStatus.toLowerCase().replace(' ', '-')}`}>
                        {mission.proofSubmission.verificationStatus}
                      </span>
                    </div>
                    <a 
                      href={mission.proofSubmission.evidenceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="proof-evidence-link"
                    >
                      {mission.proofSubmission.evidenceUrl}
                    </a>
                    {mission.proofSubmission.notes && (
                      <p className="proof-notes-preview">"{mission.proofSubmission.notes}"</p>
                    )}
                  </div>
                )}

                {/* Card Footer: Rewards & Actions */}
                <div className="mission-card-footer">
                  <div className="rewards-wrap">
                    <div className="reward-item xp-reward">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      +{mission.xpReward} XP
                    </div>
                    <div className="reward-item credits-reward">
                      +{mission.creditsReward} Credits
                    </div>
                    <div className="deadline-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {mission.deadlineTimestamp}
                    </div>
                  </div>

                  <div className="action-buttons-wrap">
                    {mission.status === 'Accepted' && (
                      <button 
                        className="btn-action btn-start"
                        onClick={() => onStartMission(mission.id)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                        Start Operation
                      </button>
                    )}

                    {mission.status === 'In Progress' && (
                      <button 
                        className="btn-action btn-submit"
                        onClick={() => onOpenProofModal(mission)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        Submit Proof
                      </button>
                    )}

                    {mission.status === 'Submitted' && (
                      <button 
                        className="btn-action btn-simulate-verify"
                        onClick={() => onSimulateApprove(mission.id)}
                        title="Simulate peer/faculty verification review and claim XP immediately"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Simulate Approval & Claim XP
                      </button>
                    )}

                    {mission.status === 'Completed' && (
                      <div className="completed-stamp">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Verified & Archived
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
