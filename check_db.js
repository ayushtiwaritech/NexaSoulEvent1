require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  const result = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
  console.log('Tables:', result.map(r => r.table_name));
}
main().catch(console.error);
