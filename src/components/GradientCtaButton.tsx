import React, { useRef } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';

type GradientCtaButtonProps = {
  width: number;
  label: string;
  enabled: boolean;
  onPress: () => void;
  height?: number;
  style?: StyleProp<ViewStyle>;
};

const GLOW_EXTRA_WIDTH = 160;
const GLOW_HEIGHT = 158;

export default function GradientCtaButton({
  width,
  label,
  enabled,
  onPress,
  height = 58,
  style,
}: GradientCtaButtonProps) {
  const gradientId = useRef(`gradientCta_${Math.random().toString(36).slice(2, 9)}`).current;
  const glowId = useRef(`gradientCtaGlow_${Math.random().toString(36).slice(2, 9)}`).current;

  return (
    <View style={[styles.wrap, { width }, style]}>
      <Pressable disabled={!enabled} onPress={onPress} style={[styles.press, { height }]}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {enabled && (
            <Defs>
              <RadialGradient id={gradientId} cx="50%" cy="50%" r="72%">
                <Stop offset="27%" stopColor="#E03A3E" />
                <Stop offset="100%" stopColor="#FF4D51" />
              </RadialGradient>
            </Defs>
          )}
          <Rect
            x="0"
            y="0"
            width={width}
            height={height}
            rx="12"
            fill={enabled ? `url(#${gradientId})` : 'rgba(224,58,62,0.2)'}
          />
          <SvgText
            x="50%"
            y="50%"
            fill={enabled ? '#FFFFFF' : 'rgba(255,255,255,0.2)'}
            fontSize={22}
            fontFamily="Formula1-Bold"
            fontWeight="700"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {label}
          </SvgText>
        </Svg>
      </Pressable>

      {enabled && (
        <Svg
          width={width + GLOW_EXTRA_WIDTH}
          height={GLOW_HEIGHT}
          viewBox={`0 0 ${width + GLOW_EXTRA_WIDTH} ${GLOW_HEIGHT}`}
          style={styles.glow}
          pointerEvents="none"
        >
          <Defs>
            <RadialGradient id={glowId} cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="rgba(224,58,62,1)" />
              <Stop offset="100%" stopColor="rgba(224,58,62,0)" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width={width + GLOW_EXTRA_WIDTH} height={GLOW_HEIGHT} fill={`url(#${glowId})`} opacity="0.3" />
        </Svg>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  press: {
    width: '100%',
    position: 'relative',
    zIndex: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  glow: {
    position: 'absolute',
    bottom: -22,
    left: -80,
    zIndex: 1,
  },
});
