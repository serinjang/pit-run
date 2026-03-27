import React from 'react';
import Svg, { Circle, Rect } from 'react-native-svg';

interface Props {
  color: string;
  bgColor?: string;
  size?: number;
}

export default function PauseButton({ color, bgColor, size = 76 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 76 76" fill="none">
      <Circle cx="38" cy="38" r="38" fill={bgColor ?? color} fillOpacity={0.2} />
      <Rect x={30.4} y={30.4} width={6.756} height={15.2} rx={1} fill={color} />
      <Rect x={38.845} y={30.4} width={6.756} height={15.2} rx={1} fill={color} />
    </Svg>
  );
}
