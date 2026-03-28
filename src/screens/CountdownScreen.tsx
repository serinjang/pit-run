import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useDistanceDisplayFont } from '../hooks/useDistanceDisplayFont';

const { width: screenWidth } = Dimensions.get('window');
const scale = screenWidth / 402;

const DOT_SIZE = 45;
const DOT_GAP = 17;
const DOT_ROW_GAP = 21;
const DOT_INACTIVE = '#333D48';
const DOT_ACTIVE = ['#FF6525', '#F85C2A', '#F04A2A', '#E84535', '#E03A3E'];

function getActiveDotMap(count: number): Set<string> {
  const active = new Set<string>();
  const litCount = Math.max(0, 6 - count);
  for (let i = 0; i < litCount; i += 1) {
    active.add(`1-${4 - i}`);
  }
  return active;
}

type CountdownScreenProps = {
  onFinish: () => void;
};

export default function CountdownScreen({ onFinish }: CountdownScreenProps) {
  const [count, setCount] = useState(5);
  const [showGo, setShowGo] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { fontSize, lineHeight, sampleText, onSampleLayout } = useDistanceDisplayFont(screenWidth);

  useEffect(() => {
    const tick = (n: number) => {
      if (n <= 1) {
        setCount(1);
        setShowGo(true);
        timeoutRef.current = setTimeout(onFinish, 800);
        return;
      }

      setCount(n - 1);
      timeoutRef.current = setTimeout(() => tick(n - 1), 1000);
    };

    timeoutRef.current = setTimeout(() => tick(5), 1000);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onFinish]);

  const activeDots = getActiveDotMap(count);

  return (
    <View style={styles.container}>
      <Text style={[styles.number, { fontSize, lineHeight }]}>{showGo ? 'Go!' : count}</Text>
      <Text
        numberOfLines={1}
        allowFontScaling={false}
        onLayout={onSampleLayout}
        style={styles.hiddenMeasure}
      >
        {sampleText}
      </Text>
      {!showGo && (
        <View style={styles.dotWrap}>
          {[0, 1].map((row) => (
            <View key={row} style={styles.dotRow}>
              {[0, 1, 2, 3, 4].map((col) => {
                const active = activeDots.has(`${row}-${col}`);
                return (
                  <View
                    key={col}
                    style={[
                      styles.dot,
                      { backgroundColor: active ? DOT_ACTIVE[4 - col] : DOT_INACTIVE },
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
    backgroundColor: '#17171C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    color: '#E03A3E',
    letterSpacing: 5,
    fontFamily: 'Formula1-Black',
    marginBottom: 80 * scale,
    includeFontPadding: false,
  },
  dotWrap: {
    gap: DOT_ROW_GAP * scale,
  },
  dotRow: {
    flexDirection: 'row',
    gap: DOT_GAP * scale,
  },
  dot: {
    width: DOT_SIZE * scale,
    height: DOT_SIZE * scale,
    borderRadius: 999,
  },
  hiddenMeasure: {
    position: 'absolute',
    opacity: 0,
    left: -9999,
    top: -9999,
    includeFontPadding: false,
    fontFamily: 'Formula1-Black',
    fontSize: 130.2486572265625,
    lineHeight: 156,
    letterSpacing: 6.5,
  },
});
