import React, { useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import { SettingsProvider, useSettings } from './src/context/SettingsContext';
import { AudioProvider } from './src/context/AudioContext';
import AppNavigator from './src/navigation/AppNavigator';

function AppContent() {
  const { isLoaded: settingsLoaded } = useSettings();

  const [fontsLoaded] = useFonts({
    'Padauk-Regular': require('./assets/fonts/Padauk-Regular.ttf'),
    'Padauk-Bold': require('./assets/fonts/Padauk-Bold.ttf'),
    'Maitree-Regular': require('./assets/fonts/Maitree-Regular.ttf'),
    'Maitree-Medium': require('./assets/fonts/Maitree-Medium.ttf'),
    'Maitree-Bold': require('./assets/fonts/Maitree-Bold.ttf'),
  });

  if (!fontsLoaded || !settingsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    );
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AudioProvider>
          <AppContent />
        </AudioProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F0E8',
  },
});
