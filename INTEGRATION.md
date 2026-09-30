# INTEGRATION CONTRACT

This project is built for the CU MISSION BOARD — CAMPUS QUESTS hackathon.

It is split into two modules:
1. **Member 1 (Mission Scout)** - This repository. Owns location discovery, quest browsing, and the mission acceptance interaction.
2. **Member 2 (Active Mission)** - Owns the active mission logbook, proof submission, XP calculation, progression, streaks, and leaderboards.

## Handoff Mechanism

The integration between Member 1 and Member 2 happens at the "Accept Mission" point.

When a user accepts a mission on the `LocationQuestReveal` component, the `handleAcceptMission(questId: string)` callback is invoked.

### Data Flow
1. **User explores locations** (Member 1)
2. **User views location details and discovers quests** (Member 1)
3. **User clicks "ACCEPT MISSION"** (Member 1)
4. **`questId` is generated/passed** (Handoff point)
5. **System transitions to Active Mission state** (Member 2)

### Shared Database
Both members share the Neon PostgreSQL database. 

Member 1 created and uses the following tables:
- `locations`
- `quests` (references `locations.id`)

Member 2 will create additional tables (e.g., `user_quests`, `users`, `proofs`, etc.) that reference `quests.id`.

### Integrating
To merge these repositories later, Member 2 should wrap or implement the `onAccept(questId)` callback to record the user's acceptance in the database and redirect them to the Active Mission Logbook.
