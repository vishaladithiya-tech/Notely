import { useState, useEffect, useCallback, useRef } from 'react';
import { Note } from '../types';
import { StorageService } from '../services/storage';
import { SyncService } from '../services/syncService';

type SyncStatus = 'idle' | 'syncing' | 'offline' | 'error' | 'synced';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  
  // Use a ref to track if a sync is currently in progress to prevent double-syncs
  const isSyncingRef = useRef(false);

  // 1. Load from local storage on mount
  useEffect(() => {
    const loadedNotes = StorageService.getNotes();
    // Sort: Pinned first, then by lastUpdated desc
    const sorted = loadedNotes.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.lastUpdated - a.lastUpdated;
    });
    setNotes(sorted);
  }, []);

  // 2. Persist to local storage whenever notes change
  useEffect(() => {
    if (notes.length > 0) {
        StorageService.saveNotes(notes);
    }
  }, [notes]);

  // 3. Sync Logic
  const runSync = useCallback(async () => {
    if (isSyncingRef.current) return;
    if (!navigator.onLine) {
      setSyncStatus('offline');
      return;
    }

    // Find unsynced notes
    const unsyncedNotes = notes.filter(n => !n.synced);
    if (unsyncedNotes.length === 0) {
      setSyncStatus('synced');
      return;
    }

    try {
      isSyncingRef.current = true;
      setSyncStatus('syncing');

      // Attempt to upload to "backend"
      const syncedIds = await SyncService.syncNotes(unsyncedNotes);

      // Update local state to reflect sync status
      setNotes(prevNotes => {
        const updated = prevNotes.map(note => 
          syncedIds.includes(note.id) 
            ? { ...note, synced: true } 
            : note
        );
        // Persist immediately
        StorageService.saveNotes(updated);
        return updated;
      });

      setLastSyncedAt(Date.now());
      setSyncStatus('synced');
    } catch (error) {
      console.error("Sync failed:", error);
      setSyncStatus('error');
    } finally {
      isSyncingRef.current = false;
    }
  }, [notes]);

  // Auto-sync trigger
  useEffect(() => {
    // Debounce sync attempt when notes change
    const timeoutId = setTimeout(() => {
      const hasUnsynced = notes.some(n => !n.synced);
      if (hasUnsynced) {
        runSync();
      }
    }, 2000); // Wait 2 seconds of inactivity before syncing

    // Listen for online status
    const handleOnline = () => runSync();
    window.addEventListener('online', handleOnline);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('online', handleOnline);
    };
  }, [notes, runSync]);

  // --- CRUD Operations ---

  const addNote = (title: string, content: string, tags: string[] = []) => {
    const newNote: Note = {
      id: Date.now().toString(), // Simple ID generation
      title: title || 'Untitled Note',
      content,
      lastUpdated: Date.now(),
      synced: false, // Start as unsynced
      tags,
      pinned: false
    };
    setNotes(prev => [newNote, ...prev]);
    setSyncStatus('idle'); // Reset status to trigger sync check
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => {
      if (note.id === id) {
        return { 
          ...note, 
          ...updates, 
          lastUpdated: Date.now(), 
          synced: false // Mark dirty on edit
        };
      }
      return note;
    }));
    setSyncStatus('idle');
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const togglePin = (id: string) => {
      setNotes(prev => {
          const updated = prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n);
          // Re-sort
          return updated.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return b.lastUpdated - a.lastUpdated;
          });
      });
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    syncStatus,
    lastSyncedAt,
    triggerSync: runSync
  };
};