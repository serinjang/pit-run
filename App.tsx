import React, { useState, useCallback } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import { useRunStore } from './src/store/runStore';
import CountdownScreen from './src/screens/CountdownScreen';
import RunningScreen from './src/screens/RunningScreen';

type Screen = 'countdown' | 'running' | 'result';

export default function App() {
  const [screen, setScreen] = useState<Screen>('countdown');
  const { resetRun } = useRunStore();
  const [fontsLoaded] = useFonts({
    'Formula1-Black':   require('./assets/fonts/Formula1-Black.ttf'),
    'Formula1-Bold':    require('./assets/fonts/Formula1-Bold_web_0.ttf'),
    'Formula1-Regular': require('./assets/fonts/Formula1-Regular_web_0.ttf'),
    'Formula1-Italic':  require('./assets/fonts/Formula1_Display-Italic_Italic.ttf'),
  });
  const goRunning = useCallback(() => setScreen('running'), []);
  const goResult  = useCallback(() => setScreen('result'), []);
  const goNew     = useCallback(() => { resetRun(); setScreen('countdown'); }, [resetRun]);

  if (!fontsLoaded) return <View style={s.bg} />;

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#17171C" />
      {screen === 'countdown' && <CountdownScreen onFinish={goRunning} />}
      {screen === 'running'   && <RunningScreen   onStop={goResult}  />}
      {screen === 'result'    && <View style={s.bg} />}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#17171C' },
  bg:   { flex: 1, backgroundColor: '#17171C' },
});
