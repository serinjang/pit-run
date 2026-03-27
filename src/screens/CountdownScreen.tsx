import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { COLORS } from '../constants/colors';

const { width: SCREEN_W } = Dimensions.get('window');

// 도트 그리드: 2행 5열
// 각 카운트별 활성 도트 수 (하단 오른쪽부터)
// 5 → 1개, 4 → 2개, 3 → 3개, 2 → 4개, 1 → 5개
const DOT_COLS = 5;
const DOT_SIZE = 45;
const DOT_GAP = 17; // 62 - 45
const DOT_COLOR_INACTIVE = '#2A3140';
const DOT_COLORS = ['#FF6525', '#F85C2A', '#F05030', '#E84535', '#E03A3E'];

function getActiveDots(count: number): Set<string> {
  const active = new Set<string>();
  const numActive = 6 - count; // 5→1, 4→2, ..., 1→5
  for (let i = 0; i < numActive; i++) {
    active.add(`1-${4 - i}`); // 하단(row=1) 오른쪽부터
  }
  return active;
}

interface Props {
  onFinish: () => void;
}

export default function CountdownScreen({ onFinish }: Props) {
  const [count, setCount] = useState(5);
  const [showGo, setShowGo] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function step(current: number) {
      const next = current - 1;
      if (next < 0) {
        // Go! 표시 후 전환
        setShowGo(true);
        timerRef.current = setTimeout(onFinish, 900);
        return;
      }
      setCount(next === 0 ? 0 : next); // 0 = Go! 직전
      timerRef.current = setTimeout(() => step(next), 1000);
    }

    timerRef.current = setTimeout(() => step(5), 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const activeDots = getActiveDots(count);

  return (
    <View style={styles.container}>
      {/* 카운트 숫자 */}
      <Text style={styles.number}>
        {showGo ? 'Go!' : count}
      </Text>

      {/* 도트 그리드 */}
      {!showGo && (
        <View style={styles.dotsWrap}>
          {[0, 1].map((row) => (
            <View key={row} style={styles.dotsRow}>
              {Array.from({ length: DOT_COLS }).map((_, col) => {
                const key = `${row}-${col}`;
                const isActive = activeDots.has(key);
                const colorIdx = DOT_COLS - 1 - col;
                return (
                  <View
                    key={key}
                    style={[
                      styles.dot,
                      {
                        backgroundColor: isActive
                          ? DOT_COLORS[colorIdx]
                          : DOT_COLOR_INACTIVE,
                      },
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontFamily: 'Formula1-Black',
    fontSize: 130,
    lineHeight: 130,
    color: '#E03A3E',
    letterSpacing: 6.5,
    marginBottom: 80,
    textAlign: 'center',
  },
  dotsWrap: {
    gap: 21, // 535 - 469 - 45 = 21
  },
  dotsRow: {
    flexDirection: 'row',
    gap: DOT_GAP,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
});
