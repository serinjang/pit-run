import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import type { CircuitDefinition } from '../config/circuits';
import SvgButton from '../components/SvgButton';

type UserProfile = {
  displayName: string;
  nameTagAccentColor: string;
};

type ReadyScreenProps = {
  circuits: CircuitDefinition[];
  selectedCircuitId: string;
  onSelectCircuit: (circuitId: string) => void;
  onStart: () => void;
  profile: UserProfile;
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
}: ReadyScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PIT RUN</Text>
      <Text style={styles.subtitle}>러닝 기록 시작 전에 서킷을 선택하세요</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>유저</Text>
        <Text style={styles.userText}>드라이버 코드: {profile.displayName}</Text>
        <View style={styles.colorRow}>
          <Text style={styles.userText}>네임태그 컬러:</Text>
          <View style={[styles.colorDot, { backgroundColor: profile.nameTagAccentColor }]} />
          <Text style={styles.userText}>{profile.nameTagAccentColor}</Text>
        </View>
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

      <Pressable onPress={onStart} style={styles.startButtonPress}>
        <SvgButton
          width={START_W}
          height={START_H}
          radius={14}
          fill="#E03A3E"
          stroke="#E03A3E"
          strokeWidth={1}
          textColor="#FFFFFF"
          fontFamily="Formula1-Bold"
          fontSize={17}
          label="러닝 기록 시작"
        />
      </Pressable>
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
