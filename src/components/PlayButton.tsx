import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface Props {
  color: string;
  size?: number;
}

export default function PlayButton({ color, size = 76 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 76 76" fill="none">
      <Circle cx="38" cy="38" r="38" fill={color} fillOpacity={0.25} />
      <Path d="M32 28L50 38L32 48V28Z" fill={color} />
    </Svg>
  );
}
