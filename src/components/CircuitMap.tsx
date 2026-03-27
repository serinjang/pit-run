import React from 'react';
import Svg, {
  Defs,
  FeGaussianBlur,
  FeMerge,
  FeMergeNode,
  Filter,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';

type CircuitMapProps = {
  trackPath: string;
  progress: number;
  startColor: string;
  endColor: string;
};

export default function CircuitMap({
  trackPath,
  progress,
  startColor,
  endColor,
}: CircuitMapProps) {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const dashLength = clampedProgress * 1000;

  return (
    <Svg width="100%" height="100%" viewBox="0 0 286 185" preserveAspectRatio="xMidYMid meet">
      <Defs>
        <Filter id="track-glow" x="-60%" y="-60%" width="220%" height="220%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation="18" result="blurred" />
          <FeMerge>
            <FeMergeNode in="blurred" />
            <FeMergeNode in="SourceGraphic" />
          </FeMerge>
        </Filter>
        <LinearGradient id="track-gradient" x1="106" y1="90" x2="160" y2="4" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor={startColor} />
          <Stop offset="100%" stopColor={endColor} />
        </LinearGradient>
      </Defs>

      <Path
        d={trackPath}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={5}
        strokeMiterlimit={10}
      />
      <Path
        d={trackPath}
        fill="none"
        stroke={startColor}
        strokeWidth={5}
        strokeMiterlimit={10}
        strokeDasharray={`${dashLength} 1000`}
        filter="url(#track-glow)"
      />
      <Path
        d={trackPath}
        fill="none"
        stroke="url(#track-gradient)"
        strokeWidth={5}
        strokeMiterlimit={10}
        strokeDasharray={`${dashLength} 1000`}
      />
    </Svg>
  );
}
