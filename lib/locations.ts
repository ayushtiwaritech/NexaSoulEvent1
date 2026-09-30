import { sql } from './db';
import { Location } from '../types';

export async function getLocations(): Promise<Location[]> {
  try {
    const locations = await sql`
      SELECT * FROM locations
      ORDER BY name ASC
    `;
    return locations as Location[];
  } catch (error) {
    console.error('Error fetching locations:', error);
    // Return mock data if DB fails during dev
    return [];
  }
}

export async function getLocationById(id: string): Promise<Location | null> {
  try {
    const result = await sql`
      SELECT * FROM locations
      WHERE id = ${id}
    `;
    const locations = result as Location[];
    return locations[0] || null;
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
}
