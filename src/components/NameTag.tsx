import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

// HTML 프로토타입 정확한 값:
// viewBox="0 0 43 26", bg rect x=2 y=2 w=39 h=22 rx=4.5
// border stroke-width=4, gradient 세로 (위→아래: start→end 색상)
// 빨간 바: x=8 y=8 w=2 h=10
// 텍스트: left=14px, font-size=10px, color=white

interface Props {
  label?: string;
  colorStart: string;  // 섹터 start 색상
  colorEnd: string;    // 섹터 end 색상
}

export default function NameTag({ label = 'LEC', colorStart, colorEnd }: Props) {
  return (
    <View style={s.wrap}>
      <Svg width={43} height={26} viewBox="0 0 43 26" fill="none" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <LinearGradient id="ntGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colorStart} />
            <Stop offset="100%" stopColor={colorEnd} />
          </LinearGradient>
        </Defs>
        <Rect x="2" y="2" width="39" height="22" rx="4.5" fill="#181E27" />
        <Rect x="2" y="2" width="39" height="22" rx="4.5" fill="none" stroke="url(#ntGrad)" strokeWidth="4" />
        <Rect x="8" y="8" width="2" height="10" fill="#E03A3E" />
      </Svg>
      <Text style={s.label}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    width: 43,
    height: 26,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: 14,
    top: 0,
    bottom: 0,
    textAlignVertical: 'center',
    fontFamily: 'Formula1-Bold',
    fontSize: 10,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
});
