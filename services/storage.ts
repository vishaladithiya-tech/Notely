import { Note, User } from '../types';

const NOTES_KEY = 'notely_data';
const USER_KEY = 'notely_user';
const INTRO_KEY = 'notely_intro_seen';

export const StorageService = {
  // --- Notes ---
  getNotes: (): Note[] => {
    try {
      const data = localStorage.getItem(NOTES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load notes", e);
      return [];
    }
  },

  saveNotes: (notes: Note[]): void => {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error("Failed to save notes", e);
    }
  },

  // --- User / Auth ---
  getUser: (): User | null => {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  saveUser: (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearUser: (): void => {
    localStorage.removeItem(USER_KEY);
  },

  // --- UI State ---
  hasSeenIntro: (): boolean => {
    return localStorage.getItem(INTRO_KEY) === 'true';
  },

  setIntroSeen: (): void => {
    localStorage.setItem(INTRO_KEY, 'true');
  }
};