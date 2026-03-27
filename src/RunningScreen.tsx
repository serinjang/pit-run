import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useRunStore } from '../store/runStore';
import { useRunning } from '../hooks/useRunning';
import { fmtTime, fmtPace, fmtDist } from '../utils/format';
import { COLORS } from '../constants/colors';
import { CIRCUIT_KM } from '../constants/tires';
import CircuitMap from '../components/CircuitMap';

const { width: W } = Dimensions.get('window');
const SCALE = W / 402;

export default function RunningScreen({ onStop }: { onStop: () => void }) {
  const {
    distKm, elapsedMs, paceS, sector, prog,
    isPaused, pauseRun, resumeRun, stopRun, startRun,
  } = useRunStore();

  useRunning();

  useEffect(() => {
    startRun();
  }, []);

  const cfg = COLORS.sector[sector];

  return (
    <View style={s.container}>

      {/* 국기 + 서킷명 */}
      <View style={s.circuitRow}>
        <View style={s.flagBox} />
        <Text style={s.circuitName}>Shanghai {CIRCUIT_KM}km</Text>
      </View>

      {/* 거리 (메인 숫자) */}
      <Text style={[s.dist, { color: cfg.start }]}>
        {fmtDist(distKm)}
      </Text>

      {/* TIME / PACE */}
      <View style={s.statsRow}>
        <View style={s.statBlock}>
          <Text style={s.statLabel}>TIME</Text>
          <Text style={s.statValue}>{fmtTime(elapsedMs)}</Text>
        </View>
        <View style={s.statBlock}>
          <Text style={s.statLabel}>PACE</Text>
          <Text style={s.statValue}>{fmtPace(paceS)}</Text>
        </View>
      </View>

      {/* 서킷 맵 */}
      <CircuitMap
        progress={prog}
        colorStart={cfg.start}
        colorEnd={cfg.end}
        glowColor={cfg.glow}
      />

      {/* 버튼 영역 */}
      <View style={s.btnArea}>
        {isPaused ? (
          <>
            {/* STOP → 결과 화면 */}
            <TouchableOpacity
              style={[s.btn, { backgroundColor: `${cfg.start}22` }]}
              onPress={() => { stopRun(); onStop(); }}
            >
              <View style={[s.stopIcon, { backgroundColor: cfg.start }]} />
            </TouchableOpacity>
            {/* PLAY → 재개 */}
            <TouchableOpacity
              style={[s.btn, { backgroundColor: `${cfg.start}22` }]}
              onPress={resumeRun}
            >
              <View style={[s.playTriangle, { borderLeftColor: cfg.start }]} />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[s.btn, { backgroundColor: `${cfg.start}22` }]}
            onPress={pauseRun}
          >
            <View style={s.pauseRow}>
              <View style={[s.pauseBar, { backgroundColor: cfg.start }]} />
              <View style={[s.pauseBar, { backgroundColor: cfg.start }]} />
            </View>
          </TouchableOpacity>
        )}
      </View>

    </View>
  );
}

const BTN = 76 * SCALE;

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191F28',
    paddingTop: 52,
  },
  circuitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 36 * SCALE,
    marginBottom: 2,
  },
  flagBox: {
    width: 17,
    height: 11,
    backgroundColor: '#E03A3E',
    borderRadius: 2,
  },
  circuitName: {
    fontFamily: 'Formula1-Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: -0.65,
  },
  dist: {
    fontFamily: 'Formula1-Black',
    fontSize: 130 * SCALE,
    lineHeight: 156 * SCALE,
    letterSpacing: 6.5,
    paddingHorizontal: 36 * SCALE,
    includeFontPadding: false,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 36 * SCALE,
    marginTop: 8,
  },
  statBlock: {
    gap: 4,
  },
  statLabel: {
    fontFamily: 'Formula1-Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: -0.65,
  },
  statValue: {
    fontFamily: 'Formula1-Bold',
    fontSize: 30,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  btnArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingBottom: 48,
    paddingTop: 16,
  },
  btn: {
    width: BTN,
    height: BTN,
    borderRadius: BTN / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pauseBar: {
    width: 6,
    height: 18,
    borderRadius: 2,
  },
  stopIcon: {
    width: 18,
    height: 18,
    borderRadius: 2,
  },
  playTriangle: {
    width: 0,
    height: 0,
    borderTopWidth: 11,
    borderBottomWidth: 11,
    borderLeftWidth: 18,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 4,
  },
});
