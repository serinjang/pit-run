import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width: W } = Dimensions.get('window');
const SCALE = W / 402; // Figma 기준 402px

// Figma 도트 스펙
const DOT_SIZE = 45;
const DOT_GAP = 17;      // 116-54-45 = 17
const DOT_ROW_GAP = 21;  // 535-469-45 = 21

const DOT_INACTIVE = '#2A3140';
const DOT_ACTIVE = ['#FF6525', '#F85C2A', '#F04A2A', '#E84535', '#E03A3E'];

function getActiveDots(count: number): Set<string> {
  const active = new Set<string>();
  const num = 6 - count;
  for (let i = 0; i < num; i++) {
    active.add(`1-${4 - i}`);
  }
  return active;
}

export default function CountdownScreen({ onFinish }: { onFinish: () => void }) {
  const [count, setCount] = useState(5);
  const [isGo, setIsGo] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function step(n: number) {
      const next = n - 1;
      if (next < 0) {
        setIsGo(true);
        timer.current = setTimeout(onFinish, 900);
        return;
      }
      setCount(next);
      timer.current = setTimeout(() => step(next), 1000);
    }
    timer.current = setTimeout(() => step(5), 1000);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);

  const activeDots = getActiveDots(count);

  return (
    <View style={s.container}>
      <Text style={s.number}>{isGo ? 'Go!' : count}</Text>
      {!isGo && (
        <View style={s.dotsWrap}>
          {[0, 1].map((row) => (
            <View key={row} style={s.dotsRow}>
              {[0, 1, 2, 3, 4].map((col) => {
                const isActive = activeDots.has(`${row}-${col}`);
                return (
                  <View
                    key={col}
                    style={[
                      s.dot,
                      { backgroundColor: isActive ? DOT_ACTIVE[4 - col] : DOT_INACTIVE },
                    ]}
                  />
                );
              })}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191F28',
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontFamily: 'Formula1-Black',
    fontSize: 130 * SCALE,
    color: '#E03A3E',
    letterSpacing: 6.5,
    textAlign: 'center',
    marginBottom: 80 * SCALE,
    includeFontPadding: false,
  },
  dotsWrap: {
    gap: DOT_ROW_GAP * SCALE,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: DOT_GAP * SCALE,
  },
  dot: {
    width: DOT_SIZE * SCALE,
    height: DOT_SIZE * SCALE,
    borderRadius: (DOT_SIZE * SCALE) / 2,
  },
});
