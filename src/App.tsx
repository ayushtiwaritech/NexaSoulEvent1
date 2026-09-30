import React, { useState } from 'react';
import { initialOperativeProfile, initialMissions, mockAchievements, mockLeaderboard } from './data/mockData';
import type { Mission } from './types/mission';
import { Header } from './components/Header';
import { PlayerProfile } from './components/PlayerProfile';
import { ActiveMissions } from './components/ActiveMissions';
import { ProofSubmissionModal } from './components/ProofSubmissionModal';
import { AchievementsSection } from './components/AchievementsSection';
import { LeaderboardSection } from './components/LeaderboardSection';
import './App.css';

export const App: React.FC = () => {
  const [profile, setProfile] = useState(initialOperativeProfile);
  const [missions, setMissions] = useState<Mission[]>(initialMissions);
  const [achievements, setAchievements] = useState(mockAchievements);
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard);
  const [activeTab, setActiveTab] = useState<'missions' | 'achievements' | 'leaderboard'>('missions');

  // Proof Modal State
  const [selectedMissionForProof, setSelectedMissionForProof] = useState<Mission | null>(null);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4500);
  };

  // Toggle objective checkbox
  const handleToggleObjective = (missionId: string, objectiveId: string) => {
    setMissions((prev) =>
      prev.map((mission) => {
        if (mission.id !== missionId) return mission;
        const updatedObjectives = mission.objectives.map((obj) =>
          obj.id === objectiveId ? { ...obj, isCompleted: !obj.isCompleted } : obj
        );
        const completedCount = updatedObjectives.filter((o) => o.isCompleted).length;
        const progressPercent = Math.round((completedCount / updatedObjectives.length) * 100);
        return {
          ...mission,
          objectives: updatedObjectives,
          progressPercent,
        };
      })
    );
  };

  // Start mission (Accepted -> In Progress)
  const handleStartMission = (missionId: string) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, status: 'In Progress' } : m))
    );
    showToast('Directive initiated! Status transitioned to [In Progress].');
  };

  // Open Proof Modal
  const handleOpenProofModal = (mission: Mission) => {
    setSelectedMissionForProof(mission);
    setIsProofModalOpen(true);
  };

  // Submit Proof Action
  const handleSubmitProof = (missionId: string, evidenceUrl: string, notes: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== missionId) return m;
        return {
          ...m,
          status: 'Submitted',
          progressPercent: 100,
          objectives: m.objectives.map((obj) => ({ ...obj, isCompleted: true })),
          proofSubmission: {
            id: `sub-${Date.now()}`,
            missionId,
            evidenceUrl,
            notes,
            submittedAt: 'Just now',
            verificationStatus: 'Pending Review',
          },
        };
      })
    );
    showToast(`Cryptographic proof for mission submitted! Status: [Pending Review].`);
  };

  // Simulate Verifier Approval & XP Disbursement
  const handleSimulateApprove = (missionId: string) => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission) return;

    const earnedXp = mission.xpReward;

    // 1. Mark mission completed
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== missionId) return m;
        return {
          ...m,
          status: 'Completed',
          proofSubmission: m.proofSubmission
            ? {
                ...m.proofSubmission,
                verificationStatus: 'Verified',
                verifiedAt: 'Just now',
              }
            : undefined,
        };
      })
    );

    // 2. Grant XP and calculate new progression
    setProfile((prev) => {
      const newXp = prev.currentXp + earnedXp;
      let newGrade = prev.grade;
      let newTier = prev.gradeTier;
      let newNextXp = prev.nextGradeXp;
      let newPrevXp = prev.prevGradeXp;

      // Check if leveled up
      if (newXp >= prev.nextGradeXp) {
        if (prev.grade === 'Specialist') {
          newGrade = 'Vanguard';
          newTier = 4;
          newPrevXp = 5000;
          newNextXp = 8500;
        } else if (prev.grade === 'Vanguard') {
          newGrade = 'Ghost Elite';
          newTier = 5;
          newPrevXp = 8500;
          newNextXp = 15000;
        }
      }

      return {
        ...prev,
        currentXp: newXp,
        grade: newGrade,
        gradeTier: newTier,
        prevGradeXp: newPrevXp,
        nextGradeXp: newNextXp,
        missionsCompleted: prev.missionsCompleted + 1,
        activeMissionsCount: Math.max(prev.activeMissionsCount - 1, 0),
        campusRank: Math.max(prev.campusRank - 1, 1), // rank rises!
      };
    });

    // 3. Update leaderboard for current operative
    setLeaderboard((prev) =>
      prev
        .map((entry) => {
          if (!entry.isCurrentUser) return entry;
          return {
            ...entry,
            totalXp: entry.totalXp + earnedXp,
            completedMissionsCount: entry.completedMissionsCount + 1,
            rankChange: 'up' as const,
          };
        })
        .sort((a, b) => b.totalXp - a.totalXp)
        .map((item, index) => ({
          ...item,
          rank: index + 1,
        }))
    );

    // 4. Update achievement progress
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.codename === 'CAMPUS_GUARDIAN') {
          const newProg = ach.progress + 1;
          return {
            ...ach,
            progress: newProg,
            isUnlocked: newProg >= ach.maxProgress ? true : ach.isUnlocked,
            unlockedAt: newProg >= ach.maxProgress ? 'Just now' : ach.unlockedAt,
          };
        }
        return ach;
      })
    );

    showToast(`✓ Mission Verified! +${earnedXp} XP awarded to ${profile.callsign}!`);
  };

  const activeMissionsCount = missions.filter(
    (m) => m.status === 'Accepted' || m.status === 'In Progress' || m.status === 'Submitted'
  ).length;

  return (
    <div className="app-container">
      {/* Background Ambience Elements */}
      <div className="ambient-grid"></div>
      <div className="ambient-glow glow-cyan"></div>
      <div className="ambient-glow glow-indigo"></div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <div className="toast-icon">⚡</div>
          <div className="toast-text">{toastMessage}</div>
          <button className="toast-close" onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}

      {/* Header */}
      <Header profile={profile} activeMissionsCount={activeMissionsCount} />

      <main className="main-content">
        {/* Operative Profile & XP Progression */}
        <PlayerProfile profile={profile} />

        {/* Tactical Navigation Bar */}
        <nav className="dashboard-nav-bar">
          <div className="nav-tabs-wrapper">
            <button
              className={`nav-tab-item ${activeTab === 'missions' ? 'active' : ''}`}
              onClick={() => setActiveTab('missions')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              Directives & Active Missions
              <span className="nav-badge-pill">{missions.length}</span>
            </button>

            <button
              className={`nav-tab-item ${activeTab === 'achievements' ? 'active' : ''}`}
              onClick={() => setActiveTab('achievements')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="7"/>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
              </svg>
              Achievements & Badges
              <span className="nav-badge-pill">{achievements.filter(a => a.isUnlocked).length}/{achievements.length}</span>
            </button>

            <button
              className={`nav-tab-item ${activeTab === 'leaderboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('leaderboard')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              Campus Leaderboard
              <span className="nav-badge-pill rank-pill">Rank #{profile.campusRank}</span>
            </button>
          </div>
        </nav>

        {/* Tab Views */}
        {activeTab === 'missions' && (
          <ActiveMissions
            missions={missions}
            onOpenProofModal={handleOpenProofModal}
            onToggleObjective={handleToggleObjective}
            onStartMission={handleStartMission}
            onSimulateApprove={handleSimulateApprove}
          />
        )}

        {activeTab === 'achievements' && (
          <AchievementsSection achievements={achievements} />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardSection entries={leaderboard} />
        )}
      </main>

      {/* Proof Submission Modal */}
      <ProofSubmissionModal
        mission={selectedMissionForProof}
        isOpen={isProofModalOpen}
        onClose={() => {
          setIsProofModalOpen(false);
          setSelectedMissionForProof(null);
        }}
        onSubmit={handleSubmitProof}
      />

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-left">
          <span>CU Mission Operatives — Pair B Subsystem</span>
          <span className="text-divider">•</span>
          <span>Zero Backend Bound (Mock Fixture Mode)</span>
        </div>
        <div className="footer-right">
          <span>Encrypted Local State</span>
          <span className="text-divider">•</span>
          <span className="ready-indicator">READY FOR PAIR A INTEGRATION</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
