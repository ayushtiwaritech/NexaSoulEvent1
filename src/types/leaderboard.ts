export interface LeaderboardEntry {
  rank: number;
  operativeId: string;
  name: string;
  callsign: string;
  department: string;
  grade: string;
  totalXp: number;
  completedMissionsCount: number;
  streakDays: number;
  isCurrentUser: boolean;
  rankChange: 'up' | 'down' | 'same';
}

export type LeaderboardTimeframe = 'All-Time' | 'Current Cycle' | 'This Week';
export type LeaderboardDepartmentFilter = 'All Squads' | 'Cyber Security' | 'AI & Robotics' | 'Software Systems' | 'Network Engineering';
