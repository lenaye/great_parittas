import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PARITTAS } from '../data/parittas';
import { useSettings } from '../context/SettingsContext';
import { useAudio } from '../context/AudioContext';
import { getTheme } from '../theme/themes';
import type { RootStackParamList } from '../navigation/types';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const { settings } = useSettings();
  const { state: audioState, togglePlayback } = useAudio();
  const theme = getTheme(settings.darkMode);

  const getTitle = (paritta: (typeof PARITTAS)[0]) => {
    if (settings.language === 'myanmar') {
      return paritta.titleMyanmar;
    }
    return paritta.titlePali;
  };

  const getSubtitle = (paritta: (typeof PARITTAS)[0]) => {
    if (settings.language === 'myanmar') {
      return paritta.titlePali;
    }
    return paritta.titleEnglish;
  };

  const formatTime = (millis: number): string => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle={settings.darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.banner}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.banner }]}>
        <Text style={[styles.headerTitle, { color: theme.bannerText, fontFamily: settings.language === 'myanmar' ? 'Padauk-Bold' : 'Maitree-Bold' }]}>
          {settings.language === 'myanmar'
            ? 'ပရိတ်ကြီး ၁၁ သုတ်'
            : '11 Mahāparittas'}
        </Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
          accessibilityLabel="Settings"
        >
          <Text style={[styles.gearIcon, { color: theme.bannerText }]}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* Paritta List */}
      <FlatList
        data={PARITTAS}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isNowPlaying = audioState.parittaId === item.id;
          const isPlaying = isNowPlaying && audioState.isPlaying;

          return (
            <TouchableOpacity
              style={[
                styles.card,
                {
                  backgroundColor: isNowPlaying
                    ? settings.darkMode
                      ? '#3A2A1A'
                      : '#E8DCC8'
                    : theme.cardBg,
                  borderColor: isNowPlaying ? theme.primary : theme.cardBorder,
                  borderWidth: isNowPlaying ? 2 : 1,
                },
              ]}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('Paritta', { parittaId: item.id })
              }
            >
              <View style={styles.cardNumber}>
                <View
                  style={[
                    styles.numberCircle,
                    { backgroundColor: theme.primary },
                  ]}
                >
                  <Text
                    style={[styles.numberText, { color: theme.bannerText, fontFamily: 'Maitree-Bold' }]}
                  >
                    {item.id}
                  </Text>
                </View>
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, { color: theme.text, fontFamily: settings.language === 'myanmar' ? 'Padauk-Bold' : 'Maitree-Medium' }]}>
                  {getTitle(item)}
                </Text>
                <Text
                  style={[styles.cardSubtitle, { color: theme.textSecondary, fontFamily: 'Maitree-Regular' }]}
                >
                  {getSubtitle(item)}
                </Text>
              </View>

              {/* Mini audio controls for currently playing sutta */}
              {isNowPlaying && (
                <View style={styles.miniAudioControl}>
                  <TouchableOpacity
                    style={[
                      styles.miniPlayButton,
                      { backgroundColor: theme.primary },
                    ]}
                    onPress={(e) => {
                      e.stopPropagation?.();
                      togglePlayback(item.id);
                    }}
                    accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
                  >
                    <Text style={[styles.miniPlayIcon, { color: theme.bannerText }]}>
                      {isPlaying ? '⏸' : '▶'}
                    </Text>
                  </TouchableOpacity>
                  <View style={[styles.miniProgressBar, { backgroundColor: theme.progressBg }]}>
                    <View
                      style={[
                        styles.miniProgressFill,
                        {
                          backgroundColor: theme.progressFill,
                          width: `${Math.min(audioState.progress * 100, 100)}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.miniTimeText, { color: theme.textSecondary, fontFamily: 'Maitree-Regular' }]}>
                    {formatTime(audioState.position)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  settingsButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  gearIcon: {
    fontSize: 24,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardNumber: {
    marginRight: 16,
  },
  numberCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
  },
  miniAudioControl: {
    alignItems: 'center',
    marginLeft: 12,
    width: 36,
  },
  miniPlayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniPlayIcon: {
    fontSize: 13,
  },
  miniProgressBar: {
    width: 36,
    height: 3,
    borderRadius: 1.5,
    marginTop: 4,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  miniTimeText: {
    fontSize: 9,
    marginTop: 2,
  },
});
