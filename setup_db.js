
const { neon } = require('@neondatabase/serverless');

async function main() {
  const sql = neon(process.env.DATABASE_URL);

  await sql`
    CREATE TABLE IF NOT EXISTS "user" (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      "emailVerified" TIMESTAMP,
      image TEXT,
      role TEXT DEFAULT 'MEMBER_1',
      "createdAt" TIMESTAMP NOT NULL,
      "updatedAt" TIMESTAMP NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "session" (
      id TEXT PRIMARY KEY,
      "expiresAt" TIMESTAMP NOT NULL,
      token TEXT NOT NULL UNIQUE,
      "createdAt" TIMESTAMP NOT NULL,
      "updatedAt" TIMESTAMP NOT NULL,
      "ipAddress" TEXT,
      "userAgent" TEXT,
      "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "account" (
      id TEXT PRIMARY KEY,
      "accountId" TEXT NOT NULL,
      "providerId" TEXT NOT NULL,
      "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      "accessToken" TEXT,
      "refreshToken" TEXT,
      "idToken" TEXT,
      "accessTokenExpiresAt" TIMESTAMP,
      "refreshTokenExpiresAt" TIMESTAMP,
      scope TEXT,
      password TEXT,
      "createdAt" TIMESTAMP NOT NULL,
      "updatedAt" TIMESTAMP NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "verification" (
      id TEXT PRIMARY KEY,
      identifier TEXT NOT NULL,
      value TEXT NOT NULL,
      "expiresAt" TIMESTAMP NOT NULL,
      "createdAt" TIMESTAMP,
      "updatedAt" TIMESTAMP
    )
  `;

  // Quest Acceptances table
  await sql`
    CREATE TABLE IF NOT EXISTS quest_acceptances (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
      status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
      accepted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP WITH TIME ZONE,
      UNIQUE(user_id, quest_id)
    )
  `;

  console.log("Schema generated successfully.");
}

main().catch(console.error);
