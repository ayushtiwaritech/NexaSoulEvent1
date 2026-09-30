import React, { useState, useEffect } from 'react';
import { initialOperativeProfile, initialMissions, mockAchievements, mockLeaderboard } from './data/mockData';
import type { Mission } from './types/mission';
import type { OperativeProfile, OperativeGrade } from './types/operative';
import type { Achievement } from './types/achievement';
import type { LeaderboardEntry } from './types/leaderboard';
import { Header } from './components/Header';
import { PlayerProfile } from './components/PlayerProfile';
import { ActiveMissions } from './components/ActiveMissions';
import { ProofSubmissionModal } from './components/ProofSubmissionModal';
import { AchievementsSection } from './components/AchievementsSection';
import { LeaderboardSection } from './components/LeaderboardSection';
import { CursedBackground } from './components/CursedBackground';
import { MissionCompletionOverlay, type CompletionData } from './components/MissionCompletionOverlay';
import {
  PAIR_B_STORAGE_KEY,
  loadPersistedDemoState,
  savePersistedDemoState,
  clearPersistedDemoState,
  getFreshInitialState,
} from './utils/storage';
import './App.css';

export const App: React.FC = () => {
  // 1. Initial State loaded from localStorage (cu_mission_pair_b_demo_state) or fallback to mockData
  const [profile, setProfile] = useState<OperativeProfile>(() => {
    const saved = loadPersistedDemoState();
    return saved ? saved.profile : initialOperativeProfile;
  });

  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = loadPersistedDemoState();
    return saved ? saved.missions : initialMissions;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = loadPersistedDemoState();
    return saved ? saved.achievements : mockAchievements;
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = loadPersistedDemoState();
    return saved ? saved.leaderboard : mockLeaderboard;
  });

  // Automatically persist any changes to profile, missions, achievements, or leaderboard
  useEffect(() => {
    savePersistedDemoState({
      profile,
      missions,
      achievements,
      leaderboard,
    });
  }, [profile, missions, achievements, leaderboard]);

  // Non-persisted UI states
  const [activeTab, setActiveTab] = useState<'missions' | 'achievements' | 'leaderboard'>('missions');
  const [selectedMissionForProof, setSelectedMissionForProof] = useState<Mission | null>(null);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [completionData, setCompletionData] = useState<CompletionData | null>(null);
  const [isXpSurging, setIsXpSurging] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4500);
  };

  // Development Reset Demo Progress control
  const handleResetProgress = () => {
    clearPersistedDemoState();
    const fresh = getFreshInitialState();
    setProfile(fresh.profile);
    setMissions(fresh.missions);
    setAchievements(fresh.achievements);
    setLeaderboard(fresh.leaderboard);
    showToast('Demo progress reset to original Grade 3 / 3,450 XP state.');
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
    showToast('Cursed Technique Activated! Directive transitioned to [In Progress].');
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
    showToast(`Seal proof for directive submitted! Status: [Pending Verification Review].`);
  };

  // Simulate Verifier Approval & Trigger Cinematic Exorcism
  const handleSimulateApprove = (missionId: string) => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission) return;

    const earnedXp = mission.xpReward;
    const prevGrade = profile.grade;
    let nextGrade: OperativeGrade = profile.grade;
    let isGradePromotion = false;
    let nextTier = profile.gradeTier;
    let newPrevXp = profile.prevGradeXp;
    let newNextXp = profile.nextGradeXp;

    const calculatedNewXp = profile.currentXp + earnedXp;

    // Check Grade Promotion threshold:
    // Grade 4 (0-1500) -> Grade 3 (1500-3500) -> Grade 2 (3500-6000) -> Grade 1 (6000-10000) -> Special Grade (10000+)
    if (calculatedNewXp >= profile.nextGradeXp) {
      isGradePromotion = true;
      if (prevGrade === 'Grade 4') {
        nextGrade = 'Grade 3';
        nextTier = 3;
        newPrevXp = 1500;
        newNextXp = 3500;
      } else if (prevGrade === 'Grade 3') {
        nextGrade = 'Grade 2';
        nextTier = 2;
        newPrevXp = 3500;
        newNextXp = 6000;
      } else if (prevGrade === 'Grade 2') {
        nextGrade = 'Grade 1';
        nextTier = 1;
        newPrevXp = 6000;
        newNextXp = 10000;
      } else if (prevGrade === 'Grade 1') {
        nextGrade = 'Special Grade';
        nextTier = 0;
        newPrevXp = 10000;
        newNextXp = 25000;
      }
    }

    // Check if an achievement unlocks
    let newlyUnlockedAchievementName: string | null = null;
    const guardianAch = achievements.find((a) => a.codename === 'CAMPUS_GUARDIAN');
    if (guardianAch && !guardianAch.isUnlocked && guardianAch.progress + 1 >= guardianAch.maxProgress) {
      newlyUnlockedAchievementName = guardianAch.name;
    }

    // Trigger Cinematic Sequence
    setCompletionData({
      missionCode: mission.code,
      missionTitle: mission.title,
      xpEarned: earnedXp,
      prevGrade: prevGrade,
      newGrade: nextGrade,
      isGradePromotion,
      unlockedAchievement: newlyUnlockedAchievementName,
    });

    setIsXpSurging(true);
    setTimeout(() => setIsXpSurging(false), 5000);

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
    setProfile((prev) => ({
      ...prev,
      currentXp: calculatedNewXp,
      grade: nextGrade,
      gradeTier: nextTier,
      prevGradeXp: newPrevXp,
      nextGradeXp: newNextXp,
      missionsCompleted: prev.missionsCompleted + 1,
      activeMissionsCount: Math.max(prev.activeMissionsCount - 1, 0),
      campusRank: Math.max(prev.campusRank - 1, 1),
    }));

    // 3. Update leaderboard for current operative
    setLeaderboard((prev) =>
      prev
        .map((entry) => {
          if (!entry.isCurrentUser) return entry;
          return {
            ...entry,
            grade: nextGrade,
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

    showToast(`✓ Mission Exorcised! +${earnedXp} XP (呪力) infused into ${profile.callsign}!`);
  };

  const activeMissionsCount = missions.filter(
    (m) => m.status === 'Accepted' || m.status === 'In Progress' || m.status === 'Submitted'
  ).length;

  return (
    <div className="app-container cursed-theme">
      {/* Cursed Ambient Particle Atmosphere */}
      <CursedBackground />

      {/* Cinematic Mission Completion / Exorcism Overlay */}
      <MissionCompletionOverlay 
        data={completionData} 
        onFinish={() => setCompletionData(null)} 
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification cursed-toast">
          <div className="toast-icon">☯</div>
          <div className="toast-text">{toastMessage}</div>
          <button className="toast-close" onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}

      {/* Header */}
      <Header 
        profile={profile} 
        activeMissionsCount={activeMissionsCount} 
        onResetProgress={handleResetProgress}
      />

      <main className="main-content">
        {/* Operative Profile & XP Progression */}
        <PlayerProfile profile={profile} isSurging={isXpSurging} />

        {/* Tactical Navigation Bar */}
        <nav className="dashboard-nav-bar cursed-nav">
          <div className="nav-tabs-wrapper">
            <button
              className={`nav-tab-item ${activeTab === 'missions' ? 'active' : ''}`}
              onClick={() => setActiveTab('missions')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              Directives & Exorcisms
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
              Innate Techniques & Badges
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
              Sorcerer Leaderboard
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

      {/* Footer with Persistence and Reset control */}
      <footer className="site-footer cursed-footer">
        <div className="footer-left">
          <span>CU Mission Operatives — Pair B Cursed Subsystem</span>
          <span className="text-divider">•</span>
          <span className="storage-key-pill" title="Browser localStorage persistence key">
            Key: {PAIR_B_STORAGE_KEY}
          </span>
        </div>
        <div className="footer-right">
          <button 
            className="btn-reset-demo" 
            onClick={handleResetProgress}
            title="Reset demo progress back to initial Grade 3 / 3,450 XP state"
          >
            <span className="reset-glyph">↺</span> Reset Demo Progress
          </button>
          <span className="text-divider">•</span>
          <span className="ready-indicator">READY FOR PAIR A INTEGRATION</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
