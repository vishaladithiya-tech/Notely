import { Note } from '../types';

// Mock server database in memory (resets on refresh, but serves the purpose of the demo)
// In a real app, this would be an actual API endpoint.
const serverDatabase: Record<string, Note> = {};

/**
 * Simulates uploading notes to a backend.
 * Returns the IDs of notes that were successfully synced.
 */
export const SyncService = {
  syncNotes: async (notes: Note[]): Promise<string[]> => {
    // 1. Check for internet connection first
    if (!navigator.onLine) {
      throw new Error("No internet connection");
    }

    // 2. Simulate network latency (500ms - 1500ms)
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));

    // 3. Simulate random server failure (10% chance)
    if (Math.random() < 0.1) {
      throw new Error("Server error: 500 Internal Server Error");
    }

    const syncedIds: string[] = [];

    // 4. Process "uploads"
    notes.forEach(note => {
      serverDatabase[note.id] = {
        ...note,
        synced: true // Server version is always clean
      };
      syncedIds.push(note.id);
    });

    console.log(`[SyncService] Successfully synced ${syncedIds.length} notes to 'cloud'.`);
    return syncedIds;
  }
};
