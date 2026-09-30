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
      case 'Accepted': return 'status-badge status-accepted cursed-badge-accepted';
      case 'In Progress': return 'status-badge status-in-progress cursed-badge-progress';
      case 'Submitted': return 'status-badge status-submitted cursed-badge-submitted';
      case 'Completed': return 'status-badge status-completed cursed-badge-completed';
    }
  };

  const getStatusKanji = (status: MissionStatus) => {
    switch (status) {
      case 'Accepted': return '受領';
      case 'In Progress': return '進行';
      case 'Submitted': return '提出';
      case 'Completed': return '祓除';
    }
  };

  const getDifficultyClass = (diff: string) => {
    if (diff.includes('Critical') || diff.includes('Classified')) return 'diff-tag diff-critical cursed-diff-critical';
    if (diff.includes('Tactical')) return 'diff-tag diff-tactical cursed-diff-tactical';
    return 'diff-tag diff-routine cursed-diff-routine';
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
          <div className="section-title-with-badge">
            <h2 className="section-title">Active Missions & Directives</h2>
            <span className="kanji-header-tag">呪詛討伐</span>
          </div>
          <p className="section-subtitle">
            Accept campus exorcism quests, fulfill tactical criteria, and submit cryptographic proof for verification.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="status-tabs-container cursed-filter-tabs">
          {(['All', 'Accepted', 'In Progress', 'Submitted', 'Completed'] as const).map((tab) => (
            <button
              key={tab}
              className={`status-tab-btn ${filter === tab ? 'active' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab === 'Completed' ? 'Exorcised' : tab}{' '}
              <span className="tab-count">{statusCounts[tab]}</span>
            </button>
          ))}
        </div>
      </div>

      {filteredMissions.length === 0 ? (
        <div className="empty-missions-state cursed-empty-state">
          <div className="empty-icon">☯</div>
          <div className="empty-title">No Directives in &quot;{filter}&quot;</div>
          <p className="empty-desc">Shift filter parameters or accept outstanding campus directives.</p>
        </div>
      ) : (
        <div className="missions-grid">
          {filteredMissions.map((mission) => {
            return (
              <div
                key={mission.id}
                className={`mission-card cursed-mission-card status-border-${mission.status.toLowerCase().replace(' ', '-')}`}
              >
                {/* Mission Header */}
                <div className="mission-card-top">
                  <div className="mission-code-row">
                    <span className="mission-code-pill cursed-code-pill">{mission.code}</span>
                    <span className="mission-category-pill">{mission.category}</span>
                    <span className={getDifficultyClass(mission.difficulty)}>{mission.difficulty}</span>
                  </div>

                  <div className={getStatusBadgeClass(mission.status)}>
                    <span className="status-indicator-dot"></span>
                    <span>{mission.status === 'Completed' ? 'Exorcised' : mission.status}</span>
                    <span className="badge-kanji-sub">({getStatusKanji(mission.status)})</span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="mission-card-title">{mission.title}</h3>
                <p className="mission-card-summary">{mission.summary}</p>

                {/* Objectives Checklist */}
                <div className="mission-objectives-box cursed-objectives-box">
                  <div className="objectives-header">
                    <span>
                      TACTICAL CRITERIA ({mission.objectives.filter(o => o.isCompleted).length}/{mission.objectives.length})
                    </span>
                    <span className="progress-percent-text">{mission.progressPercent}% Synchronized</span>
                  </div>

                  {/* Progress indicator */}
                  <div className="objective-progress-bar cursed-obj-progress">
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
                            className="custom-checkbox cursed-checkbox"
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
                  <div className="proof-preview-banner cursed-proof-banner">
                    <div className="proof-banner-header">
                      <span className="proof-label">
                        <span className="seal-glyph">封</span>
                        Proof Verified & Sealed:
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
                      <p className="proof-notes-preview">&quot;{mission.proofSubmission.notes}&quot;</p>
                    )}
                  </div>
                )}

                {/* Card Footer: Rewards & Actions */}
                <div className="mission-card-footer">
                  <div className="rewards-wrap">
                    <div className="reward-item xp-reward cursed-xp-reward">
                      <span className="xp-glyph">呪</span>
                      +{mission.xpReward} XP
                    </div>
                    <div className="reward-item credits-reward">
                      +{mission.creditsReward} Credits
                    </div>
                    <div className="deadline-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {mission.deadlineTimestamp}
                    </div>
                  </div>

                  <div className="action-buttons-wrap">
                    {mission.status === 'Accepted' && (
                      <button
                        className="btn-action btn-start cursed-btn-start"
                        onClick={() => onStartMission(mission.id)}
                      >
                        <span className="btn-glyph">⚡</span>
                        Technique Activated
                      </button>
                    )}

                    {mission.status === 'In Progress' && (
                      <button
                        className="btn-action btn-submit cursed-btn-submit"
                        onClick={() => onOpenProofModal(mission)}
                      >
                        <span className="btn-glyph">印</span>
                        Submit Proof
                      </button>
                    )}

                    {mission.status === 'Submitted' && (
                      <button
                        className="btn-action btn-simulate-verify cursed-btn-verify"
                        onClick={() => onSimulateApprove(mission.id)}
                        title="Simulate faculty approval and trigger cinematic exorcism sequence"
                      >
                        <span className="btn-glyph">祓</span>
                        Simulate Approval & Claim XP
                      </button>
                    )}

                    {mission.status === 'Completed' && (
                      <div className="completed-stamp cursed-completed-stamp">
                        <span className="stamp-kanji">祓除済</span>
                        Mission Exorcised
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
