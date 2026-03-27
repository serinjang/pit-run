import React from 'react';
import Svg, { Circle, Rect, Path } from 'react-native-svg';

// HTML 프로토타입에서 추출한 정확한 좌표값
// pauseBtn: circle r=38, rect1 x=30.4 y=30.4 w=6.756 h=15.2, rect2 x=38.845
// stopBtn:  circle r=38, rect x=30 y=30 w=16 h=16
// playBtn:  circle r=38, path (삼각형)

interface Props {
  type: 'pause' | 'stop' | 'play';
  color: string;
  bgColor?: string;
  size?: number;
}

export default function RunningButton({ type, color, bgColor = color, size = 76 }: Props) {
  const s = size / 76; // scale factor
  return (
    <Svg width={size} height={size} viewBox="0 0 76 76" fill="none">
      <Circle cx="38" cy="38" r="38" fill={bgColor} fillOpacity={0.2} />
      {type === 'pause' && (
        <>
          <Rect x={30.4*s} y={30.4*s} width={6.756*s} height={15.2*s} rx={1} fill={color} />
          <Rect x={38.845*s} y={30.4*s} width={6.756*s} height={15.2*s} rx={1} fill={color} />
        </>
      )}
      {type === 'stop' && (
        <Rect x={30*s} y={30*s} width={16*s} height={16*s} rx={1} fill={color} />
      )}
      {type === 'play' && (
        <Path
          d="M47.75 36.701C48.75 37.2783 48.75 38.7217 47.75 39.299L34.25 47.0933C33.25 47.6706 32 46.9489 32 45.7942L32 30.2058C32 29.0511 33.25 28.3294 34.25 28.9067L47.75 36.701Z"
          fill={color}
        />
      )}
    </Svg>
  );
}
