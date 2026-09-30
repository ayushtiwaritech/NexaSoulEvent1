export type OperativeGrade = 'Cadet' | 'Field Operative' | 'Specialist' | 'Vanguard' | 'Ghost Elite';

export interface OperativeProfile {
  id: string;
  name: string;
  callsign: string;
  avatarUrl: string;
  department: string;
  campusId: string;
  grade: OperativeGrade;
  gradeTier: number;
  currentXp: number;
  prevGradeXp: number;
  nextGradeXp: number;
  campusRank: number;
  missionsCompleted: number;
  activeMissionsCount: number;
  accuracyRate: number; // e.g. 98.4%
  streakDays: number;
}
