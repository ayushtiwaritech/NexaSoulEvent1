import { Quest } from '../types';
import styles from './QuestCard.module.css';

interface QuestCardProps {
  quest: Quest;
  onSelect?: (questId: string) => void;
  locationName?: string;
}

export default function QuestCard({ quest, onSelect, locationName }: QuestCardProps) {
  const isEmergency = quest.category === 'EMERGENCY' || quest.quest_type === 'EMERGENCY';
  const isSecret = quest.category === 'SECRET' || quest.quest_type === 'SECRET';
  const isDaily = quest.quest_type === 'DAILY';

  let cardClass = styles.questCard;
  if (isEmergency) cardClass += ` ${styles.emergency}`;
  else if (isSecret) cardClass += ` ${styles.secret}`;
  else if (isDaily) cardClass += ` ${styles.daily}`;

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
        <span className={styles.xp}>{quest.xp_reward} XP</span>
      </div>
      
      <h3 className={styles.title}>
        {isSecret && !onSelect ? '???????' : quest.title}
      </h3>
      
      <div className={styles.meta}>
        <span className={styles.category}>{quest.category}</span>
        {locationName && <span className={styles.location}>{locationName}</span>}
      </div>

      <div className={styles.seal}></div>
    </div>
  );
}
