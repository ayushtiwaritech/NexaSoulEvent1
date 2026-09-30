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
    const pulseTimer = setTimeout(() => setAnimationStage('pulse'), 500);
    const revealTimer = setTimeout(() => setAnimationStage('reveal'), 1800);
    
    return () => {
      clearTimeout(pulseTimer);
      clearTimeout(revealTimer);
    };
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />
      
      <div className={`${styles.container} ${styles[animationStage]}`}>
        {/* Location Image with zoom effect */}
        <div className={styles.heroImage} style={{ backgroundImage: `url(${location.image_url})` }}>
          <div className={styles.imageOverlay} />
        </div>
        
        {/* Seal Animation */}
        <div className={styles.sealContainer}>
          <div className={styles.sealOuter} />
          <div className={styles.sealInner} />
          <div className={styles.sealText}>DOMAIN EXPANSION</div>
        </div>

        {/* Content Reveal */}
        <div className={styles.content}>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
          
          <div className={styles.locationHeader}>
            <span className={styles.zoneLabel}>{location.zone}</span>
            <h2 className={styles.locationName}>{location.name}</h2>
            <p className={styles.locationDesc}>{location.description}</p>
          </div>
          
          <div className={styles.questSection}>
            <h3 className={styles.questTitle}>AVAILABLE MISSIONS</h3>
            <div className={styles.questList}>
              {quests.length === 0 ? (
                <p className={styles.noQuests}>No active missions in this zone.</p>
              ) : (
                quests.map(quest => (
                  <div key={quest.id} className={styles.questItem}>
                    <QuestCard quest={quest} />
                    <button 
                      className={styles.acceptBtn}
                      onClick={() => onAccept(quest.id)}
                    >
                      ACCEPT MISSION
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
