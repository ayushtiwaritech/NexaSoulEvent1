"use server";
import { neon } from '@neondatabase/serverless';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function acceptQuestAction(questId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return { error: "You must be logged in to accept quests." };
    }

    if ((session.user as { role?: string }).role !== "MEMBER_1") {
      return { error: "Only MEMBER_1 can accept quests." };
    }

    const sql = neon(process.env.DATABASE_URL as string);

    // Check if duplicate
    const existing = await sql`
      SELECT id FROM quest_acceptances 
      WHERE user_id = ${session.user.id} AND quest_id = ${questId} AND status = 'ACTIVE'
    `;

    if (existing.length > 0) {
      return { error: "You have already accepted this quest!" };
    }

    await sql`
      INSERT INTO quest_acceptances (user_id, quest_id, status)
      VALUES (${session.user.id}, ${questId}, 'ACTIVE')
    `;

    return { success: true };
  } catch (error) {
    console.error("Accept Quest Error:", error);
    return { error: "Failed to accept quest." };
  }
}
