import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load persisted user on mount
    const persistedUser = StorageService.getUser();
    if (persistedUser) {
      setUser(persistedUser);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password?: string) => {
    // Simulate login API call
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, we would validate the password here.
    // For this offline-first demo, we'll accept any non-empty password if provided.
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0]
    };

    setUser(newUser);
    StorageService.saveUser(newUser);
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    StorageService.clearUser();
  }, []);

  return { user, login, logout, loading };
};