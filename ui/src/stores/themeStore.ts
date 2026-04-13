import { create } from 'zustand';

export type ThemeMode = 'system' | 'light' | 'dark';

export type ThemeState = {
  preference: ThemeMode;
  setPreference: (mode: ThemeMode) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  preference: 'system',
  setPreference: (preference) => set({ preference }),
}));
