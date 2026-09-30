export type MissionStatus = 'Accepted' | 'In Progress' | 'Submitted' | 'Completed';
export type MissionCategory = 'Cyber Recon' | 'Campus Infra' | 'Code Audit' | 'AI Systems' | 'Network Defense';
export type MissionDifficulty = 'Tier I - Routine' | 'Tier II - Tactical' | 'Tier III - Critical' | 'Tier IV - Classified';

export interface Objective {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface ProofSubmission {
  id: string;
  missionId: string;
  evidenceUrl: string;
  notes: string;
  submittedAt: string;
  verifiedAt?: string;
  verificationStatus: 'Pending Review' | 'Verified' | 'Revision Requested';
}

export interface Mission {
  id: string;
  code: string;
  title: string;
  summary: string;
  briefing: string;
  category: MissionCategory;
  difficulty: MissionDifficulty;
  xpReward: number;
  creditsReward: number;
  deadlineHours: number;
  deadlineTimestamp: string;
  status: MissionStatus;
  progressPercent: number;
  objectives: Objective[];
  proofSubmission?: ProofSubmission;
  issuer: {
    name: string;
    role: string;
    avatar: string;
  };
}
