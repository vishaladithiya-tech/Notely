export interface Note {
  id: string;
  title: string;
  content: string;
  lastUpdated: number;
  synced: boolean;
  tags: string[];
  pinned?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}