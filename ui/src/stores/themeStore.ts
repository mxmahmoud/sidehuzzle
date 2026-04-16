import { create } from 'zustand';

export type ThemeMode = 'system' | 'light' | 'dark';

export type ThemeState = {
  preference: ThemeMode;
  setPreference: (mode: ThemeMode) => void;
};

const THEME_STORAGE_KEY = 'sidehuzle.theme.preference';

function readStoredPreference(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'system' || stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch {
    // Storage can be unavailable in private contexts; fall back quietly.
  }
  return 'light';
}

function writeStoredPreference(preference: ThemeMode) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Ignore persistence failures; the in-memory preference still applies.
  }
}

export const useThemeStore = create<ThemeState>((set) => ({
  preference: readStoredPreference(),
  setPreference: (preference) => {
    writeStoredPreference(preference);
    set({ preference });
  },
}));
