import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Theme } from '../theme/themes';
import { useAudio } from '../context/AudioContext';

interface AudioPlayerProps {
  parittaId: number;
  theme: Theme;
}

export default function AudioPlayer({ parittaId, theme }: AudioPlayerProps) {
  const { audioAvailable, state, hasAudio, togglePlayback } = useAudio();

  // If audio module isn't available, show fallback
  if (!audioAvailable) {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.playButton,
            { backgroundColor: theme.progressBg, opacity: 0.5 },
          ]}
        >
          <Text style={[styles.playIcon, { color: theme.bannerText }]}>▶</Text>
        </View>
        <View style={styles.progressSection}>
          <View
            style={[styles.progressBar, { backgroundColor: theme.progressBg }]}
          />
          <View style={styles.timeRow}>
            <Text style={[styles.timeText, { color: theme.bannerText }]}>
              Audio unavailable in Expo Go
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // Determine if THIS paritta is the one currently loaded in the global player
  const isThisParitta = state.parittaId === parittaId;
  const isPlaying = isThisParitta && state.isPlaying;
  const progress = isThisParitta ? state.progress : 0;
  const position = isThisParitta ? state.position : 0;
  const duration = isThisParitta ? state.duration : 0;

  const formatTime = (millis: number): string => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const audioExists = hasAudio(parittaId);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.playButton,
          {
            backgroundColor: audioExists ? theme.primary : theme.progressBg,
            opacity: audioExists ? 1 : 0.5,
          },
        ]}
        onPress={() => togglePlayback(parittaId)}
        disabled={!audioExists}
        accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
      >
        <Text style={[styles.playIcon, { color: theme.bannerText }]}>
          {isPlaying ? '⏸' : '▶'}
        </Text>
      </TouchableOpacity>

      <View style={styles.progressSection}>
        <View
          style={[styles.progressBar, { backgroundColor: theme.progressBg }]}
        >
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: theme.progressFill,
                width: `${Math.min(progress * 100, 100)}%`,
              },
            ]}
          />
        </View>
        <View style={styles.timeRow}>
          <Text style={[styles.timeText, { color: theme.bannerText }]}>
            {formatTime(position)}
          </Text>
          <Text style={[styles.timeText, { color: theme.bannerText }]}>
            {duration > 0 ? formatTime(duration) : '--:--'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  playIcon: {
    fontSize: 16,
  },
  progressSection: {
    flex: 1,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    fontSize: 11,
    opacity: 0.8,
    fontFamily: 'Maitree-Regular',
  },
});
