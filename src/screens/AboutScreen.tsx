import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSettings } from '../context/SettingsContext';
import { getTheme } from '../theme/themes';
import type { RootStackParamList } from '../navigation/types';

type AboutNavProp = NativeStackNavigationProp<RootStackParamList, 'About'>;

const APP_INFO = {
  name: '11 Mahāparittas',
  nameMy: 'ပရိတ်ကြီး ၁၁ သုတ်',
  company: 'Nandawon Tech Ltd',
  version: '1.01',
  releaseDate: 'March 2026',
};

const RESOURCES = [
  {
    title: 'Tipitaka.org',
    url: 'https://www.tipitaka.org',
    description: 'Pali texts in Myanmar script',
  },
  {
    title: 'SuttaCentral',
    url: 'https://suttacentral.net',
    description: 'Pali texts in Roman script and English translations',
  },
  {
    title: 'Digital Pali Reader',
    url: 'https://www.digitalpalireader.online',
    description: 'Pali text references and analysis',
  },
];

export default function AboutScreen() {
  const navigation = useNavigation<AboutNavProp>();
  const { settings } = useSettings();
  const theme = getTheme(settings.darkMode);

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go Back"
        >
          <Text style={[styles.backIcon, { color: theme.bannerText }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.bannerText }]}>
          About
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* App Identity */}
        <View style={[styles.appCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <Text style={[styles.appIcon]}>📿</Text>
          <Text style={[styles.appName, { color: theme.text }]}>
            {settings.language === 'myanmar' ? APP_INFO.nameMy : APP_INFO.name}
          </Text>
          <Text style={[styles.companyName, { color: theme.textSecondary }]}>
            {APP_INFO.company}
          </Text>
          <View style={styles.versionRow}>
            <Text style={[styles.versionLabel, { color: theme.textSecondary }]}>
              Version {APP_INFO.version}
            </Text>
            <Text style={[styles.dot, { color: theme.textSecondary }]}>  •  </Text>
            <Text style={[styles.versionLabel, { color: theme.textSecondary }]}>
              {APP_INFO.releaseDate}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <Text style={[styles.descriptionText, { color: theme.text }]}>
            {settings.language === 'myanmar'
              ? 'ဤအက်ပ်သည် ထေရဝါဒ ဗုဒ္ဓ ပါဠိတော်ကျမ်းမှ ပရိတ်ကြီး ၁၁ သုတ်ကို ပါဠိစာသားများ၊ ဘာသာပြန်များနှင့် အသံဖတ်ကြားမှုတို့ဖြင့် ဖော်ပြထားပါသည်။'
              : 'This app presents the 11 Great Parittas (protective discourses) from the Theravāda Buddhist Pali Canon, with Pali texts, translations, and audio recitations.'}
          </Text>
        </View>

        {/* Resources */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          RESOURCES
        </Text>
        <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          {RESOURCES.map((resource, index) => (
            <TouchableOpacity
              key={resource.url}
              style={[
                styles.resourceRow,
                {
                  borderBottomColor: theme.border,
                  borderBottomWidth: index < RESOURCES.length - 1 ? 1 : 0,
                },
              ]}
              onPress={() => openLink(resource.url)}
              activeOpacity={0.7}
            >
              <View style={styles.resourceInfo}>
                <Text style={[styles.resourceTitle, { color: theme.primary }]}>
                  {resource.title}
                </Text>
                <Text style={[styles.resourceDesc, { color: theme.textSecondary }]}>
                  {resource.description}
                </Text>
              </View>
              <Text style={[styles.linkArrow, { color: theme.textSecondary }]}>↗</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          © 2026 {APP_INFO.company}
        </Text>

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
  appCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  appIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Maitree-Bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 15,
    fontFamily: 'Maitree-Medium',
    marginBottom: 8,
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionLabel: {
    fontSize: 13,
    fontFamily: 'Maitree-Regular',
  },
  dot: {
    fontSize: 13,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: 16,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    fontFamily: 'Maitree-Regular',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 4,
    fontFamily: 'Maitree-Medium',
  },
  resourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  resourceInfo: {
    flex: 1,
    marginRight: 12,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Maitree-Medium',
  },
  resourceDesc: {
    fontSize: 13,
    marginTop: 2,
    fontFamily: 'Maitree-Regular',
  },
  linkArrow: {
    fontSize: 18,
  },
  footerText: {
    fontSize: 13,
    fontFamily: 'Maitree-Regular',
    textAlign: 'center',
    marginTop: 32,
  },
});
