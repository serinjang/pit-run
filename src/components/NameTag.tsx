import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

interface Props {
  label?: string;
  colorStart: string;
  colorEnd: string;
  accentColor?: string;
  gradientX1?: number;
  gradientY1?: number;
  gradientX2?: number;
  gradientY2?: number;
}

export default function NameTag({
  label = 'LEC',
  colorStart,
  colorEnd,
  accentColor = '#E03A3E',
  gradientX1 = 0,
  gradientY1 = 0.5,
  gradientX2 = 1,
  gradientY2 = 0.5,
}: Props) {
  return (
    <View style={s.wrap}>
      <Svg width={43} height={26} viewBox="0 0 43 26" fill="none" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <LinearGradient id="ntGrad" x1={gradientX1} y1={gradientY1} x2={gradientX2} y2={gradientY2}>
            <Stop offset="0%" stopColor={colorStart} />
            <Stop offset="100%" stopColor={colorEnd} />
          </LinearGradient>
        </Defs>
        <Rect x="2" y="2" width="39" height="22" rx="4.5" fill="#181E27" />
        <Rect x="2" y="2" width="39" height="22" rx="4.5" fill="none" stroke="url(#ntGrad)" strokeWidth="4" />
        <Rect x="8" y="8" width="2" height="10" fill={accentColor} />
      </Svg>
      <Text style={s.label}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { width: 43, height: 26, position: 'relative' },
  label: {
    position: 'absolute',
    left: 14,
    top: 7,
    fontFamily: 'Formula1-Bold',
    fontSize: 10,
    lineHeight: 12,
    color: '#FFFFFF',
    includeFontPadding: false,
    textTransform: 'capitalize',
  },
});
