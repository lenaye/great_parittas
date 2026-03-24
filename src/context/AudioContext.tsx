import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';
import { useSettings, ChanterMode } from './SettingsContext';

// Dynamically import expo-av to handle missing native module gracefully
let Audio: any = null;
let audioAvailable = false;
try {
  const expoAv = require('expo-av');
  Audio = expoAv.Audio;
  audioAvailable = true;
} catch (e) {
  console.warn('expo-av not available:', e);
}

// Map paritta IDs to audio files per chanter
const audioFilesByChanter: Record<ChanterMode, Record<number, any>> = {
  usilananda: {
    1: require('../../assets/audio/usilananda/01_mangala_sutta.mp3'),
    2: require('../../assets/audio/usilananda/02_ratana_sutta.mp3'),
    3: require('../../assets/audio/usilananda/03_metta_sutta.mp3'),
    4: require('../../assets/audio/usilananda/04_khandha_sutta.mp3'),
    5: require('../../assets/audio/usilananda/05_mora_sutta.mp3'),
    6: require('../../assets/audio/usilananda/06_vatta_sutta.mp3'),
    7: require('../../assets/audio/usilananda/07_dhajagga_sutta.mp3'),
    8: require('../../assets/audio/usilananda/08_atanatiya_sutta.mp3'),
    9: require('../../assets/audio/usilananda/09_angulimala_sutta.mp3'),
    10: require('../../assets/audio/usilananda/10_bojjhanga_sutta.mp3'),
    11: require('../../assets/audio/usilananda/11_pubbanha_sutta.mp3'),
  },
  uvicitta: {
    1: require('../../assets/audio/uvicitta/01_mingala_sutta.mp3'),
    2: require('../../assets/audio/uvicitta/02_ratana_sutta.mp3'),
    3: require('../../assets/audio/uvicitta/03_metta_sutta.mp3'),
    4: require('../../assets/audio/uvicitta/04_khandha_sutta.mp3'),
    5: require('../../assets/audio/uvicitta/05_mora_sutta.mp3'),
    6: require('../../assets/audio/uvicitta/06_vatta_sutta.mp3'),
    7: require('../../assets/audio/uvicitta/07_dhajagga_sutta.mp3'),
    8: require('../../assets/audio/uvicitta/08_atanatiya_sutta.mp3'),
    9: require('../../assets/audio/uvicitta/09_angulimala_sutta.mp3'),
    10: require('../../assets/audio/uvicitta/10_bojjhanga_sutta.mp3'),
    11: require('../../assets/audio/uvicitta/11_pubbanha_sutta.mp3'),
  },
};

interface AudioState {
  parittaId: number | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  progress: number;
}

interface AudioContextType {
  audioAvailable: boolean;
  state: AudioState;
  hasAudio: (parittaId: number) => boolean;
  togglePlayback: (parittaId: number) => Promise<void>;
}

const defaultState: AudioState = {
  parittaId: null,
  isPlaying: false,
  position: 0,
  duration: 0,
  progress: 0,
};

const AudioContext = createContext<AudioContextType>({
  audioAvailable: false,
  state: defaultState,
  hasAudio: () => false,
  togglePlayback: async () => {},
});

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [state, setState] = useState<AudioState>(defaultState);
  const soundRef = useRef<any>(null);
  const currentParittaRef = useRef<number | null>(null);
  const currentChanterRef = useRef<ChanterMode>(settings.chanter);

  const onPlaybackStatusUpdate = useCallback((status: any) => {
    if (!status.isLoaded) return;

    const pos = status.positionMillis || 0;
    const dur = status.durationMillis || 0;
    const prog = dur > 0 ? pos / dur : 0;

    setState((prev) => ({
      ...prev,
      position: pos,
      duration: dur,
      progress: prog,
      isPlaying: status.isBuffering ? prev.isPlaying : status.isPlaying,
    }));

    if (status.didJustFinish) {
      setState((prev) => ({
        ...prev,
        isPlaying: false,
        progress: 0,
        position: 0,
      }));
    }
  }, []);

  const unloadCurrentSound = useCallback(async () => {
    if (soundRef.current) {
      try {
        soundRef.current.setOnPlaybackStatusUpdate(null);
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (e) {
        // Sound may already be unloaded
      }
      soundRef.current = null;
    }
  }, []);

  // Stop and reset audio when chanter changes
  useEffect(() => {
    if (currentChanterRef.current !== settings.chanter) {
      unloadCurrentSound();
      currentParittaRef.current = null;
      currentChanterRef.current = settings.chanter;
      setState(defaultState);
    }
  }, [settings.chanter, unloadCurrentSound]);

  const togglePlayback = useCallback(
    async (parittaId: number) => {
      const audioFiles = audioFilesByChanter[settings.chanter] || {};
      if (!audioAvailable || !audioFiles[parittaId]) return;

      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        });

        // Case 1: Same paritta + same chanter, currently playing → pause
        if (
          currentParittaRef.current === parittaId &&
          currentChanterRef.current === settings.chanter &&
          soundRef.current
        ) {
          const status = await soundRef.current.getStatusAsync();
          if (status.isLoaded && status.isPlaying) {
            await soundRef.current.pauseAsync();
            setState((prev) => ({ ...prev, isPlaying: false }));
            return;
          }
          // Case 2: Same paritta + same chanter, paused → resume
          if (status.isLoaded && !status.isPlaying) {
            await soundRef.current.playAsync();
            setState((prev) => ({ ...prev, isPlaying: true }));
            return;
          }
        }

        // Case 3: Different paritta or different chanter → stop old, load new
        await unloadCurrentSound();

        const { sound: newSound } = await Audio.Sound.createAsync(
          audioFiles[parittaId],
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );
        soundRef.current = newSound;
        currentParittaRef.current = parittaId;
        currentChanterRef.current = settings.chanter;
        setState({
          parittaId,
          isPlaying: true,
          position: 0,
          duration: 0,
          progress: 0,
        });
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    },
    [onPlaybackStatusUpdate, unloadCurrentSound, settings.chanter]
  );

  const hasAudio = useCallback(
    (parittaId: number) => {
      const audioFiles = audioFilesByChanter[settings.chanter] || {};
      return !!audioFiles[parittaId];
    },
    [settings.chanter]
  );

  return (
    <AudioContext.Provider value={{ audioAvailable, state, hasAudio, togglePlayback }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}
