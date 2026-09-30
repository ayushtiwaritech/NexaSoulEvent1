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
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(quests.length > 0 ? quests[0].id : null);
  
  useEffect(() => {
    // Sequence the animations (500-900ms total)
    const pulseTimer = setTimeout(() => setAnimationStage('pulse'), 50);
    const revealTimer = setTimeout(() => setAnimationStage('reveal'), 600);
    
    // Check for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setAnimationStage('reveal'); // Skip to end
    }
    
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
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>
          
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
                  <div key={quest.id} className={`${styles.questWrapper} ${selectedQuestId === quest.id ? styles.selectedWrapper : ''}`}>
                    <QuestCard 
                      quest={quest} 
                      isSelected={selectedQuestId === quest.id}
                      onSelect={() => setSelectedQuestId(quest.id)}
                    />
                    {selectedQuestId === quest.id && (
                      <div className={styles.actionContainer}>
                        <button 
                          className={styles.acceptBtn}
                          onClick={() => onAccept(quest.id)}
                          aria-label={`Accept mission ${quest.title}`}
                        >
                          ACCEPT MISSION
                        </button>
                      </div>
                    )}
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
