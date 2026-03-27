import React from 'react';
import Svg, { Circle, Rect, Path } from 'react-native-svg';
import type { SectorColor } from '../constants/colors';

interface Props {
  type: 'pause' | 'stop' | 'play';
  color?: string;
  bgColor?: string;
  sector?: SectorColor;
  size?: number;
}

const SECTOR_THEME: Record<SectorColor, { icon: string; bg: string }> = {
  yellow: { icon: '#FCB827', bg: '#FFDD94' },
  purple: { icon: '#C26AFF', bg: '#B850FF' },
  green: { icon: '#59B345', bg: '#59B345' },
};

export default function RunningButton({ type, color, bgColor, sector = 'yellow', size = 76 }: Props) {
  const sf = size / 76;
  const iconColor = color ?? SECTOR_THEME[sector].icon;
  const fillColor = bgColor ?? SECTOR_THEME[sector].bg;

  return (
    <Svg width={size} height={size} viewBox="0 0 76 76" fill="none">
      <Circle cx="38" cy="38" r="38" fill={fillColor} fillOpacity={0.2} />
      {type === 'pause' && (
        <>
          <Rect x={30.4 * sf} y={30.4 * sf} width={6.756 * sf} height={15.2 * sf} rx={1} fill={iconColor} />
          <Rect x={38.845 * sf} y={30.4 * sf} width={6.756 * sf} height={15.2 * sf} rx={1} fill={iconColor} />
        </>
      )}
      {type === 'stop' && (
        <Rect x={30 * sf} y={30 * sf} width={16 * sf} height={16 * sf} rx={1} fill={iconColor} />
      )}
      {type === 'play' && (
        <Path
          d="M47.75 36.701C48.75 37.2783 48.75 38.7217 47.75 39.299L34.25 47.0933C33.25 47.6706 32 46.9489 32 45.7942L32 30.2058C32 29.0511 33.25 28.3294 34.25 28.9067L47.75 36.701Z"
          fill={iconColor}
        />
      )}
    </Svg>
  );
}
