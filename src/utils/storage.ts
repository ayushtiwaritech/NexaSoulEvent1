import type { OperativeProfile } from '../types/operative';
import type { Mission } from '../types/mission';
import type { Achievement } from '../types/achievement';
import type { LeaderboardEntry } from '../types/leaderboard';
import { initialOperativeProfile, initialMissions, mockAchievements, mockLeaderboard } from '../data/mockData';

export const PAIR_B_STORAGE_KEY = 'cu_mission_pair_b_demo_state';

export interface PersistedDemoState {
  version: number;
  profile: OperativeProfile;
  missions: Mission[];
  achievements: Achievement[];
  leaderboard: LeaderboardEntry[];
  savedAt: string;
}

/**
 * Loads the saved Pair B demo state from localStorage.
 * Returns null if not found or corrupted, triggering fallback to mockData.
 */
export function loadPersistedDemoState(): PersistedDemoState | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(PAIR_B_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      parsed.profile &&
      Array.isArray(parsed.missions) &&
      Array.isArray(parsed.achievements) &&
      Array.isArray(parsed.leaderboard)
    ) {
      return parsed as PersistedDemoState;
    }
  } catch (err) {
    console.warn('[Pair B Persistence] Failed to parse localStorage state:', err);
  }
  return null;
}

/**
 * Saves the current operative profile, missions, achievements, and leaderboard to localStorage.
 */
export function savePersistedDemoState(state: {
  profile: OperativeProfile;
  missions: Mission[];
  achievements: Achievement[];
  leaderboard: LeaderboardEntry[];
}): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    const payload: PersistedDemoState = {
      version: 1,
      profile: state.profile,
      missions: state.missions,
      achievements: state.achievements,
      leaderboard: state.leaderboard,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(PAIR_B_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('[Pair B Persistence] Failed to save to localStorage:', err);
  }
}

/**
 * Clears the persisted Pair B demo state from localStorage.
 */
export function clearPersistedDemoState(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.removeItem(PAIR_B_STORAGE_KEY);
  } catch (err) {
    console.warn('[Pair B Persistence] Failed to clear localStorage:', err);
  }
}

/**
 * Returns fresh cloned copies of the initial mockData.
 */
export function getFreshInitialState() {
  return {
    profile: JSON.parse(JSON.stringify(initialOperativeProfile)) as OperativeProfile,
    missions: JSON.parse(JSON.stringify(initialMissions)) as Mission[],
    achievements: JSON.parse(JSON.stringify(mockAchievements)) as Achievement[],
    leaderboard: JSON.parse(JSON.stringify(mockLeaderboard)) as LeaderboardEntry[],
  };
}
