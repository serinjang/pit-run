import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useRunStore } from '../store/runStore';
import { useRunning } from '../hooks/useRunning';
import { fmtTime, fmtPace, fmtDist } from '../utils/format';
import { COLORS } from '../constants/colors';
import { CIRCUIT_KM } from '../constants/tires';
import CircuitMap from '../components/CircuitMap';
import PauseButton from '../components/PauseButton';
import StopButton from '../components/StopButton';
import PlayButton from '../components/PlayButton';
import NameTag from '../components/NameTag';
import ChinaFlag from '../components/ChinaFlag';
import CheckerFlag from '../components/CheckerFlag';

const { width: W } = Dimensions.get('window');
const SCALE = W / 402;

export default function RunningScreen({ onStop }: { onStop: () => void }) {
  const { distKm, elapsedMs, paceS, sector, prog, isPaused, pauseRun, resumeRun, stopRun, startRun } = useRunStore();
  useRunning();
  useEffect(() => { startRun(); }, []);
  const cfg = COLORS.sector[sector];
  const distText = fmtDist(distKm);
  const distFontSize = getDistFontSize(distText, W);
  const distLineHeight = Math.round(distFontSize * 1.2);

  return (
    <View style={s.container}>
      <View style={s.circuitRow}>
        <ChinaFlag />
        <Text style={s.circuitName}>Shanghai {CIRCUIT_KM}km</Text>
      </View>
      <Text
        style={[
          s.dist,
          {
            color: cfg.start,
            fontSize: distFontSize,
            lineHeight: distLineHeight,
          },
        ]}
        numberOfLines={1}
        allowFontScaling={false}
        ellipsizeMode="clip"
      >
        {distText}
      </Text>
      <View style={s.statsRow}>
        <View>
          <Text style={s.statLabel}>TIME</Text>
          <Text style={s.statValue}>{fmtTime(elapsedMs)}</Text>
        </View>
        <View>
          <Text style={s.statLabel}>PACE</Text>
          <Text style={s.statValue}>{fmtPace(paceS)}</Text>
        </View>
      </View>
      <View style={s.mapWrap}>
        <CircuitMap progress={prog} colorStart={cfg.start} colorEnd={cfg.end} />
        <View style={s.nameTagWrap}>
          <NameTag
            label="LEC"
            borderColorStart={cfg.start}
            borderColorEnd={cfg.end}
          />
        </View>
        <View style={s.checkerWrap}>
          <CheckerFlag />
        </View>
      </View>
      <View style={s.btnArea}>
        {isPaused ? (
          <>
            <TouchableOpacity onPress={() => { stopRun(); onStop(); }}>
              <StopButton color={cfg.start} />
            </TouchableOpacity>
            <TouchableOpacity onPress={resumeRun}>
              <PlayButton color={cfg.start} />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={pauseRun}>
            <PauseButton color={cfg.start} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const DIST_BASE_SIZE = 130 * SCALE;
const DIST_LETTER_SPACING = 6.5;
const DIST_SIDE_PADDING = 36 * SCALE * 2;
const DIST_MIN_SIZE = 72;

function getDistFontSize(text: string, screenWidth: number): number {
  const charCount = Math.max(text.length, 1);
  const available = Math.max(screenWidth - DIST_SIDE_PADDING, 1);
  const approxCharWidthAtBase = DIST_BASE_SIZE * 0.62;
  const estimatedWidthAtBase =
    charCount * approxCharWidthAtBase +
    (charCount - 1) * DIST_LETTER_SPACING;
  const scale = Math.min(1, available / estimatedWidthAtBase);
  return Math.max(DIST_MIN_SIZE, Math.floor(DIST_BASE_SIZE * scale));
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#17171C', paddingTop: 52 },
  circuitRow: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 36 * SCALE, marginBottom: 2 },
  circuitName: { fontFamily: 'Formula1-Regular', fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: -0.65 },
  dist: { fontFamily: 'Formula1-Black', letterSpacing: DIST_LETTER_SPACING, paddingHorizontal: 36 * SCALE, textAlign: 'center', includeFontPadding: false },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 36 * SCALE, marginTop: 8 },
  statLabel: { fontFamily: 'Formula1-Regular', fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: -0.65 },
  statValue: { fontFamily: 'Formula1-Bold', fontSize: 30, color: '#FFFFFF', includeFontPadding: false },
  mapWrap: { flex: 1, position: 'relative' },
  nameTagWrap: { position: 'absolute', top: 20, right: 20 },
  checkerWrap: { position: 'absolute', top: 52, right: 20 },
  btnArea: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24, paddingBottom: 48, paddingTop: 16 },
});
