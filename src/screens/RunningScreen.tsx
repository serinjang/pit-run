import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRunStore } from '../store/runStore';
import { useRunning } from '../hooks/useRunning';
import { fmtTime, fmtPace, fmtDist } from '../utils/format';
import { COLORS } from '../constants/colors';
import { CIRCUIT_KM } from '../constants/tires';
import PauseButton from '../components/PauseButton';
import StopButton from '../components/StopButton';
import PlayButton from '../components/PlayButton';
import BoxBoxSheet from '../components/BoxBoxSheet';
import NameTag from '../components/NameTag';
import CheckerFlag from '../components/CheckerFlag';
import ChinaFlag from '../components/ChinaFlag';
import CircuitMap, {
  CIRCUIT_VIEWBOX,
  getCircuitPointAtProgress,
  getCircuitTangentAtProgress,
} from '../components/CircuitMap';

const FW = 402;
const FH = 874;

const GLOW = {
  yellow: 'rgba(252,184,39,0.7)',
  purple: 'rgba(190,78,255,0.75)',
  green: 'rgba(89,179,69,0.75)',
} as const;

const BTN_BG = {
  yellow: '#FFDD94',
  purple: '#B850FF',
  green: '#59B345',
} as const;

const BTN_ICON = {
  yellow: '#FCB827',
  purple: '#C26AFF',
  green: '#59B345',
} as const;

const TAG_BORDER = {
  yellow: { start: '#FC8E28', end: '#FCB827' },
  purple: { start: '#AF28C5', end: '#8528C5' },
  green: { start: '#2CC37F', end: '#59B345' },
} as const;

const DIST_BASE_SIZE = 130.2486572265625;
const DIST_LINE_HEIGHT_RATIO = 156 / DIST_BASE_SIZE;
const DIST_FIT_SAMPLE = '9999.99';
const PACE_FIT_SAMPLE = '99\'59"';
const STAT_VALUE_LINE_HEIGHT = 36;
const CONTROL_BUTTON_SIZE = 76;
const CONTROLS_TOP_SPACING = 20;
const CONTROLS_BOTTOM_SPACING = 32;
const MIN_GAP_CIRCUIT_TO_CONTROLS = 60;
const MIN_GAP_TEXT_TO_CIRCUIT = 40;
const MIN_TOP_GAP_FOR_META = 80;

type RunningScreenProps = {
  onStop: () => void;
  circuit?: { displayName: string; distanceKm: number };
  profile?: { displayName: string; nameTagAccentColor: string };
  records?: { bestEverSecPerKm: number; todayBestSecPerKm: number };
  onPaceSample?: (paceSecPerKm: number) => void;
};

