import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageMode } from '../data/parittaTexts';

// Keys for AsyncStorage
const STORAGE_KEYS = {
  DARK_MODE: '@settings_darkMode',
  LANGUAGE: '@settings_language',
  AUTO_SCROLL: '@settings_autoScroll',
  SHOW_TRANSLATION: '@settings_showTranslation',
  FONT_SIZE: '@settings_fontSize',
};

export interface AppSettings {
  darkMode: boolean;
  language: LanguageMode;
  autoScroll: boolean;
  showTranslation: boolean;
  fontSize: number;
}

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  isLoaded: boolean;
}

const defaultSettings: AppSettings = {
  darkMode: false,
  language: 'myanmar',
  autoScroll: false,
  showTranslation: false,
  fontSize: 18,
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  isLoaded: false,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const [darkMode, language, autoScroll, showTranslation, fontSize] =
          await Promise.all([
            AsyncStorage.getItem(STORAGE_KEYS.DARK_MODE),
            AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
            AsyncStorage.getItem(STORAGE_KEYS.AUTO_SCROLL),
            AsyncStorage.getItem(STORAGE_KEYS.SHOW_TRANSLATION),
            AsyncStorage.getItem(STORAGE_KEYS.FONT_SIZE),
          ]);

        setSettings({
          darkMode: darkMode === 'true',
          language: (language as LanguageMode) || 'myanmar',
          autoScroll: autoScroll === 'true',
          showTranslation: showTranslation === 'true',
          fontSize: fontSize ? parseInt(fontSize, 10) : 18,
        });
      } catch (e) {
        console.warn('Failed to load settings:', e);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };

      // Persist to storage
      const promises: Promise<void>[] = [];
      if ('darkMode' in partial) {
        promises.push(
          AsyncStorage.setItem(STORAGE_KEYS.DARK_MODE, String(next.darkMode))
        );
      }
      if ('language' in partial) {
        promises.push(
          AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, next.language)
        );
      }
      if ('autoScroll' in partial) {
        promises.push(
          AsyncStorage.setItem(
            STORAGE_KEYS.AUTO_SCROLL,
            String(next.autoScroll)
          )
        );
      }
      if ('showTranslation' in partial) {
        promises.push(
          AsyncStorage.setItem(
            STORAGE_KEYS.SHOW_TRANSLATION,
            String(next.showTranslation)
          )
        );
      }
      if ('fontSize' in partial) {
        promises.push(
          AsyncStorage.setItem(STORAGE_KEYS.FONT_SIZE, String(next.fontSize))
        );
      }
      Promise.all(promises).catch((e) =>
        console.warn('Failed to save settings:', e)
      );

      return next;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isLoaded }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
