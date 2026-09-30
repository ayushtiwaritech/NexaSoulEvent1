export type BadgeRarity = 'Common' | 'Tactical' | 'Elite' | 'Classified';

export interface Achievement {
  id: string;
  codename: string;
  name: string;
  description: string;
  rarity: BadgeRarity;
  iconType: 'shield' | 'zap' | 'target' | 'terminal' | 'trophy' | 'crosshair' | 'cpu';
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  xpBonus: number;
}
