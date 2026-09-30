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
    >
      <div className={styles.imageContainer}>
        {/* We use a div with background image for the placeholder effect. 
            Once real images exist, this can be swapped with Next.js Image */}
        <div 
          className={styles.image} 
          style={{ backgroundImage: `url(${location.image_url})` }}
        />
        <div className={styles.overlay}>
          <div className={styles.zone}>{location.zone}</div>
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
