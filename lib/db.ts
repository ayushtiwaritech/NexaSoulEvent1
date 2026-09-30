import { neon } from '@neondatabase/serverless';

export const sql = process.env.DATABASE_URL 
  ? neon(process.env.DATABASE_URL) 
  : (() => { throw new Error('DATABASE_URL is not set in .env.local'); }) as unknown as ReturnType<typeof neon>;
