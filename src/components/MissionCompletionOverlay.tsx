import React, { useEffect, useState } from 'react';

export interface CompletionData {
  missionCode: string;
  missionTitle: string;
  xpEarned: number;
  prevGrade: string;
  newGrade: string;
  isGradePromotion: boolean;
  unlockedAchievement: string | null;
}

interface MissionCompletionOverlayProps {
  data: CompletionData | null;
  onFinish: () => void;
}

export const MissionCompletionOverlay: React.FC<MissionCompletionOverlayProps> = ({
  data,
  onFinish,
}) => {
  // Phase 0: Sigil Ignition (0-0.6s)
  // Phase 1: Exorcism & Dynamic XP Burst (0.6-1.5s)
  // Phase 2: Promotion / Technique Reveal & Energy Travel (1.5-2.5s)
  // Phase 3: Smooth Dissolve (2.5-3.0s)
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    if (!data) return;

    setPhase(0);

    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => setPhase(3), 2600);
    const tEnd = setTimeout(() => {
      onFinish();
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tEnd);
    };
  }, [data, onFinish]);

  if (!data) return null;

  return (
    <div className={`cinematic-overlay ${phase === 3 ? 'overlay-dissolve' : ''}`} role="alert" aria-live="assertive">
      {/* 1. Interface Dimmer & Pulsing Vignette */}
      <div className="cursed-vignette-pulse"></div>

      {/* 2. Concentric Rotating Cursed Sigils */}
      <div className="sigil-container">
        <div className="sigil-ring ring-outer">
          <svg viewBox="0 0 300 300" className="sigil-svg">
            <circle cx="150" cy="150" r="140" stroke="rgba(168, 85, 247, 0.6)" strokeWidth="2" strokeDasharray="12 6" />
            <circle cx="150" cy="150" r="125" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>

        <div className="sigil-ring ring-inner">
          <svg viewBox="0 0 200 200" className="sigil-svg">
            <polygon points="100,10 185,155 15,155" stroke="rgba(0, 240, 255, 0.7)" strokeWidth="1.5" fill="none" />
            <polygon points="100,190 15,45 185,45" stroke="rgba(168, 85, 247, 0.7)" strokeWidth="1.5" fill="none" />
            <circle cx="100" cy="100" r="45" stroke="rgba(244, 63, 94, 0.6)" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="sigil-core-glyph">
          <span>祓</span>
        </div>

        {/* Shockwave Energy Bursts */}
        <div className="energy-shockwave wave-cyan"></div>
        <div className="energy-shockwave wave-violet"></div>
      </div>

      {/* 3. Dynamic Cinematic Text & Reward Presentation */}
      <div className="cinematic-content">
        {phase >= 1 && (
          <div className="exorcised-announcement">
            <div className="kanji-subtext">任務祓除 // DIRECTIVE PURGED</div>
            <h1 className="exorcised-title">MISSION EXORCISED</h1>
            <div className="mission-code-highlight">
              <span className="code-pill">{data.missionCode}</span>
              <span className="title-text">{data.missionTitle}</span>
            </div>

            {/* Dynamic XP Acquired */}
            <div className="xp-acquired-box">
              <div className="xp-number-pulse">+{data.xpEarned} XP</div>
              <div className="xp-acquired-label">
                <span className="glyph">⚡</span> XP ACQUIRED <span className="text-muted">(呪力充填)</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. Energy Orb Traveling Towards Progress Bar */}
        {phase >= 2 && (
          <div className="energy-travel-stream" aria-hidden="true">
            <div className="energy-wisp-head"></div>
            <div className="energy-wisp-tail"></div>
          </div>
        )}

        {/* 5. Technique Unlocked Notification (If triggered) */}
        {phase >= 2 && data.unlockedAchievement && (
          <div className="technique-unlocked-card">
            <div className="technique-header">
              <span className="technique-icon">☯</span>
              <span>TECHNIQUE UNLOCKED // 術式開花</span>
            </div>
            <div className="technique-name">{data.unlockedAchievement}</div>
          </div>
        )}

        {/* 6. Grade Promotion Banner (If threshold crossed) */}
        {phase >= 2 && data.isGradePromotion && (
          <div className="grade-promotion-banner">
            <div className="promotion-tag">GRADE PROMOTION // 階位昇格</div>
            <div className="promotion-grades-row">
              <div className="grade-box old-grade">{data.prevGrade.toUpperCase()}</div>
              <div className="grade-arrow">↓</div>
              <div className="grade-box new-grade">{data.newGrade.toUpperCase()}</div>
            </div>
            <div className="promotion-flourish">CURSED ENERGY OUTPUT EXPANDED</div>
          </div>
        )}
      </div>

      {/* Subtle dismiss tip */}
      <button 
        className="skip-cinematic-btn" 
        onClick={onFinish}
        title="Skip sequence"
      >
        Click anywhere or Esc to skip
      </button>
    </div>
  );
};
