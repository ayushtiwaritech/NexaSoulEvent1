export const schemaSql = `
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  zone VARCHAR(100) NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  grade VARCHAR(50) NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  quest_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
  start_time TIMESTAMP WITH TIME ZONE,
  expiry_time TIMESTAMP WITH TIME ZONE,
  max_players INTEGER,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

export const seedLocations = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Main Library Archives',
    description: 'A quiet and ancient repository of knowledge. Perfect for research and focus.',
    image_url: '/locations/library-placeholder.jpg',
    zone: 'Academic Sector',
    latitude: null,
    longitude: null,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Tech Innovation Hub',
    description: 'The center for coding, robotics, and technological advancement.',
    image_url: '/locations/tech-hub-placeholder.jpg',
    zone: 'Engineering Sector',
    latitude: null,
    longitude: null,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Campus Central Plaza',
    description: 'The bustling heart of the campus where students gather.',
    image_url: '/locations/plaza-placeholder.jpg',
    zone: 'Common Sector',
    latitude: null,
    longitude: null,
  }
];

export const seedQuests = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    title: 'Find a research book',
    description: 'Locate the hidden tome on advanced algorithms in the north wing.',
    location_id: '11111111-1111-1111-1111-111111111111',
    category: 'LIBRARY',
    grade: 'GRADE_4',
    xp_reward: 150,
    quest_type: 'NORMAL',
    status: 'ACTIVE',
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    title: 'Attend a technical club seminar',
    description: 'Join the AI ethics seminar happening this evening.',
    location_id: '22222222-2222-2222-2222-222222222222',
    category: 'CLUB',
    grade: 'GRADE_3',
    xp_reward: 300,
    quest_type: 'EVENT',
    status: 'ACTIVE',
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    title: 'Submit a coding challenge',
    description: 'Solve the daily algorithm challenge before midnight.',
    location_id: '22222222-2222-2222-2222-222222222222',
    category: 'CODING',
    grade: 'GRADE_2',
    xp_reward: 500,
    quest_type: 'DAILY',
    status: 'ACTIVE',
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    title: 'Walk around the sports lawn',
    description: 'Complete 5 laps around the central plaza to maintain physical wellness.',
    location_id: '33333333-3333-3333-3333-333333333333',
    category: 'WELLNESS',
    grade: 'GRADE_4',
    xp_reward: 100,
    quest_type: 'NORMAL',
    status: 'ACTIVE',
  },
  {
    id: 'a5555555-5555-5555-5555-555555555555',
    title: 'Discover a campus landmark',
    description: 'Find the sealed monument from the founding era.',
    location_id: '33333333-3333-3333-3333-333333333333',
    category: 'SECRET',
    grade: 'SPECIAL',
    xp_reward: 1000,
    quest_type: 'SECRET',
    status: 'ACTIVE',
  },
  {
    id: 'a6666666-6666-6666-6666-666666666666',
    title: 'Emergency campus assistance',
    description: 'Help a student reach the campus medical facility immediately.',
    location_id: '33333333-3333-3333-3333-333333333333',
    category: 'EMERGENCY',
    grade: 'GRADE_1',
    xp_reward: 800,
    quest_type: 'EMERGENCY',
    status: 'ACTIVE',
  }
];
