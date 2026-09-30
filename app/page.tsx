'use client';

import { useState } from 'react';
import { Location, Quest } from '@/types';
import LocationCard from '@/components/LocationCard';
import QuestCard from '@/components/QuestCard';
import LocationQuestReveal from '@/components/LocationQuestReveal';
import styles from './page.module.css';

// Mock data integration point since we don't have SSR enabled perfectly without setup
// In a real app we would use server components or SWR/React Query.
import { seedLocations, seedQuests } from '@/data/seed';

export default function Home() {
  const locations = seedLocations as Location[];
  const quests = seedQuests as Quest[];
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [locationQuests, setLocationQuests] = useState<Quest[]>([]);

  // Filtering
  const filteredQuests = selectedCategory === 'ALL' 
    ? quests 
    : quests.filter(q => q.category === selectedCategory || (selectedCategory === 'EMERGENCY' && q.quest_type === 'EMERGENCY') || (selectedCategory === 'SECRET' && q.quest_type === 'SECRET'));

  const dailyQuests = quests.filter(q => q.quest_type === 'DAILY');
  const secretQuests = quests.filter(q => q.quest_type === 'SECRET' || q.category === 'SECRET');
  const emergencyQuests = quests.filter(q => q.quest_type === 'EMERGENCY' || q.category === 'EMERGENCY');

  const categories = ['ALL', 'WORKSHOP', 'LIBRARY', 'CODING', 'CLUB', 'WELLNESS', 'COMMUNITY', 'SECRET', 'EMERGENCY'];

  const handleLocationClick = (loc: Location) => {
    setSelectedLocation(loc);
    setLocationQuests(quests.filter(q => q.location_id === loc.id));
  };

  const handleAcceptMission = (questId: string) => {
    // INTEGRATION CONTRACT: 
    // This is the handoff point to Member 2's Active Mission module.
    console.log(`[Member 1 -> Member 2] Mission Accepted: ${questId}`);
    alert(`MISSION ACCEPTED!\nQuest ID: ${questId}\n\n(Handoff to Member 2 Active Mission System)`);
    setSelectedLocation(null); // Close modal
  };

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>CU MISSION BOARD</h1>
          <p className={styles.subtitle}>DISCOVER THE CAMPUS. ACCEPT YOUR MISSION. LEVEL UP.</p>
          <button className={styles.ctaButton} onClick={() => document.getElementById('locations')?.scrollIntoView({ behavior: 'smooth' })}>
            EXPLORE MISSIONS
          </button>
        </div>
      </section>

      <div className={styles.container}>
        {/* Urgent/Special sections */}
        <div className={styles.specialSections}>
          {emergencyQuests.length > 0 && (
            <section className={styles.emergencySection}>
              <h2 className={styles.sectionTitle}>EMERGENCY ASSISTANCE REQUIRED</h2>
              <div className={styles.questGrid}>
                {emergencyQuests.map(q => (
                  <QuestCard key={q.id} quest={q} locationName={locations.find(l => l.id === q.location_id)?.name} />
                ))}
              </div>
            </section>
          )}

          <div className={styles.grid2Col}>
            {dailyQuests.length > 0 && (
              <section className={styles.dailySection}>
                <h2 className={styles.sectionTitle}>DAILY MISSIONS</h2>
                <div className={styles.questList}>
                  {dailyQuests.map(q => (
                    <QuestCard key={q.id} quest={q} locationName={locations.find(l => l.id === q.location_id)?.name} />
                  ))}
                </div>
              </section>
            )}

            {secretQuests.length > 0 && (
              <section className={styles.secretSection}>
                <h2 className={styles.sectionTitle}>RESTRICTED MISSIONS</h2>
                <div className={styles.questList}>
                  {secretQuests.map(q => (
                    <QuestCard key={q.id} quest={q} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className={styles.filterSection}>
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`${styles.filterBtn} ${selectedCategory === cat ? styles.activeFilter : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Locations */}
        <section id="locations" className={styles.locationsSection}>
          <h2 className={styles.sectionTitle}>MISSION ZONES</h2>
          <div className={styles.locationGrid}>
            {locations.map(loc => (
              <LocationCard 
                key={loc.id} 
                location={loc} 
                activeMissionCount={quests.filter(q => q.location_id === loc.id).length}
                onClick={handleLocationClick}
              />
            ))}
          </div>
        </section>

        {/* Active Mission Bulletin */}
        <section className={styles.bulletinSection}>
          <h2 className={styles.sectionTitle}>ACTIVE BULLETIN</h2>
          <div className={styles.questGrid}>
            {filteredQuests.map(q => (
              <QuestCard key={q.id} quest={q} locationName={locations.find(l => l.id === q.location_id)?.name} />
            ))}
          </div>
        </section>
      </div>

      {/* Interactive Reveal Component */}
      {selectedLocation && (
        <LocationQuestReveal 
          location={selectedLocation} 
          quests={locationQuests} 
          onClose={() => setSelectedLocation(null)}
          onAccept={handleAcceptMission}
        />
      )}
    </main>
  );
}
