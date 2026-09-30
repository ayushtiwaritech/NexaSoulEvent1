'use client';

import { useState, useEffect } from 'react';
import { Location, Quest } from '../types';
import QuestCard from './QuestCard';
import styles from './LocationQuestReveal.module.css';

interface LocationQuestRevealProps {
  location: Location;
  quests: Quest[];
  onClose: () => void;
  onAccept: (questId: string) => void;
}

export default function LocationQuestReveal({ location, quests, onClose, onAccept }: LocationQuestRevealProps) {
  const [animationStage, setAnimationStage] = useState<'initial' | 'pulse' | 'reveal'>('initial');
  
  useEffect(() => {
    // Sequence the animations
    const pulseTimer = setTimeout(() => setAnimationStage('pulse'), 50);
    const revealTimer = setTimeout(() => setAnimationStage('reveal'), 600);
    
    // Check for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setAnimationStage('reveal'); // Skip to end
    }
    
    // ESC key to close
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      clearTimeout(pulseTimer);
      clearTimeout(revealTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Using only the first active quest for the "What's happening here" section, 
  // or a list if there are multiple. For now, let's show the primary one.
  const primaryQuest = quests.length > 0 ? quests[0] : null;

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />
      
      <div className={`${styles.container} ${styles[animationStage]}`}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">×</button>
        
        <div className={styles.heroSection}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={location.image_url} 
            alt={location.name} 
            className={styles.heroImage}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.add(styles.fallbackVisible);
            }}
          />
          <div className={styles.imageFallback}></div>
          <div className={styles.imageOverlay} />
          
          <div className={styles.sealContainer}>
            <div className={styles.sealOuter} />
            <div className={styles.sealInner} />
            <div className={styles.sealText}>DOMAIN EXPANSION</div>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.locationHeader}>
            <h2 className={styles.locationName}>{location.name}</h2>
            <div className={styles.locationMeta}>
              <span className={styles.zoneBadge}>{location.zone}</span>
              <span className={styles.statusBadge}>
                {quests.length > 0 ? (
                  <><span className={styles.statusDotActive}></span> ACTIVE MISSION</>
                ) : (
                  <><span className={styles.statusDotInactive}></span> NO ACTIVE MISSION</>
                )}
              </span>
            </div>
            {location.description && (
              <p className={styles.locationDesc}>{location.description}</p>
            )}
          </div>
          
          <div className={styles.questSection}>
            <h3 className={styles.sectionTitle}>WHAT&apos;S HAPPENING HERE?</h3>
            
            {quests.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>∅</div>
                <p>No active mission is currently available at this location.</p>
              </div>
            ) : (
              <div className={styles.questDetails}>
                {primaryQuest && (
                  <div className={styles.primaryQuest}>
                    <h4 className={styles.questTitle}>{primaryQuest.title}</h4>
                    <p className={styles.questDesc}>{primaryQuest.description}</p>
                    
                    <div className={styles.questMetaInfo}>
                      <div className={styles.metaBadge}>{primaryQuest.category}</div>
                      <div className={styles.metaBadge}>{primaryQuest.grade.replace('_', ' ')}</div>
                      <div className={styles.metaBadgeReward}>⚡ {primaryQuest.xp_reward} XP</div>
                    </div>
                    
                    <button 
                      className={styles.acceptBtn}
                      onClick={() => onAccept(primaryQuest.id)}
                      aria-label={`Accept mission ${primaryQuest.title}`}
                    >
                      ACCEPT QUEST
                    </button>
                  </div>
                )}
                
                {quests.length > 1 && (
                  <div className={styles.otherQuests}>
                    <h5 className={styles.otherQuestsTitle}>OTHER MISSIONS ({quests.length - 1})</h5>
                    <div className={styles.otherQuestsList}>
                      {quests.slice(1).map(quest => (
                        <QuestCard 
                          key={quest.id}
                          quest={quest}
                          onSelect={() => onAccept(quest.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
