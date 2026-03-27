import React from 'react';
import Svg, { Circle, Rect } from 'react-native-svg';

interface Props {
  color: string;
  size?: number;
}

export default function PauseButton({ color, size = 76 }: Props) {
  const scale = size / 76;
  return (
    <Svg width={size} height={size} viewBox="0 0 76 76" fill="none">
      <Circle cx="38" cy="38" r="38" fill={color} fillOpacity={0.25} />
      <Rect x={30 * scale} y={30 * scale} width={7 * scale} height={16 * scale} rx={1} fill={color} />
      <Rect x={39 * scale} y={30 * scale} width={7 * scale} height={16 * scale} rx={1} fill={color} />
    </Svg>
  );
}