export default function RunningScreen({ onStop, circuit, profile, onPaceSample }: RunningScreenProps) {
  const { width: windowW, height: windowH } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [initialW] = useState(windowW);
  const [initialH] = useState(windowH);

  // Keep visual scale fixed to initially detected device size.
  const sx = initialW / FW;
  const sy = initialH / FH;
  const s = (v: number) => v * sx;
  const t = (v: number) => v * sy;

  const {
    distKm,
    elapsedMs,
    paceS,
    sector,
    prog,
    isPaused,
    boxBoxActive,
    pauseRun,
    resumeRun,
    stopRun,
    startRun,
    closeBoxBox,
    setTire,
  } = useRunStore();

  useRunning();

  useEffect(() => {
    startRun();
  }, [startRun]);

  const cfg = COLORS.sector[sector];
  const circuitLabel = circuit?.displayName ?? 'Shanghai';
  const circuitKm = circuit?.distanceKm ?? CIRCUIT_KM;
  const nameTagLabel = profile?.displayName ?? 'Lec';

  const DIST_LEFT = s(36);
  const DIST_RIGHT = windowW - DIST_LEFT;
  const distFrameWidth = DIST_RIGHT - DIST_LEFT;

  const distBaseSize = DIST_BASE_SIZE;
  const initialDistAvailableWidth = initialW - DIST_LEFT * 2;
  const [distSampleWidth, setDistSampleWidth] = useState<number>(0);
  const [distRenderWidth, setDistRenderWidth] = useState<number>(0);

  const distFontSize = useMemo(() => {
    if (distSampleWidth <= 0) return distBaseSize;
    const scale = Math.min(1, initialDistAvailableWidth / distSampleWidth);
    return distBaseSize * scale;
  }, [distBaseSize, distSampleWidth, initialDistAvailableWidth]);

  const distLineHeight = distFontSize * DIST_LINE_HEIGHT_RATIO;
  const distStartX = (DIST_LEFT + DIST_RIGHT) / 2 - distRenderWidth / 2;
  const distEndX = distStartX + distRenderWidth;
  const distAnchorLeft = distRenderWidth > 0 ? distStartX : DIST_LEFT;

  const baseDistTop = t(174);
  const baseMetaTop = baseDistTop - 20;
  const baseStatsLabelTop = baseDistTop + distLineHeight + 28;
  const statsLabelHeight = 13;
  const baseStatsValueTop = baseStatsLabelTop + statsLabelHeight + 8;
  const baseStatsValueBottom = baseStatsValueTop + STAT_VALUE_LINE_HEIGHT;

  const paceValue = fmtPace(paceS);
  const [paceMaxWidth, setPaceMaxWidth] = useState<number>(0);
  const [paceCurrentWidth, setPaceCurrentWidth] = useState<number>(0);
  const paceTextWidth = (paceMaxWidth > 0 ? paceMaxWidth : s(84)) + s(2);
  const paceCurrentStartOffset = paceCurrentWidth > 0 ? paceCurrentWidth : (paceMaxWidth > 0 ? paceMaxWidth : s(84));
  const paceRight = distRenderWidth > 0 ? distEndX : DIST_RIGHT;
  const paceLeft = paceRight - paceTextWidth;
  const paceLabelLeft = paceRight - paceCurrentStartOffset;

  const baseCircuitW = s(280.21);
  const baseCircuitH = t(180);
  const controlsBottomPadding = insets.bottom + CONTROLS_BOTTOM_SPACING;
  const controlsTop = windowH - (controlsBottomPadding + CONTROLS_TOP_SPACING + CONTROL_BUTTON_SIZE);
  const statsValueBottomMax =
    controlsTop - (MIN_GAP_CIRCUIT_TO_CONTROLS + MIN_GAP_TEXT_TO_CIRCUIT + baseCircuitH);
  const requiredUpwardShift = Math.max(0, baseStatsValueBottom - statsValueBottomMax);
  const maxUpwardShift = Math.max(0, baseMetaTop - MIN_TOP_GAP_FOR_META);
  const upwardShift = Math.min(requiredUpwardShift, maxUpwardShift);

  const distTop = baseDistTop - upwardShift;
  const metaTop = baseMetaTop - upwardShift;
  const statsLabelTop = baseStatsLabelTop - upwardShift;
  const statsValueTop = baseStatsValueTop - upwardShift;
  const statsValueBottom = baseStatsValueBottom - upwardShift;

  // Fallback for short screens: shrink circuit to preserve vertical spacing constraints.
  const availableCircuitHeight =
    controlsTop - MIN_GAP_CIRCUIT_TO_CONTROLS - (statsValueBottom + MIN_GAP_TEXT_TO_CIRCUIT);
  const circuitScaleFallback =
    baseCircuitH > 0 ? Math.min(1, Math.max(0, availableCircuitHeight / baseCircuitH)) : 1;
  const circuitW = baseCircuitW * circuitScaleFallback;
  const circuitH = baseCircuitH * circuitScaleFallback;
  const circuitLeft = DIST_LEFT + (distFrameWidth - circuitW) / 2;

  const circuitTopMin = statsValueBottom + MIN_GAP_TEXT_TO_CIRCUIT;
  const circuitTopMax = controlsTop - MIN_GAP_CIRCUIT_TO_CONTROLS - circuitH;
  const desiredCircuitTop = (circuitTopMin + circuitTopMax) / 2;
  const circuitTop = Math.min(Math.max(desiredCircuitTop, circuitTopMin), circuitTopMax);

  const circuitScale = Math.min(circuitW / CIRCUIT_VIEWBOX.width, circuitH / CIRCUIT_VIEWBOX.height);
  const circuitOffsetX = (circuitW - CIRCUIT_VIEWBOX.width * circuitScale) / 2;
  const circuitOffsetY = (circuitH - CIRCUIT_VIEWBOX.height * circuitScale) / 2;
  const circuitPoint = getCircuitPointAtProgress(prog);
  const startPoint = getCircuitPointAtProgress(0);
  const tangent = getCircuitTangentAtProgress(prog);

  // Incoming side (where the drawn line reaches the tag)
  // is opposite to the forward tangent direction.
  const touchNx = -tangent.x;
  const touchNy = -tangent.y;
  const gradientX1 = 0.5 + 0.5 * touchNx;
  const gradientY1 = 0.5 + 0.5 * touchNy;
  const gradientX2 = 0.5 - 0.5 * touchNx;
  const gradientY2 = 0.5 - 0.5 * touchNy;

  const nameTagW = 43;
  const nameTagH = 26;
  const nameTagLeft = circuitLeft + circuitOffsetX + circuitPoint.x * circuitScale - nameTagW / 2;
  const nameTagTop = circuitTop + circuitOffsetY + circuitPoint.y * circuitScale - nameTagH / 2;

  // Anchor checker by its tilted rectangle (inside SVG) to the circuit start outline.
  const checkerAnchorX = 10.84;
  const checkerAnchorY = 7.4;
  const checkerOverlap = 0.8;
  const checkerLeft = circuitLeft + circuitOffsetX + startPoint.x * circuitScale - checkerAnchorX + checkerOverlap;
  const checkerTop = circuitTop + circuitOffsetY + startPoint.y * circuitScale - checkerAnchorY;

  useEffect(() => {
    onPaceSample?.(paceS);
  }, [paceS, onPaceSample]);

  return (
    <View style={st.container}>
      <View style={[st.circuitMetaRow, { left: distAnchorLeft + 2, top: metaTop, gap: 6 }]}>
        <ChinaFlag />
        <Text style={[st.circuitName, { fontSize: 17, lineHeight: 17 }]}>
          {circuitLabel} {circuitKm.toFixed(2)}km
        </Text>
      </View>

      <View style={[st.distCenterWrap, { top: distTop, left: DIST_LEFT, right: DIST_LEFT }]}> 
        <Text
          numberOfLines={1}
          ellipsizeMode="clip"
          allowFontScaling={false}
          onLayout={(e) => {
            const w = e.nativeEvent.layout.width;
            if (w > 0 && Math.abs(w - distRenderWidth) > 0.5) setDistRenderWidth(w);
          }}
          style={[st.dist, { color: cfg.start, fontSize: distFontSize, lineHeight: distLineHeight }]}
        >
          {fmtDist(distKm)}
        </Text>
      </View>

      <Text
        numberOfLines={1}
        allowFontScaling={false}
        style={[
          st.hiddenMeasure,
          {
            fontFamily: 'Formula1-Black',
            fontSize: distBaseSize,
            lineHeight: distBaseSize * DIST_LINE_HEIGHT_RATIO,
            letterSpacing: 6.5,
          },
        ]}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          if (w > 0 && Math.abs(w - distSampleWidth) > 0.5) setDistSampleWidth(w);
        }}
      >
        {DIST_FIT_SAMPLE}
      </Text>

      <Text style={[st.lbl, { left: distStartX, top: statsLabelTop, fontSize: 13, lineHeight: 13 }]}>TIME</Text>
      <Text style={[st.val, { left: distStartX, top: statsValueTop, fontSize: 30, lineHeight: STAT_VALUE_LINE_HEIGHT }]}>{fmtTime(elapsedMs)}</Text>

      <Text style={[st.lbl, { left: paceLabelLeft, top: statsLabelTop, fontSize: 13, lineHeight: 13 }]}>PACE</Text>
      <Text
        numberOfLines={1}
        ellipsizeMode="clip"
        allowFontScaling={false}
        style={[
          st.val,
          {
            left: paceLeft,
            top: statsValueTop,
            width: paceTextWidth,
            textAlign: 'right',
            fontSize: 30,
            lineHeight: STAT_VALUE_LINE_HEIGHT,
          },
        ]}
      >
        {paceValue}
      </Text>

      <Text
        numberOfLines={1}
        allowFontScaling={false}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          if (w > 0 && Math.abs(w - paceMaxWidth) > 0.5) setPaceMaxWidth(w);
        }}
        style={[st.hiddenMeasure, { fontFamily: 'Formula1-Bold', fontSize: 30, lineHeight: STAT_VALUE_LINE_HEIGHT }]}
      >
        {PACE_FIT_SAMPLE}
      </Text>

      <Text
        numberOfLines={1}
        allowFontScaling={false}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          if (w > 0 && Math.abs(w - paceCurrentWidth) > 0.5) setPaceCurrentWidth(w);
        }}
        style={[st.hiddenMeasure, { fontFamily: 'Formula1-Bold', fontSize: 30, lineHeight: STAT_VALUE_LINE_HEIGHT }]}
      >
        {paceValue}
      </Text>

      <View
        style={{
          position: 'absolute',
          top: circuitTop,
          left: circuitLeft,
          width: circuitW,
          height: circuitH,
        }}
      >
        <CircuitMap progress={prog} />
      </View>



      <View style={{ position: 'absolute', left: checkerLeft, top: checkerTop }}>
        <CheckerFlag color={cfg.start} />
      </View>

      <View style={{ position: 'absolute', left: nameTagLeft, top: nameTagTop }}>
        <NameTag
          label={nameTagLabel}
          colorStart="#FC8A27"
          colorEnd="#FCB827"
          accentColor="#E03A3E"
          gradientX1={gradientX1}
          gradientY1={gradientY1}
          gradientX2={gradientX2}
          gradientY2={gradientY2}
        />
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingTop: CONTROLS_TOP_SPACING,
          paddingBottom: controlsBottomPadding,
          flexDirection: 'row',
          justifyContent: 'center',
          gap: s(24),
        }}
      >
        {isPaused ? (
          <>
            <Pressable
              onPress={() => {
                stopRun();
                onStop();
              }}
            >
              <StopButton color={BTN_ICON[sector]} bgColor={BTN_BG[sector]} size={CONTROL_BUTTON_SIZE} />
            </Pressable>
            <Pressable onPress={resumeRun}>
              <PlayButton color={BTN_ICON[sector]} bgColor={BTN_BG[sector]} size={CONTROL_BUTTON_SIZE} />
            </Pressable>
          </>
        ) : (
          <Pressable onPress={pauseRun}>
            <PauseButton color={BTN_ICON[sector]} bgColor={BTN_BG[sector]} size={CONTROL_BUTTON_SIZE} />
          </Pressable>
        )}
      </View>

      <BoxBoxSheet
        visible={boxBoxActive}
        onClose={closeBoxBox}
        onSelectTire={(tire) => {
          setTire(tire);
        }}
      />
    </View>
  );
}

const st = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17171C',
  },
  circuitMetaRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  circuitName: {
    fontFamily: 'Formula1-Regular',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: -0.65,
    includeFontPadding: false,
  },
  distCenterWrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  dist: {
    fontFamily: 'Formula1-Black',
    letterSpacing: 6.5,
    includeFontPadding: false,
    textAlign: 'center',
  },
  lbl: {
    position: 'absolute',
    fontFamily: 'Formula1-Regular',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: -0.26,
    includeFontPadding: false,
  },
  val: {
    position: 'absolute',
    fontFamily: 'Formula1-Bold',
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  hiddenMeasure: {
    position: 'absolute',
    opacity: 0,
    left: -9999,
    top: -9999,
    includeFontPadding: false,
  },
});
