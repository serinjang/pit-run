import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, StatusBar, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CountdownScreen from './src/screens/CountdownScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import QualifyingScreen, { type QualifyingResult } from './src/screens/QualifyingScreen';
import ReadyScreen from './src/screens/ReadyScreen';
import RunningScreen from './src/screens/RunningScreen';
import { CIRCUITS, DEFAULT_CIRCUIT_ID } from './src/config/circuits';

type Screen = 'profile' | 'qualifying' | 'ready' | 'countdown' | 'running';

type PaceRecords = {
  bestEverSecPerKm: number;
  todayBestSecPerKm: number;
};

type UserProfile = {
  displayName: string;
  raceNumber: string;
  nameTagAccentColor: string;
};

export default function App() {
  const [fontsLoaded] = useFonts({
    'Formula1-Black': require('./assets/fonts/Formula1-Black.ttf'),
    'Formula1-Bold': require('./assets/fonts/Formula1-Bold_web_0.ttf'),
    'Formula1-Regular': require('./assets/fonts/Formula1-Regular_web_0.ttf'),
    'Formula1-Italic': require('./assets/fonts/Formula1_Display-Italic_Italic.ttf'),
  });

  const [screen, setScreen] = useState<Screen>('profile');
  const [selectedCircuitId, setSelectedCircuitId] = useState(DEFAULT_CIRCUIT_ID);
  const [records, setRecords] = useState<PaceRecords>({
    bestEverSecPerKm: Number.POSITIVE_INFINITY,
    todayBestSecPerKm: Number.POSITIVE_INFINITY,
  });
  const [profile, setProfile] = useState<UserProfile>({
    displayName: 'LEC',
    raceNumber: '16',
    nameTagAccentColor: '#E03A3E',
  });
  const [qualifyingResult, setQualifyingResult] = useState<QualifyingResult | null>(null);
  const countdownToRunningProgress = useRef(new Animated.Value(0)).current;
  const [isCountdownRunningTransition, setIsCountdownRunningTransition] = useState(false);
  const runningTransitionLock = useRef(false);

  const selectedCircuit =
    useMemo(
      () => CIRCUITS.find((item) => item.id === selectedCircuitId) ?? CIRCUITS[0],
      [selectedCircuitId],
    );

  const startRun = useCallback(() => setScreen('countdown'), []);
  const startMeasuring = useCallback(() => {
    if (runningTransitionLock.current) return;
    runningTransitionLock.current = true;
    setIsCountdownRunningTransition(true);
    setScreen('running');
    countdownToRunningProgress.setValue(0);
    Animated.timing(countdownToRunningProgress, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start(() => {
      setIsCountdownRunningTransition(false);
      runningTransitionLock.current = false;
    });
  }, [countdownToRunningProgress]);
  const stopRun = useCallback(() => setScreen('ready'), []);

  const countdownOpacity = countdownToRunningProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const handlePaceSample = useCallback((paceSecPerKm: number) => {
    setRecords((prev) => ({
      bestEverSecPerKm: Math.min(prev.bestEverSecPerKm, paceSecPerKm),
      todayBestSecPerKm: Math.min(prev.todayBestSecPerKm, paceSecPerKm),
    }));
  }, []);

  if (!fontsLoaded) return <View style={styles.root} />;

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor="#17171C" />
        {screen === 'profile' && (
          <ProfileSetupScreen
            initialProfile={profile}
            onComplete={(nextProfile) => {
              setProfile(nextProfile);
              setScreen('qualifying');
            }}
          />
        )}
        {screen === 'qualifying' && (
          <QualifyingScreen
            profile={profile}
            onComplete={(result) => {
              setQualifyingResult(result);
              setScreen('ready');
            }}
          />
        )}
        {screen === 'ready' && (
          <ReadyScreen
            circuits={CIRCUITS}
            selectedCircuitId={selectedCircuit.id}
            onSelectCircuit={setSelectedCircuitId}
            onStart={startRun}
            profile={profile}
            qualifyingResult={qualifyingResult}
          />
        )}
        {(screen === 'countdown' || isCountdownRunningTransition) && (
          <Animated.View
            style={isCountdownRunningTransition ? [styles.transitionLayer, { opacity: countdownOpacity }] : styles.root}
          >
            <CountdownScreen onFinish={startMeasuring} />
          </Animated.View>
        )}
        {screen === 'running' && (
          <Animated.View
            style={
              isCountdownRunningTransition
                ? [styles.transitionLayer, { opacity: countdownToRunningProgress }]
                : styles.root
            }
          >
            <RunningScreen
              circuit={selectedCircuit}
              profile={profile}
              records={records}
              onStop={stopRun}
              onPaceSample={handlePaceSample}
            />
          </Animated.View>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#17171C',
  },
  transitionLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#17171C',
  },
});
