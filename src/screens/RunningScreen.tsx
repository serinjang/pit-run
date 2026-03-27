import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, {
  Path, Defs, LinearGradient, Stop,
  Filter, FeGaussianBlur, FeMerge, FeMergeNode,
  G, Rect, ClipPath,
} from 'react-native-svg';
import { useRunStore } from '../store/runStore';
import { useRunning } from '../hooks/useRunning';
import { fmtTime, fmtPace, fmtDist } from '../utils/format';
import { COLORS } from '../constants/colors';
import { CIRCUIT_KM } from '../constants/tires';
import RunningButton from '../components/RunningButton';
import BoxBoxSheet from '../components/BoxBoxSheet';
import NameTag from '../components/NameTag';
import CheckerFlag from '../components/CheckerFlag';
import ChinaFlag from '../components/ChinaFlag';

// Figma 기준: 402 × 874
const FW = 402;
const FH = 874;
const { width: SW, height: SH } = Dimensions.get('window');
const SX = SW / FW;
const SY = SH / FH;
const s = (v: number) => v * SX; // x축 스케일
const t = (v: number) => v * SY; // y축 스케일

// 서킷 path (HTML 프로토타입과 동일)
const CIRCUIT_PATH = 'M106.033 90.5001L132.665 17.5331C133.833 14.3174 135.554 11.2902 137.891 8.80303C142.036 4.39403 149.259 -0.0149686 160.124 4.20561C160.124 4.20561 172.283 8.68998 168.641 20.6106C168.641 20.6106 165.664 28.9136 159.546 27.9715C158.077 27.7454 156.758 26.9415 155.715 25.8863C154.76 24.9066 153.517 23.4118 152.6 21.4397C151.758 19.6434 150.075 18.94 148.555 18.6887C146.382 18.337 144.108 18.8395 142.488 20.3217C141.106 21.5778 139.926 23.7258 140.767 27.2681C142.463 34.3401 148.517 38.2717 148.517 38.2717C148.517 38.2717 151.947 41.1357 156.707 40.784C161.468 40.4323 215.695 32.7699 215.695 32.7699C215.695 32.7699 219.438 31.9409 224.011 33.2221C228.583 34.5034 263.754 43.0827 263.754 43.0827C263.754 43.0827 270.864 45.2684 265.94 50.5818C261.016 55.8952 250.276 56.7117 250.276 56.7117C250.276 56.7117 226.962 57.4528 206.94 54.8526C186.917 52.2399 178.828 67.8912 178.828 67.8912C178.828 67.8912 171.442 78.5557 179.87 95.2998C180.988 97.5106 182.37 99.5832 183.865 101.568C187.294 106.14 195.296 118.902 186.993 129.265C183.099 134.127 176.868 136.438 170.663 135.973C167.711 135.747 163.855 135.22 158.868 134.152C157.335 133.825 155.728 133.75 154.208 134.114C150.992 134.88 146.998 137.594 150.464 146.751L153.542 155.267C153.542 155.267 154.484 159.061 159.936 159.174C165.387 159.287 253.203 161.661 253.203 161.661C253.203 161.661 258.202 161.711 256.532 155.531C254.861 149.351 251.608 143.698 260.539 141.563C263.641 140.822 266.907 140.897 269.972 141.739C276.554 143.548 286.754 149.15 281.026 166.359C281.026 166.359 275.06 181.118 258.918 181.269C242.777 181.42 4.41473 182.5 4.41473 182.5C4.41473 182.5 0.483053 182.01 3.88715 177.702C5.20608 176.018 7.44199 174.7 9.67789 173.695C13.1448 172.15 16.9006 171.371 20.6941 171.22L75.2602 169.047C75.2602 169.047 77.7724 168.494 78.3754 166.359L78.3628 166.309L105.303 92.5001';

function CircuitSvg({ progress, colorStart, colorEnd }: {
  progress: number; colorStart: string; colorEnd: string;
}) {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 286 185" preserveAspectRatio="xMidYMid meet" overflow="visible">
      <Defs>
        <Filter id="gf" x="-60%" y="-60%" width="220%" height="220%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation="20" result="b" />
          <FeMerge>
            <FeMergeNode in="b" />
            <FeMergeNode in="SourceGraphic" />
          </FeMerge>
        </Filter>
        <LinearGradient id="cGrad" x1="106" y1="90" x2="160" y2="4" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor={colorStart} />
          <Stop offset="100%" stopColor={colorEnd} />
        </LinearGradient>
      </Defs>
      {/* 배경 트랙 */}
      <Path d={CIRCUIT_PATH} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={5} strokeMiterlimit={10} />
      {/* Glow */}
      <Path d={CIRCUIT_PATH} fill="none" stroke={colorStart} strokeWidth={5} strokeMiterlimit={10} strokeLinecap="butt" strokeDasharray={`${progress} 1`} strokeDashoffset={0} pathLength={1} filter="url(#gf)" />
      {/* 실제 색상 */}
      <Path d={CIRCUIT_PATH} fill="none" stroke="url(#cGrad)" strokeWidth={5} strokeMiterlimit={10} strokeLinecap="butt" strokeDasharray={`${progress} 1`} strokeDashoffset={0} pathLength={1} />
    </Svg>
  );
}

