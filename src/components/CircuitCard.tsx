import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { CircuitDefinition } from '../config/circuits';

export type CircuitTagType = 'Sprint' | 'Mixed' | 'Tempo';

type CircuitCardProps = {
  circuit: CircuitDefinition;
  tag: CircuitTagType;
  svgOffsetX: number;
  svgOffsetY: number;
  svgDisplayW: number;
  svgDisplayH: number;
  isSelected?: boolean;
  isDisabled?: boolean;
  isDimmed?: boolean;
  onPress?: () => void;
  cardWidth: number;
};

const FIGMA_CARD_W = 167;
const FIGMA_CARD_H = 182;

const TAG_CONFIG = {
  Sprint: { bg: 'rgba(224,58,62,0.3)', color: '#E03A3E' },
  Mixed: { bg: 'rgba(252,184,39,0.3)', color: '#FCB827' },
  Tempo: { bg: 'rgba(89,179,69,0.3)', color: '#59B345' },
} as const;

export default function CircuitCard({
  circuit,
  tag,
  svgOffsetX,
  svgOffsetY,
  svgDisplayW,
  svgDisplayH,
  isSelected = false,
  isDisabled = false,
  isDimmed = false,
  onPress,
  cardWidth,
}: CircuitCardProps) {
  const scale = cardWidth / FIGMA_CARD_W;
  const cardHeight = FIGMA_CARD_H * scale;

  const tagCfg = TAG_CONFIG[tag];
  const vbW = circuit.viewBox?.width ?? 286;
  const vbH = circuit.viewBox?.height ?? 185;

  const scaledSvgX = svgOffsetX * scale;
  const scaledSvgY = svgOffsetY * scale;
  const scaledSvgW = svgDisplayW * scale;
  const scaledSvgH = svgDisplayH * scale;

  // strokeWidth in viewBox units that renders as exactly 2pt on screen
  const strokeW = 2 * (vbW / scaledSvgW);

  const scaledNameTop = 16 * scale;
  const scaledNameLeft = 16 * scale;
  const scaledDistTop = 44 * scale;
  const scaledTagTop = 72 * scale;
  const scaledTagPadH = 6 * scale;
  const scaledTagPadV = 4 * scale;
  const scaledFontName = Math.round(20 * scale);
  const scaledFontDist = Math.round(17 * scale);
  const scaledFontTag = Math.round(13 * scale);

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      style={[
        styles.card,
        { width: cardWidth, height: cardHeight },
        isSelected && styles.cardSelected,
        isDisabled && styles.cardDisabled,
        isDimmed && styles.cardDimmed,
      ]}
    >
      <Text
        style={[styles.name, { top: scaledNameTop, left: scaledNameLeft, fontSize: scaledFontName, lineHeight: scaledFontName * 1.2 }]}
        numberOfLines={1}
        allowFontScaling={false}
      >
        {circuit.displayName}
      </Text>

      <Text
        style={[styles.distance, { top: scaledDistTop, left: scaledNameLeft, fontSize: scaledFontDist, lineHeight: scaledFontDist * 1.2 }]}
        allowFontScaling={false}
      >
        {circuit.distanceKm.toFixed(1)}km
      </Text>

      <View
        style={[
          styles.tag,
          {
            top: scaledTagTop,
            left: scaledNameLeft,
            backgroundColor: tagCfg.bg,
            paddingHorizontal: scaledTagPadH,
            paddingVertical: scaledTagPadV,
          },
        ]}
      >
        <Text
          style={[styles.tagText, { color: tagCfg.color, fontSize: scaledFontTag, lineHeight: scaledFontTag * 1.2 }]}
          allowFontScaling={false}
        >
          {tag}
        </Text>
      </View>

      <View
        style={{
          position: 'absolute',
          left: scaledSvgX,
          top: scaledSvgY,
          width: scaledSvgW,
          height: scaledSvgH,
        }}
      >
        <Svg
          width={scaledSvgW}
          height={scaledSvgH}
          viewBox={`0 0 ${vbW} ${vbH}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <Path
            d={circuit.trackPath}
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth={strokeW}
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#202028',
    borderRadius: 12,
    overflow: 'hidden',
    // Always reserve 2px border space so content never shifts on selection
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    backgroundColor: '#44252C',
    borderColor: '#E03A3E',
  },
  cardDisabled: {
    opacity: 0.3,
  },
  cardDimmed: {
    opacity: 0.3,
  },
  name: {
    position: 'absolute',
    fontFamily: 'Formula1-Bold',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    includeFontPadding: false,
  },
  distance: {
    position: 'absolute',
    fontFamily: 'Formula1-Regular',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: -0.34,
    includeFontPadding: false,
  },
  tag: {
    position: 'absolute',
    borderRadius: 2,
  },
  tagText: {
    fontFamily: 'Formula1-Regular',
    letterSpacing: -0.26,
    includeFontPadding: false,
  },
});
