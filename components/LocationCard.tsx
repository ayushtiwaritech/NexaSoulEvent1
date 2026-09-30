import { Location } from '../types';
import styles from './LocationCard.module.css';

interface LocationCardProps {
  location: Location;
  activeMissionCount?: number;
  onClick: (location: Location) => void;
}

export default function LocationCard({ location, activeMissionCount = 0, onClick }: LocationCardProps) {
  return (
    <div className={styles.card}>
      <div 
        className={styles.imageContainer}
        onClick={() => onClick(location)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(location); }}
        aria-label={`View missions at ${location.name}`}
      >
        <div 
          className={styles.image} 
          style={{ backgroundImage: `url(${location.image_url})` }}
        />
        <div className={styles.overlay}>
          <div className={styles.zone}>{location.zone}</div>
          <div className={styles.interactiveIndicator}>
            <span className={styles.scanline}></span>
            <span className={styles.indicatorText}>VIEW MISSIONS</span>
          </div>
        </div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.name}>{location.name}</h3>
        <div className={styles.missionCount}>
          <span className={styles.dot}></span>
          {activeMissionCount} Active {activeMissionCount === 1 ? 'Mission' : 'Missions'}
        </div>
      </div>
    </div>
  );
}
