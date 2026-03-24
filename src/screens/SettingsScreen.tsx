import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSettings } from '../context/SettingsContext';
import { getTheme } from '../theme/themes';
import type { RootStackParamList } from '../navigation/types';
import type { LanguageMode } from '../data/parittaTexts';
import type { ChanterMode } from '../context/SettingsContext';

type SettingsNavProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsNavProp>();
  const { settings, updateSettings } = useSettings();
  const theme = getTheme(settings.darkMode);

  const fontSizes = [14, 16, 18, 20, 22, 24, 28];

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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go Back"
        >
          <Text style={[styles.backIcon, { color: theme.bannerText }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.bannerText }]}>
          Settings
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Language Selection */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          LANGUAGE
        </Text>
        <View
          style={[
            styles.settingsCard,
            {
              backgroundColor: theme.settingsItemBg,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          {(['myanmar', 'english'] as LanguageMode[]).map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[
                styles.languageOption,
                {
                  borderBottomColor: theme.border,
                  borderBottomWidth: lang === 'myanmar' ? 1 : 0,
                },
              ]}
              onPress={() => updateSettings({ language: lang })}
            >
              <View style={styles.languageRow}>
                <Text style={[styles.languageFlag]}>
                  {lang === 'myanmar' ? '🇲🇲' : '🇬🇧'}
                </Text>
                <View style={styles.languageTextCol}>
                  <Text
                    style={[styles.languageName, { color: theme.text, fontFamily: lang === 'myanmar' ? 'Padauk-Regular' : 'Maitree-Medium' }]}
                  >
                    {lang === 'myanmar' ? 'မြန်မာ' : 'English'}
                  </Text>
                  <Text
                    style={[
                      styles.languageDesc,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {lang === 'myanmar'
                      ? 'Myanmar script & Burmese translation'
                      : 'Roman script & English translation'}
                  </Text>
                </View>
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: theme.primary,
                      backgroundColor:
                        settings.language === lang
                          ? theme.primary
                          : 'transparent',
                    },
                  ]}
                >
                  {settings.language === lang && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Audio Chanter Selection */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          AUDIO
        </Text>
        <View
          style={[
            styles.settingsCard,
            {
              backgroundColor: theme.settingsItemBg,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          {([
            {
              id: 'uvicitta' as ChanterMode,
              nameEn: 'Ven. U Vicittasārābhivaṃsa',
              nameMy: 'ဆရာတော် ဦးဝိစိတ္တသာရာဘိဝံသ',
            },
            {
              id: 'usilananda' as ChanterMode,
              nameEn: 'Ven. U Sīlānanda',
              nameMy: 'ဆရာတော် ဦးသီလာနန္ဒ',
            },
          ]).map((monk, index) => (
            <TouchableOpacity
              key={monk.id}
              style={[
                styles.languageOption,
                {
                  borderBottomColor: theme.border,
                  borderBottomWidth: index === 0 ? 1 : 0,
                },
              ]}
              onPress={() => updateSettings({ chanter: monk.id })}
            >
              <View style={styles.languageRow}>
                <View style={styles.languageTextCol}>
                  <Text
                    style={[styles.languageName, { color: theme.text, fontFamily: settings.language === 'myanmar' ? 'Padauk-Regular' : 'Maitree-Medium' }]}
                  >
                    {settings.language === 'myanmar' ? monk.nameMy : monk.nameEn}
                  </Text>
                </View>
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: theme.primary,
                      backgroundColor:
                        settings.chanter === monk.id
                          ? theme.primary
                          : 'transparent',
                    },
                  ]}
                >
                  {settings.chanter === monk.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Appearance */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          APPEARANCE
        </Text>
        <View
          style={[
            styles.settingsCard,
            {
              backgroundColor: theme.settingsItemBg,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.settingsRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Dark Mode
              </Text>
              <Text
                style={[
                  styles.settingDesc,
                  { color: theme.textSecondary },
                ]}
              >
                Use dark color theme
              </Text>
            </View>
            <Switch
              value={settings.darkMode}
              onValueChange={(val) => updateSettings({ darkMode: val })}
              trackColor={{
                false: theme.progressBg,
                true: theme.primaryLight,
              }}
              thumbColor={
                settings.darkMode ? theme.primary : theme.buttonBg
              }
            />
          </View>
        </View>

        {/* Translation */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          TRANSLATION
        </Text>
        <View
          style={[
            styles.settingsCard,
            {
              backgroundColor: theme.settingsItemBg,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.settingsRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Show Translation
              </Text>
              <Text
                style={[
                  styles.settingDesc,
                  { color: theme.textSecondary },
                ]}
              >
                {settings.language === 'myanmar'
                  ? 'Show Burmese translation below Pali'
                  : 'Show English translation below Pali'}
              </Text>
            </View>
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
          </View>
        </View>

        {/* Font Size */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          FONT SIZE
        </Text>
        <View
          style={[
            styles.settingsCard,
            {
              backgroundColor: theme.settingsItemBg,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.fontSizeRow}>
            {fontSizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.fontSizeButton,
                  {
                    backgroundColor:
                      settings.fontSize === size
                        ? theme.buttonActiveBg
                        : theme.buttonBg,
                  },
                ]}
                onPress={() => updateSettings({ fontSize: size })}
              >
                <Text
                  style={[
                    styles.fontSizeText,
                    {
                      color:
                        settings.fontSize === size
                          ? theme.buttonActiveText
                          : theme.buttonText,
                      fontWeight:
                        settings.fontSize === size ? 'bold' : 'normal',
                      fontFamily:
                        settings.fontSize === size ? 'Maitree-Bold' : 'Maitree-Regular',
                    },
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text
            style={[
              styles.previewText,
              { color: theme.text, fontSize: settings.fontSize, fontFamily: settings.language === 'myanmar' ? 'Padauk-Regular' : 'Maitree-Regular' },
            ]}
          >
            {settings.language === 'myanmar'
              ? 'နမော တဿ ဘဂဝတော'
              : 'Namo tassa bhagavato'}
          </Text>
        </View>

        {/* Playback */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          PLAYBACK
        </Text>
        <View
          style={[
            styles.settingsCard,
            {
              backgroundColor: theme.settingsItemBg,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.settingsRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Auto-scroll
              </Text>
              <Text
                style={[
                  styles.settingDesc,
                  { color: theme.textSecondary },
                ]}
              >
                Scroll text during audio playback
              </Text>
            </View>
            <Switch
              value={settings.autoScroll}
              onValueChange={(val) => updateSettings({ autoScroll: val })}
              trackColor={{
                false: theme.progressBg,
                true: theme.primaryLight,
              }}
              thumbColor={
                settings.autoScroll ? theme.primary : theme.buttonBg
              }
            />
          </View>
        </View>

        {/* About */}
        <TouchableOpacity
          style={[
            styles.settingsCard,
            {
              backgroundColor: theme.settingsItemBg,
              borderColor: theme.cardBorder,
              marginTop: 24,
            },
          ]}
          onPress={() => navigation.navigate('About')}
          activeOpacity={0.7}
        >
          <View style={styles.settingsRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                About
              </Text>
              <Text
                style={[
                  styles.settingDesc,
                  { color: theme.textSecondary },
                ]}
              >
                Version, resources & credits
              </Text>
            </View>
            <Text style={{ color: theme.textSecondary, fontSize: 18 }}>→</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    minWidth: 44,
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 22,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Maitree-Bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
    fontFamily: 'Maitree-Medium',
  },
  settingsCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Maitree-Medium',
  },
  settingDesc: {
    fontSize: 13,
    marginTop: 2,
    fontFamily: 'Maitree-Regular',
  },
  languageOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 28,
    marginRight: 14,
  },
  languageTextCol: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
  },
  languageDesc: {
    fontSize: 13,
    marginTop: 2,
    fontFamily: 'Maitree-Regular',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  fontSizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  fontSizeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontSizeText: {
    fontSize: 14,
  },
  previewText: {
    textAlign: 'center',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
});
