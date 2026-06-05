import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = 'mrwhite_language';

interface SettingsStore {
  language: 'en' | 'gr';
  setLanguage: (lang: 'en' | 'gr') => void;
  loadLanguage: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  language: 'en',

  setLanguage: async (lang) => {
    set({ language: lang });
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    } catch (e) {
      // ignore
    }
  },

  loadLanguage: async () => {
    try {
      const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (saved === 'en' || saved === 'gr') {
        set({ language: saved });
      }
    } catch (e) {
      // ignore
    }
  },
}));