export default function RunningScreen({ onStop }: { onStop: () => void }) {
  const {
    distKm, elapsedMs, paceS, sector, prog,
    isPaused, boxBoxActive,
    pauseRun, resumeRun, stopRun, startRun, closeBoxBox,
  } = useRunStore();

  useRunning();
  useEffect(() => { startRun(); }, []);

  const cfg = COLORS.sector[sector];

  // Figma inset → 절대좌표 변환
  // 서킷: top=55.15% right=17.11% bottom=24.26% left=13.18%
  const circuitTop    = SH * 0.5515;
  const circuitLeft   = SW * 0.1318;
  const circuitRight  = SW * 0.1711;
  const circuitBottom = SH * 0.2426;
  const circuitW      = SW - circuitLeft - circuitRight;
  const circuitH      = SH - circuitTop - circuitBottom;

  // 체커기: top=55.15% right=20.79% bottom=33.52% left=38.87%
  const checkerTop  = SH * 0.5515;
  const checkerLeft = SW * 0.3887;

  // 네임태그: Figma left=215 top=577 w=35 h=18
  const ntLeft = s(215);
  const ntTop  = t(577);

  return (
    <View style={st.container}>

      {/* 국기: left=39 top=177 */}
      <View style={{ position: 'absolute', left: s(39), top: t(177) }}>
        <ChinaFlag />
      </View>

      {/* 서킷명: left=61 top=174 */}
      <Text style={[st.circuitName, { left: s(61), top: t(174) }]}>
        Shanghai {CIRCUIT_KM}km
      </Text>

      {/* 거리숫자: left=36 top=174 fontSize=130 */}
      <Text style={[st.dist, { color: cfg.start, left: s(36), top: t(174) }]}>
        {fmtDist(distKm)}
      </Text>

      {/* TIME 라벨: left=41 top=352 */}
      <Text style={[st.lbl, { left: s(41), top: t(352) }]}>TIME</Text>
      {/* TIME 값: left=41 top=377 */}
      <Text style={[st.val, { left: s(41), top: t(377) }]}>{fmtTime(elapsedMs)}</Text>

      {/* PACE 라벨: left=274 top=352 */}
      <Text style={[st.lbl, { left: s(274), top: t(352) }]}>PACE</Text>
      {/* PACE 값: left=274 top=377 */}
      <Text style={[st.val, { left: s(274), top: t(377) }]}>{fmtPace(paceS)}</Text>

      {/* 서킷 맵 */}
      <View style={{
        position: 'absolute',
        top: circuitTop,
        left: circuitLeft,
        width: circuitW,
        height: circuitH,
      }}>
        <CircuitSvg progress={prog} colorStart={cfg.start} colorEnd={cfg.end} />
      </View>

      {/* 체커기: top=55.15% left=38.87% */}
      <View style={{ position: 'absolute', top: checkerTop, left: checkerLeft }}>
        <CheckerFlag />
      </View>

      {/* 네임태그: left=215 top=577 */}
      <View style={{ position: 'absolute', left: ntLeft, top: ntTop }}>
        <NameTag label="LEC" colorStart={cfg.start} colorEnd={cfg.end} />
      </View>

      {/* 버튼: left=161 top=753 size=76 */}
      <View style={{
        position: 'absolute',
        top: t(753),
        left: 0, right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: s(24),
      }}>
        {isPaused ? (
          <>
            <TouchableOpacity onPress={() => { stopRun(); onStop(); }}>
              <RunningButton type="stop" sector={sector} color={cfg.start} size={s(76)} />
            </TouchableOpacity>
            <TouchableOpacity onPress={resumeRun}>
              <RunningButton type="play" sector={sector} color={cfg.start} size={s(76)} />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={pauseRun}>
            <RunningButton type="pause" sector={sector} color={cfg.start} size={s(76)} />
          </TouchableOpacity>
        )}
      </View>

      {/* BOX BOX */}
      <BoxBoxSheet visible={boxBoxActive} onClose={closeBoxBox} />
    </View>
  );
}

const st = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17171C',
  },
  circuitName: {
    position: 'absolute',
    fontFamily: 'Formula1-Regular',
    fontSize: s(13),
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: -0.65,
    includeFontPadding: false,
  },
  dist: {
    position: 'absolute',
    fontFamily: 'Formula1-Black',
    fontSize: s(130),
    lineHeight: t(156),
    letterSpacing: 6.5,
    includeFontPadding: false,
  },
  lbl: {
    position: 'absolute',
    fontFamily: 'Formula1-Regular',
    fontSize: s(13),
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: -0.65,
    includeFontPadding: false,
  },
  val: {
    position: 'absolute',
    fontFamily: 'Formula1-Bold',
    fontSize: s(30),
    lineHeight: t(36),
    color: '#FFFFFF',
    includeFontPadding: false,
  },
});
