import { create } from 'zustand';

export type SessionUser = {
  id: number;
  email: string;
  username?: string;
  first_name?: string | null;
  last_name?: string | null;
};

export type SessionState = {
  user: SessionUser | null;
  setUser: (user: SessionUser | null) => void;
  signOut: () => void;
  isGuest: () => boolean;
};

export const useSessionStore = create<SessionState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  signOut: () => set({ user: null }),
  isGuest: () => get().user === null,
}));
