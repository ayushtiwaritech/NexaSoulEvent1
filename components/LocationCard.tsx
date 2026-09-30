import { Location } from '../types';
import styles from './LocationCard.module.css';

interface LocationCardProps {
  location: Location;
  activeMissionCount?: number;
  onClick: (location: Location) => void;
}

export default function LocationCard({ location, activeMissionCount = 0, onClick }: LocationCardProps) {
  return (
    <div 
      className={styles.card}
      onClick={() => onClick(location)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(location); }}
      aria-label={`View missions at ${location.name}`}
    >
      <div className={styles.imageContainer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={location.image_url} 
          alt={location.name} 
          className={styles.image}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.add(styles.fallbackVisible);
          }}
        />
        <div className={styles.imageFallback}></div>
        <div className={styles.gradientOverlay}></div>
        <div className={styles.overlayContent}>
          <div className={styles.zoneBadge}>{location.zone}</div>
        </div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.name}>{location.name}</h3>
        {location.description && (
          <p className={styles.description}>{location.description}</p>
        )}
        <div className={styles.statusSection}>
          <div className={styles.missionCount}>
            {activeMissionCount > 0 ? (
              <>
                <span className={styles.dotActive}></span>
                {activeMissionCount} Active Mission{activeMissionCount === 1 ? '' : 's'}
              </>
            ) : (
              <>
                <span className={styles.dotInactive}></span>
                No Active Missions
              </>
            )}
          </div>
          <div className={styles.actionPrompt}>VIEW MISSIONS</div>
        </div>
      </div>
    </div>
  );
}
