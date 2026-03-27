import React from 'react';
import Svg, { Rect, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface Props {
  label?: string;
  borderColorStart?: string;
  borderColorEnd?: string;
}

export default function NameTag({
  label = 'LEC',
  borderColorStart = '#FC8E28',
  borderColorEnd = '#FCB827',
}: Props) {
  return (
    <Svg width="41" height="23" viewBox="0 0 41 23" fill="none">
      <Defs>
        <LinearGradient id="ngGrad" x1="20.098" y1="1.25608" x2="20.098" y2="17.5857" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor={borderColorStart} />
          <Stop offset="100%" stopColor={borderColorEnd} />
        </LinearGradient>
      </Defs>
      {/* 배경 */}
      <Rect x="1.256" y="1.256" width="37.684" height="20.098" rx="3.768" fill="#181E27" />
      {/* 테두리 (그라데이션) */}
      <Rect x="1.256" y="1.256" width="37.684" height="20.098" rx="3.768" stroke="url(#ngGrad)" strokeWidth="2.512" />
      {/* 빨간 바 */}
      <Rect x="6.281" y="6.281" width="2.512" height="10.049" fill="#E03A3E" />
      {/* 텍스트는 RN Text로 오버레이 */}
    </Svg>
  );
}
