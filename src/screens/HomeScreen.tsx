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
import { getTheme } from '../theme/themes';
import type { RootStackParamList } from '../navigation/types';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const { settings } = useSettings();
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
        <Text style={[styles.headerTitle, { color: theme.bannerText }]}>
          {settings.language === 'myanmar'
            ? 'ပရိတ်ကြီး ၁၁ သုတ်'
            : 'The 11 Great Parittas'}
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
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
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
                  style={[styles.numberText, { color: theme.bannerText }]}
                >
                  {item.id}
                </Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                {getTitle(item)}
              </Text>
              <Text
                style={[styles.cardSubtitle, { color: theme.textSecondary }]}
              >
                {getSubtitle(item)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
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
});
