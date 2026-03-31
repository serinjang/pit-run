import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import type { CircuitDefinition } from '../config/circuits';
import SvgButton from '../components/SvgButton';
import GradientCtaButton from '../components/GradientCtaButton';

type UserProfile = {
  displayName: string;
  raceNumber: string;
  nameTagAccentColor: string;
};

type QualifyingResult = {
  warmupMinutes: number;
  oneKmMs: number;
  paceSecPerKm: number;
  grade: 'A' | 'B' | 'C' | 'D';
  nextIntervalHint: string;
};

type ReadyScreenProps = {
  circuits: CircuitDefinition[];
  selectedCircuitId: string;
  onSelectCircuit: (circuitId: string) => void;
  onStart: () => void;
  profile: UserProfile;
  qualifyingResult: QualifyingResult | null;
};

const SCREEN_W = Dimensions.get('window').width;
const CARD_CONTENT_W = SCREEN_W - 24 * 2 - 14 * 2;
const OPTION_H = 48;
const START_W = SCREEN_W - 24 * 2;
const START_H = 58;

export default function ReadyScreen({
  circuits,
  selectedCircuitId,
  onSelectCircuit,
  onStart,
  profile,
  qualifyingResult,
}: ReadyScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PIT RUN</Text>
      <Text style={styles.subtitle}>러닝 기록 시작 전에 서킷을 선택하세요</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>유저</Text>
        <Text style={styles.userText}>드라이버 코드: {profile.displayName}</Text>
        <Text style={styles.userText}>선수 번호: #{profile.raceNumber}</Text>
        <View style={styles.colorRow}>
          <Text style={styles.userText}>네임태그 컬러:</Text>
          <View style={[styles.colorDot, { backgroundColor: profile.nameTagAccentColor }]} />
          <Text style={styles.userText}>{profile.nameTagAccentColor}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>QUALIFYING</Text>
        {qualifyingResult ? (
          <>
            <Text style={styles.userText}>GRADE: {qualifyingResult.grade}</Text>
            <Text style={styles.userText}>1KM: {fmtStopwatch(qualifyingResult.oneKmMs)}</Text>
            <Text style={styles.userText}>NEXT: {qualifyingResult.nextIntervalHint}</Text>
          </>
        ) : (
          <Text style={styles.userText}>첫 러닝 전 QUALIFYING을 완료해 주세요.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>서킷 선택</Text>
        <View style={styles.circuitList}>
          {circuits.map((circuit) => {
            const selected = circuit.id === selectedCircuitId;
            return (
              <Pressable
                key={circuit.id}
                onPress={() => onSelectCircuit(circuit.id)}
                style={styles.circuitOptionPress}
              >
                <SvgButton
                  width={CARD_CONTENT_W}
                  height={OPTION_H}
                  radius={10}
                  fill={selected ? '#FCB827' : 'rgba(255,255,255,0.02)'}
                  fillOpacity={selected ? 0.15 : 1}
                  stroke={selected ? '#FCB827' : 'rgba(255,255,255,0.12)'}
                  strokeWidth={1}
                  textColor={selected ? '#FFFFFF' : '#EAEAEA'}
                  fontFamily={selected ? 'Formula1-Bold' : 'Formula1-Regular'}
                  fontSize={14}
                  label={`${circuit.displayName} (${circuit.distanceKm.toFixed(2)}km)`}
                />
              </Pressable>
            );
          })}
        </View>
      </View>

      <GradientCtaButton
        width={START_W}
        height={START_H}
        label="러닝 기록 시작"
        enabled
        onPress={onStart}
        style={styles.startButtonPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17171C',
    paddingHorizontal: 24,
    justifyContent: 'center',
    gap: 18,
  },
  title: {
    fontSize: 38,
    fontFamily: 'Formula1-Black',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Formula1-Regular',
  },
  card: {
    borderRadius: 14,
    backgroundColor: '#202028',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 14,
    gap: 10,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontFamily: 'Formula1-Bold',
    fontSize: 14,
  },
  userText: {
    color: '#EAEAEA',
    fontSize: 14,
    fontFamily: 'Formula1-Regular',
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  circuitList: {
    gap: 8,
  },
  circuitOptionPress: {
    width: CARD_CONTENT_W,
    height: OPTION_H,
  },
  startButtonPress: {
    marginTop: 6,
    width: START_W,
    height: START_H,
    alignSelf: 'center',
  },
});

function fmtStopwatch(ms: number): string {
  const total = Math.floor(ms / 10);
  const cs = total % 100;
  const sec = Math.floor(total / 100) % 60;
  const min = Math.floor(total / 6000);
  return `${min}:${sec < 10 ? '0' : ''}${sec}.${cs < 10 ? '0' : ''}${cs}`;
}
