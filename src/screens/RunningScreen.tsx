import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import CircuitMap from '../components/CircuitMap';
import CheckerFlag from '../components/CheckerFlag';
import NameTag from '../components/NameTag';
import RunningButton from '../components/RunningButton';
import type { CircuitDefinition } from '../config/circuits';

const THEMES = {
  yellow: { start: '#FCB827', end: '#FC8A27' },
  purple: { start: '#8528C5', end: '#B328C5' },
  green: { start: '#59B345', end: '#28C584' },
} as const;

type ThemeMode = keyof typeof THEMES;

type PaceRecords = {
  bestEverSecPerKm: number;
  todayBestSecPerKm: number;
};

type UserProfile = {
  displayName: string;
  nameTagAccentColor: string;
};

type RunningScreenProps = {
  circuit: CircuitDefinition;
  profile: UserProfile;
  records: PaceRecords;
  onPaceSample: (paceSecPerKm: number) => void;
  onStop: () => void;
};

type RunMetrics = {
  elapsedSec: number;
  distanceKm: number;
  paceSecPerKm: number;
};

const FIGMA_WIDTH = 402;
const FIGMA_HEIGHT = 874;

const formatDistance = (distanceKm: number) => distanceKm.toFixed(2);
const formatTime = (elapsedSec: number) => {
  const mm = Math.floor(elapsedSec / 60);
  const ss = elapsedSec % 60;
  return `${mm}'${ss < 10 ? '0' : ''}${ss}"`;
};
const formatPace = (paceSecPerKm: number) => {
  const mm = Math.floor(paceSecPerKm / 60);
  const ss = Math.floor(paceSecPerKm % 60);
  return `${mm}'${ss < 10 ? '0' : ''}${ss}"`;
};

function getThemeMode(currentPace: number, records: PaceRecords): ThemeMode {
  if (currentPace <= records.bestEverSecPerKm) return 'purple';
  if (currentPace <= records.todayBestSecPerKm) return 'green';
  return 'yellow';
}

function createInitialMetrics(): RunMetrics {
  return {
    elapsedSec: 0,
    distanceKm: 0,
    paceSecPerKm: 301,
  };
}

export default function RunningScreen({
  circuit,
  profile,
  records,
  onPaceSample,
  onStop,
}: RunningScreenProps) {
  const [paused, setPaused] = useState(false);
  const [metrics, setMetrics] = useState<RunMetrics>(createInitialMetrics);
  const tickRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { width, height } = Dimensions.get('window');
  const sx = width / FIGMA_WIDTH;
  const sy = height / FIGMA_HEIGHT;
  const scaleX = (v: number) => v * sx;
  const scaleY = (v: number) => v * sy;

  const themeMode = useMemo(
    () => getThemeMode(metrics.paceSecPerKm, records),
    [metrics.paceSecPerKm, records],
  );
  const theme = THEMES[themeMode];

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      tickRef.current += 1;
      const t = tickRef.current;

      setMetrics((prev) => {
        const wave = Math.sin(t / 11) * 9;
        const noise = (Math.random() - 0.5) * 5;
        const nextPace = Math.max(250, Math.min(380, prev.paceSecPerKm + wave * 0.2 + noise));
        const nextDistance = prev.distanceKm + 1 / nextPace;
        const nextElapsed = prev.elapsedSec + 1;

        onPaceSample(nextPace);
        return {
          elapsedSec: nextElapsed,
          distanceKm: nextDistance,
          paceSecPerKm: nextPace,
        };
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [onPaceSample, paused]);

  const FlagComponent = circuit.flagComponent;
  const progress = (metrics.distanceKm % circuit.distanceKm) / circuit.distanceKm;

  return (
    <View style={styles.container}>
      <View style={[styles.flagWrap, { left: scaleX(39), top: scaleY(177) }]}>
        <FlagComponent />
      </View>

      <Text style={[styles.circuitText, { left: scaleX(61), top: scaleY(174) }]}>
        {circuit.displayName} {circuit.distanceKm.toFixed(2)}km
      </Text>

      <Text style={[styles.distanceText, { left: scaleX(36), top: scaleY(174), color: theme.start }]}>
        {formatDistance(metrics.distanceKm)}
      </Text>

      <Text style={[styles.labelText, { left: scaleX(41), top: scaleY(352) }]}>TIME</Text>
      <Text style={[styles.valueText, { left: scaleX(41), top: scaleY(377) }]}>
        {formatTime(metrics.elapsedSec)}
      </Text>

      <Text style={[styles.labelText, { left: scaleX(274), top: scaleY(352) }]}>PACE</Text>
      <Text style={[styles.valueText, { left: scaleX(274), top: scaleY(377) }]}>
        {formatPace(metrics.paceSecPerKm)}
      </Text>

      <View
        style={{
          position: 'absolute',
          left: width * 0.1318,
          top: height * 0.5515,
          width: width * 0.6971,
          height: height * 0.206,
        }}
      >
        <CircuitMap
          trackPath={circuit.trackPath}
          progress={progress}
          startColor={theme.start}
          endColor={theme.end}
        />
      </View>

      <View
        style={[
          styles.startMarker,
          {
            left: width * (0.1318 + circuit.startMarker.xRatio * 0.6971),
            top: height * (0.5515 + circuit.startMarker.yRatio * 0.206),
            transform: [{ rotate: `${circuit.startMarker.angleDeg}deg` }],
          },
        ]}
      />

      <View
        style={{
          position: 'absolute',
          left: width * (0.1318 + circuit.checkerFlag.xRatio * 0.6971),
          top: height * (0.5515 + circuit.checkerFlag.yRatio * 0.206),
          transform: [{ rotate: `${circuit.checkerFlag.angleDeg}deg` }],
        }}
      >
        <CheckerFlag />
      </View>

      <View style={{ position: 'absolute', left: scaleX(215), top: scaleY(577) }}>
        <NameTag
          label={profile.displayName}
          borderStartColor={theme.start}
          borderEndColor={theme.end}
          accentColor={profile.nameTagAccentColor}
        />
      </View>

      <View style={{ position: 'absolute', top: scaleY(753), left: 0, right: 0 }}>
        <View style={styles.controlRow}>
          {paused ? (
            <>
              <Pressable onPress={onStop}>
                <RunningButton type="stop" color={theme.start} bgColor={theme.start} size={scaleX(76)} />
              </Pressable>
              <Pressable onPress={() => setPaused(false)}>
                <RunningButton type="play" color={theme.start} bgColor={theme.start} size={scaleX(76)} />
              </Pressable>
            </>
          ) : (
            <Pressable onPress={() => setPaused(true)}>
              <RunningButton type="pause" color={theme.start} bgColor={theme.start} size={scaleX(76)} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17171C',
  },
  flagWrap: {
    position: 'absolute',
  },
  circuitText: {
    position: 'absolute',
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    letterSpacing: -0.4,
  },
  distanceText: {
    position: 'absolute',
    fontSize: 130,
    fontWeight: '900',
    letterSpacing: 5,
    lineHeight: 156,
  },
  labelText: {
    position: 'absolute',
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  valueText: {
    position: 'absolute',
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '700',
  },
  startMarker: {
    position: 'absolute',
    width: 14,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E03A3E',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
});
