import { sql } from './db';
import { Quest, QuestCategory } from '../types';

export async function getActiveQuests(): Promise<Quest[]> {
  try {
    const quests = await sql`
      SELECT * FROM quests
      WHERE status = 'ACTIVE'
      ORDER BY created_at DESC
    `;
    return quests as Quest[];
  } catch (error) {
    console.error('Error fetching quests:', error);
    return [];
  }
}

export async function getQuestsByLocation(locationId: string): Promise<Quest[]> {
  try {
    const quests = await sql`
      SELECT * FROM quests
      WHERE location_id = ${locationId} AND status = 'ACTIVE'
      ORDER BY created_at DESC
    `;
    return quests as Quest[];
  } catch (error) {
    console.error('Error fetching quests for location:', error);
    return [];
  }
}

export async function getQuestsByCategory(category: QuestCategory): Promise<Quest[]> {
  try {
    const quests = await sql`
      SELECT * FROM quests
      WHERE category = ${category} AND status = 'ACTIVE'
      ORDER BY created_at DESC
    `;
    return quests as Quest[];
  } catch (error) {
    console.error('Error fetching quests by category:', error);
    return [];
  }
}

export async function getDailyQuests(): Promise<Quest[]> {
  try {
    const quests = await sql`
      SELECT * FROM quests
      WHERE quest_type = 'DAILY' AND status = 'ACTIVE'
      ORDER BY created_at DESC
    `;
    return quests as Quest[];
  } catch (error) {
    console.error('Error fetching daily quests:', error);
    return [];
  }
}

export async function getSecretQuests(): Promise<Quest[]> {
  try {
    const quests = await sql`
      SELECT * FROM quests
      WHERE (quest_type = 'SECRET' OR category = 'SECRET') AND status = 'ACTIVE'
      ORDER BY created_at DESC
    `;
    return quests as Quest[];
  } catch (error) {
    console.error('Error fetching secret quests:', error);
    return [];
  }
}

export async function getEmergencyQuests(): Promise<Quest[]> {
  try {
    const quests = await sql`
      SELECT * FROM quests
      WHERE (quest_type = 'EMERGENCY' OR category = 'EMERGENCY') AND status = 'ACTIVE'
      ORDER BY created_at DESC
    `;
    return quests as Quest[];
  } catch (error) {
    console.error('Error fetching emergency quests:', error);
    return [];
  }
}
