import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeTop } from '../hooks/useSafeTop';
import { useSafeBottom } from '../hooks/useSafeBottom';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import GradientCtaButton from '../components/GradientCtaButton';
import TextChevronButton from '../components/TextChevronButton';
import TireIcon from '../components/TireIcon';
import { CIRCUITS } from '../config/circuits';
import { useAppStore } from '../store/appStore';
import type { HomeScreenProps } from '../navigation/types';

const CTA_CONTAINER_H = 164;

function fmtMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}'${String(sec).padStart(2, '0')}"`;
}

const GRADE_COLORS: Record<string, string> = {
  A: '#E03A3E',
  B: '#FCB827',
  C: '#4CB5C9',
  D: '#FFFFFF',
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { width: windowW } = useWindowDimensions();
  const safeTop = useSafeTop();
  const safeBottom = useSafeBottom();
  const { profile, selectedCircuitId, selectedTire, qualifyingResult } = useAppStore();

  const circuit = CIRCUITS.find((c) => c.id === selectedCircuitId) ?? CIRCUITS[0];
  const ctaWidth = windowW - 56;

  return (
    <View style={styles.root}>
      {/* Status bar blocker — height matches SafeAreaOverlay's statusH */}
      <View style={{ height: safeTop, backgroundColor: '#17171C' }} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: CTA_CONTAINER_H }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>PIT RUN</Text>
          <View style={styles.profileRow}>
            <View style={styles.profileNumWrap}>
              <Text style={[styles.profileNum, { color: profile.nameTagAccentColor }]}>
                {profile.raceNumber}
              </Text>
            </View>
            <Text style={styles.profileName}>{profile.displayName}</Text>
          </View>
        </View>

        {/* Qualifying card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardLabel}>QUALIFYING</Text>
            {qualifyingResult && (
              <View style={[styles.gradeBadge, { backgroundColor: GRADE_COLORS[qualifyingResult.grade] }]}>
                <Text style={styles.gradeText}>{qualifyingResult.grade}</Text>
              </View>
            )}
          </View>
          {qualifyingResult ? (
            <View style={styles.qualResultRow}>
              <Text style={styles.qualTime}>{fmtMs(qualifyingResult.oneKmMs)}</Text>
              <Text style={styles.qualSub}>/ 1km</Text>
            </View>
          ) : (
            <Text style={styles.emptyState}>퀄리파잉을 완료하면{'\n'}1km 기록이 여기에 표시됩니다.</Text>
          )}
        </View>

        {/* Race setup card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>RACE SETUP</Text>
          <View style={styles.raceSetupRow}>
            <View style={styles.circuitInfo}>
              <Text style={styles.circuitName}>{circuit.displayName.toUpperCase()}</Text>
              <Text style={styles.circuitDist}>{circuit.distanceKm} km</Text>
            </View>
            <TireIcon type={selectedTire} />
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA — rendered after scroll so it's on top */}
      <View style={[styles.ctaContainer, { height: CTA_CONTAINER_H }]} pointerEvents="box-none">
        <Svg
          width={windowW}
          height={CTA_CONTAINER_H}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        >
          <Defs>
            <LinearGradient id="homeFade" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#17171C" stopOpacity="0" />
              <Stop offset="35%" stopColor="#17171C" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path d={`M0 0 H${windowW} V${CTA_CONTAINER_H} H0 Z`} fill="url(#homeFade)" />
        </Svg>
        <View style={styles.ctaBtnWrap} pointerEvents="box-none">
          <TextChevronButton
            label="Qualifying"
            onPress={() => navigation.navigate('Qualifying')}
            style={styles.qualifyingBtn}
          />
          <GradientCtaButton
            width={ctaWidth}
            label="Race Start"
            enabled
            onPress={() => navigation.navigate('Setup')}
          />
        </View>
      </View>
      {/* Safe-area blockers: inside the native screen view → reliably cover scroll content */}
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: safeTop, backgroundColor: '#17171C', zIndex: 1000 }} />
      <View pointerEvents="none" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: safeBottom, backgroundColor: '#17171C', zIndex: 1000 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#17171C',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 28,
  },
  header: {
    marginBottom: 32,
  },
  appTitle: {
    fontFamily: 'Formula1-Black',
    fontSize: 36,
    color: '#FFFFFF',
    letterSpacing: 2,
    includeFontPadding: false,
    marginBottom: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileNumWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileNum: {
    fontFamily: 'Formula1-Black',
    fontSize: 16,
    includeFontPadding: false,
  },
  profileName: {
    fontFamily: 'Formula1-Bold',
    fontSize: 20,
    color: '#FFFFFF',
    includeFontPadding: false,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#1E1E25',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardLabel: {
    fontFamily: 'Formula1-Bold',
    fontSize: 11,
    color: '#FFFFFF66',
    letterSpacing: 1,
    includeFontPadding: false,
  },
  gradeBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeText: {
    fontFamily: 'Formula1-Black',
    fontSize: 14,
    color: '#17171C',
    includeFontPadding: false,
  },
  qualResultRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  qualTime: {
    fontFamily: 'Formula1-Black',
    fontSize: 40,
    color: '#FFFFFF',
    includeFontPadding: false,
    letterSpacing: 2,
  },
  qualSub: {
    fontFamily: 'Formula1-Regular',
    fontSize: 16,
    color: '#FFFFFF66',
    includeFontPadding: false,
  },
  emptyState: {
    fontFamily: 'Formula1-Regular',
    fontSize: 13,
    color: '#FFFFFF44',
    lineHeight: 20,
    includeFontPadding: false,
  },
  raceSetupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circuitInfo: {
    gap: 4,
  },
  circuitName: {
    fontFamily: 'Formula1-Black',
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: 1,
    includeFontPadding: false,
  },
  circuitDist: {
    fontFamily: 'Formula1-Regular',
    fontSize: 13,
    color: '#FFFFFF66',
    includeFontPadding: false,
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  ctaBtnWrap: {
    position: 'absolute',
    bottom: 40,
    left: 28,
    right: 28,
    alignItems: 'center',
    gap: 16,
  },
  qualifyingBtn: {
    alignSelf: 'center',
  },
});
