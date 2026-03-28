import React, { useCallback, useMemo, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CountdownScreen from './src/screens/CountdownScreen';
import ReadyScreen from './src/screens/ReadyScreen';
import RunningScreen from './src/screens/RunningScreen';
import { CIRCUITS, DEFAULT_CIRCUIT_ID } from './src/config/circuits';

type Screen = 'ready' | 'countdown' | 'running';

type PaceRecords = {
  bestEverSecPerKm: number;
  todayBestSecPerKm: number;
};

type UserProfile = {
  displayName: string;
  nameTagAccentColor: string;
};

export default function App() {
  const [fontsLoaded] = useFonts({
    'Formula1-Black': require('./assets/fonts/Formula1-Black.ttf'),
    'Formula1-Bold': require('./assets/fonts/Formula1-Bold_web_0.ttf'),
    'Formula1-Regular': require('./assets/fonts/Formula1-Regular_web_0.ttf'),
    'Formula1-Italic': require('./assets/fonts/Formula1_Display-Italic_Italic.ttf'),
  });

  const [screen, setScreen] = useState<Screen>('ready');
  const [selectedCircuitId, setSelectedCircuitId] = useState(DEFAULT_CIRCUIT_ID);
  const [records, setRecords] = useState<PaceRecords>({
    bestEverSecPerKm: Number.POSITIVE_INFINITY,
    todayBestSecPerKm: Number.POSITIVE_INFINITY,
  });
  const [profile] = useState<UserProfile>({
    displayName: 'LEC',
    nameTagAccentColor: '#E03A3E',
  });

  const selectedCircuit =
    useMemo(
      () => CIRCUITS.find((item) => item.id === selectedCircuitId) ?? CIRCUITS[0],
      [selectedCircuitId],
    );

  const startRun = useCallback(() => setScreen('countdown'), []);
  const startMeasuring = useCallback(() => setScreen('running'), []);
  const stopRun = useCallback(() => setScreen('ready'), []);

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
        {screen === 'ready' && (
          <ReadyScreen
            circuits={CIRCUITS}
            selectedCircuitId={selectedCircuit.id}
            onSelectCircuit={setSelectedCircuitId}
            onStart={startRun}
            profile={profile}
          />
        )}
        {screen === 'countdown' && <CountdownScreen onFinish={startMeasuring} />}
        {screen === 'running' && (
          <RunningScreen
            circuit={selectedCircuit}
            profile={profile}
            records={records}
            onStop={stopRun}
            onPaceSample={handlePaceSample}
          />
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
});
