// Theme definitions for light and dark modes

export interface Theme {
  background: string;
  surface: string;
  banner: string;
  bannerText: string;
  text: string;
  textSecondary: string;
  textTranslation: string;
  primary: string;
  primaryLight: string;
  border: string;
  buttonBg: string;
  buttonText: string;
  buttonActiveBg: string;
  buttonActiveText: string;
  progressBg: string;
  progressFill: string;
  cardBg: string;
  cardBorder: string;
  settingsItemBg: string;
}

export const LightTheme: Theme = {
  background: '#F5F0E8',       // Warm parchment
  surface: '#FFFFFF',
  banner: '#8B4513',           // Saddle brown - Buddhist temple color
  bannerText: '#FFFFFF',
  text: '#2C1810',
  textSecondary: '#6B4C3B',
  textTranslation: '#5C6B3B',  // Olive green for translations
  primary: '#8B4513',
  primaryLight: '#D4A574',
  border: '#D4C5B2',
  buttonBg: '#E8DDD0',
  buttonText: '#5C3D2E',
  buttonActiveBg: '#D4A574',
  buttonActiveText: '#FFFFFF',
  progressBg: '#D4C5B2',
  progressFill: '#3B7DD8',
  cardBg: '#FFFFFF',
  cardBorder: '#E8DDD0',
  settingsItemBg: '#FFFFFF',
};

export const DarkTheme: Theme = {
  background: '#1A1210',
  surface: '#2C2420',
  banner: '#3D2B1F',
  bannerText: '#E8DDD0',
  text: '#E8DDD0',
  textSecondary: '#A89080',
  textTranslation: '#8BA870',
  primary: '#D4A574',
  primaryLight: '#8B6914',
  border: '#4A3B30',
  buttonBg: '#3D2B1F',
  buttonText: '#D4C5B2',
  buttonActiveBg: '#D4A574',
  buttonActiveText: '#1A1210',
  progressBg: '#4A3B30',
  progressFill: '#3B7DD8',
  cardBg: '#2C2420',
  cardBorder: '#4A3B30',
  settingsItemBg: '#2C2420',
};

export function getTheme(darkMode: boolean): Theme {
  return darkMode ? DarkTheme : LightTheme;
}
