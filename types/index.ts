export type QuestCategory = 'WORKSHOP' | 'LIBRARY' | 'CODING' | 'CLUB' | 'WELLNESS' | 'COMMUNITY' | 'SECRET' | 'EMERGENCY';
export type QuestType = 'NORMAL' | 'DAILY' | 'SECRET' | 'EVENT' | 'SQUAD' | 'EMERGENCY';
export type QuestGrade = 'GRADE_4' | 'GRADE_3' | 'GRADE_2' | 'GRADE_1' | 'SPECIAL';
export type QuestStatus = 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'COMPLETED';

export interface Location {
  id: string;
  name: string;
  description: string;
  image_url: string;
  zone: string;
  latitude: number | null;
  longitude: number | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  location_id: string;
  category: QuestCategory;
  grade: QuestGrade;
  xp_reward: number;
  quest_type: QuestType;
  status: QuestStatus;
  start_time?: Date | null;
  expiry_time?: Date | null;
  max_players?: number | null;
  image_url?: string | null;
  created_at?: Date;
  updated_at?: Date;
}
