import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Foundation from '@expo/vector-icons/Foundation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { PARITTAS } from '../data/parittas';
import { getParittaDisplayData } from '../data/parittaTexts';
import { useSettings } from '../context/SettingsContext';
import { getTheme } from '../theme/themes';
import AudioPlayer from '../components/AudioPlayer';
import type { RootStackParamList } from '../navigation/types';

type ParittaNavProp = NativeStackNavigationProp<RootStackParamList, 'Paritta'>;
type ParittaRouteProp = RouteProp<RootStackParamList, 'Paritta'>;

export default function ParittaScreen() {
  const navigation = useNavigation<ParittaNavProp>();
  const route = useRoute<ParittaRouteProp>();
  const { settings, updateSettings } = useSettings();
  const theme = getTheme(settings.darkMode);

  const [currentParittaId, setCurrentParittaId] = useState(
    route.params.parittaId
  );
  const scrollViewRef = useRef<ScrollView>(null);

  const paritta = PARITTAS.find((p) => p.id === currentParittaId);
  const displayData = getParittaDisplayData(
    currentParittaId,
    settings.language,
    settings.showTranslation
  );

  // Scroll to top when paritta changes
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, [currentParittaId]);

  const getDisplayTitle = () => {
    if (!paritta) return '';
    if (settings.language === 'myanmar') {
      return paritta.titleMyanmar;
    }
    return paritta.titlePali;
  };

  const navigateToParitta = (id: number) => {
    setCurrentParittaId(id);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle={settings.darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.banner}
      />

      {/* Fixed Banner Section */}
      <View style={[styles.banner, { backgroundColor: theme.banner }]}>
        {/* Top row: Home, Title, Settings */}
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Home')}
            accessibilityLabel="Go Home"
          >
            <Foundation name="home" size={24} color={theme.bannerText} />
          </TouchableOpacity>

          <Text
            style={[styles.title, { color: theme.bannerText, fontFamily: settings.language === 'myanmar' ? 'Padauk-Bold' : 'Maitree-Bold' }]}
            numberOfLines={1}
          >
            {getDisplayTitle()}
          </Text>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Settings')}
            accessibilityLabel="Settings"
          >
            <Text style={[styles.navIcon, { color: theme.bannerText }]}>
              ⚙
            </Text>
          </TouchableOpacity>
        </View>

        {/* Paritta number buttons */}
        <View style={styles.numberRow}>
          {PARITTAS.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[
                styles.numButton,
                {
                  backgroundColor:
                    p.id === currentParittaId
                      ? theme.buttonActiveBg
                      : theme.buttonBg,
                },
              ]}
              onPress={() => navigateToParitta(p.id)}
            >
              <Text
                style={[
                  styles.numButtonText,
                  {
                    color:
                      p.id === currentParittaId
                        ? theme.buttonActiveText
                        : theme.buttonText,
                    fontWeight:
                      p.id === currentParittaId ? 'bold' : 'normal',
                    fontFamily:
                      p.id === currentParittaId ? 'Maitree-Bold' : 'Maitree-Regular',
                  },
                ]}
              >
                {p.id}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Translation toggle */}
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.bannerText, fontFamily: settings.language === 'myanmar' ? 'Padauk-Regular' : 'Maitree-Regular' }]}>
            {settings.language === 'myanmar' ? 'ပါဠိသာ' : 'Pali Only'}
          </Text>
          <Switch
            value={settings.showTranslation}
            onValueChange={(val) =>
              updateSettings({ showTranslation: val })
            }
            trackColor={{
              false: theme.progressBg,
              true: theme.primaryLight,
            }}
            thumbColor={
              settings.showTranslation ? theme.primary : theme.buttonBg
            }
          />
          <Text style={[styles.toggleLabel, { color: theme.bannerText, fontFamily: settings.language === 'myanmar' ? 'Padauk-Regular' : 'Maitree-Regular' }]}>
            {settings.language === 'myanmar'
              ? 'ဘာသာပြန်ပါ'
              : 'With Translation'}
          </Text>
        </View>

        {/* Audio Player */}
        <AudioPlayer parittaId={currentParittaId} theme={theme} />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        {/* Preamble / Prelude */}
        {displayData.preamble ? (
          <View style={styles.preambleBlock}>
            <Text
              style={[
                styles.preambleText,
                {
                  color: theme.textSecondary,
                  fontSize: settings.fontSize - 2,
                  fontFamily:
                    settings.language === 'myanmar'
                      ? 'Padauk-Regular'
                      : 'Maitree-Regular',
                },
              ]}
            >
              {displayData.preamble}
            </Text>
            {/* Prelude translation */}
            {displayData.preambleTranslation ? (
              <Text
                style={[
                  styles.preambleTranslation,
                  {
                    color: theme.textTranslation,
                    fontSize: settings.fontSize - (settings.language === 'english' ? 3 : 4),
                    fontFamily:
                      settings.language === 'myanmar'
                        ? 'Padauk-Regular'
                        : 'Maitree-Regular',
                  },
                ]}
              >
                {displayData.preambleTranslation}
              </Text>
            ) : null}
            {/* Separator between prelude and main sutta */}
            <View style={styles.preludeSeparator}>
              <View style={[styles.separatorLine, { backgroundColor: theme.border }]} />
              <Text style={[styles.separatorDot, { color: theme.primary }]}>✦</Text>
              <View style={[styles.separatorLine, { backgroundColor: theme.border }]} />
            </View>
          </View>
        ) : null}

        {/* Stanzas */}
        {displayData.stanzas.map((stanza) => (
          <View key={stanza.number} style={styles.stanzaBlock}>
            {/* Pali text */}
            <Text
              style={[
                styles.paliText,
                {
                  color: theme.text,
                  fontSize: settings.fontSize,
                  fontFamily:
                    settings.language === 'myanmar'
                      ? 'Padauk-Regular'
                      : 'Maitree-Regular',
                },
              ]}
            >
              {stanza.pali}
            </Text>

            {/* Translation (if enabled and available) */}
            {stanza.translation ? (
              <Text
                style={[
                  styles.translationText,
                  {
                    color: theme.textTranslation,
                    fontSize: settings.fontSize - (settings.language === 'english' ? 1 : 2),
                    fontFamily:
                      settings.language === 'myanmar'
                        ? 'Padauk-Regular'
                        : 'Maitree-Regular',
                  },
                ]}
              >
                {stanza.translation}
              </Text>
            ) : null}
          </View>
        ))}

        {/* Bottom padding */}
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    overflow: 'visible',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  navButton: {
    padding: 8,
    minWidth: 44,
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 22,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  numButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numButtonText: {
    fontSize: 13,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingBottom: 4,
    gap: 8,
  },
  toggleLabel: {
    fontSize: 13,
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  preambleBlock: {
    marginBottom: 20,
  },
  preambleText: {
    lineHeight: 26,
    fontStyle: 'italic',
  },
  preambleTranslation: {
    marginTop: 10,
    fontStyle: 'italic',
    lineHeight: 24,
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(0,0,0,0.1)',
  },
  preludeSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 4,
  },
  separatorLine: {
    flex: 1,
    height: 1,
  },
  separatorDot: {
    marginHorizontal: 12,
    fontSize: 14,
  },
  stanzaBlock: {
    marginBottom: 24,
  },
  paliText: {
    lineHeight: 30,
  },
  translationText: {
    marginTop: 10,
    fontStyle: 'italic',
    lineHeight: 26,
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(0,0,0,0.1)',
  },
});
