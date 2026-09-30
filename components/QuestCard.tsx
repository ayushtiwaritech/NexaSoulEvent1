import { Quest } from '../types';
import styles from './QuestCard.module.css';

interface QuestCardProps {
  quest: Quest;
  onSelect?: (questId: string) => void;
  locationName?: string;
  isSelected?: boolean;
}

export default function QuestCard({ quest, onSelect, locationName, isSelected }: QuestCardProps) {
  const isEmergency = quest.category === 'EMERGENCY' || quest.quest_type === 'EMERGENCY';
  const isSecret = quest.category === 'SECRET' || quest.quest_type === 'SECRET';
  const isDaily = quest.quest_type === 'DAILY';
  const hasExpiry = !!quest.expiry_time;

  let cardClass = styles.questCard;
  if (isEmergency) cardClass += ` ${styles.emergency}`;
  else if (isSecret) cardClass += ` ${styles.secret}`;
  else if (isDaily) cardClass += ` ${styles.daily}`;
  
  if (isSelected) cardClass += ` ${styles.selected}`;

  const showDetails = isSelected || !onSelect;

  return (
    <div 
      className={cardClass}
      onClick={() => onSelect?.(quest.id)}
      role={onSelect ? "button" : "article"}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={(e) => { if (onSelect && (e.key === 'Enter' || e.key === ' ')) onSelect(quest.id); }}
    >
      <div className={styles.header}>
        <span className={styles.grade}>{quest.grade.replace('_', ' ')}</span>
        <span className={styles.xp}>⚡ {quest.xp_reward} XP</span>
      </div>
      
      <h3 className={styles.title}>
        {isSecret && !isSelected && onSelect ? '████████████' : quest.title}
      </h3>
      
      {(isSecret && !isSelected && onSelect) && (
        <div className={styles.secretLabel}>🔒 CLASSIFIED - UNKNOWN MISSION</div>
      )}

      {(isSecret && (isSelected || !onSelect)) && (
        <div className={styles.secretUnlocked}>SECRET QUEST UNLOCKED</div>
      )}

      {showDetails && (!isSecret || isSelected || !onSelect) && (
        <p className={styles.description}>{quest.description}</p>
      )}
      
      <div className={styles.meta}>
        <span className={styles.category}>{quest.category}</span>
        {isDaily && <span className={styles.dailyBadge}>DAILY MISSION</span>}
        {(isEmergency || hasExpiry) && <span className={styles.emergencyBadge}>🚨 TIME LIMITED</span>}
        <span className={styles.status}>{quest.status}</span>
        {locationName && <span className={styles.location}>📍 {locationName}</span>}
      </div>

      <div className={styles.cornerMarkers}></div>
      {isSelected && <div className={styles.seal}></div>}
    </div>
  );
}
