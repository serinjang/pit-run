import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CircuitDefinition } from '../config/circuits';

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
                style={[styles.circuitOption, selected && styles.circuitOptionSelected]}
              >
                <Text style={[styles.circuitText, selected && styles.circuitTextSelected]}>
                  {circuit.displayName} ({circuit.distanceKm.toFixed(2)}km)
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Pressable onPress={onStart} style={styles.startButton}>
        <Text style={styles.startButtonText}>러닝 기록 시작</Text>
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
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    marginBottom: 10,
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
    fontWeight: '700',
    fontSize: 14,
  },
  userText: {
    color: '#EAEAEA',
    fontSize: 14,
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
  circuitOption: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.02)',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  circuitOptionSelected: {
    borderColor: '#FCB827',
    backgroundColor: 'rgba(252,184,39,0.15)',
  },
  circuitText: {
    color: '#EAEAEA',
    fontSize: 14,
  },
  circuitTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  startButton: {
    height: 58,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E03A3E',
    marginTop: 6,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
