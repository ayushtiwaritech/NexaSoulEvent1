export type OperativeGrade = 'Grade 4' | 'Grade 3' | 'Grade 2' | 'Grade 1' | 'Special Grade';

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
