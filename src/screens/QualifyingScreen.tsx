import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SvgButton from '../components/SvgButton';
import GradientCtaButton from '../components/GradientCtaButton';
import { getDriverCode } from '../utils/driverCode';

type UserProfile = {
  displayName: string;
  raceNumber: string;
  nameTagAccentColor: string;
};

export type QualifyingResult = {
  warmupMinutes: number;
  oneKmMs: number;
  paceSecPerKm: number;
  grade: 'A' | 'B' | 'C' | 'D';
  nextIntervalHint: string;
};

type QualifyingScreenProps = {
  profile: UserProfile;
  onComplete: (result: QualifyingResult) => void;
};

const RECOMMENDED_WARMUP_MINUTES = 10;
const CTA_HEIGHT = 56;

type Phase = 'intro' | 'warmup' | 'trial' | 'result';

export default function QualifyingScreen({ profile, onComplete }: QualifyingScreenProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [phase, setPhase] = useState<Phase>('intro');
  const [warmupLeftSec, setWarmupLeftSec] = useState(RECOMMENDED_WARMUP_MINUTES * 60);
  const [trialStartedAt, setTrialStartedAt] = useState<number | null>(null);
  const [trialElapsedMs, setTrialElapsedMs] = useState(0);
  const [result, setResult] = useState<QualifyingResult | null>(null);
  const [isTreadmillMode, setIsTreadmillMode] = useState(false);

  const buttonWidth = Math.max(220, width - 56);
  const driverCode = useMemo(() => getDriverCode(profile.displayName), [profile.displayName]);

  useEffect(() => {
    if (phase !== 'warmup') return;
    const timer = setInterval(() => {
      setWarmupLeftSec((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          const now = Date.now();
          setTrialStartedAt(now);
          setTrialElapsedMs(0);
          setPhase('trial');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'trial' || trialStartedAt == null) return;
    const timer = setInterval(() => {
      setTrialElapsedMs(Date.now() - trialStartedAt);
    }, 100);
    return () => clearInterval(timer);
  }, [phase, trialStartedAt]);

  const startWarmup = () => {
    setWarmupLeftSec(RECOMMENDED_WARMUP_MINUTES * 60);
    setTrialStartedAt(null);
    setTrialElapsedMs(0);
    setResult(null);
    setPhase('warmup');
  };

  const startTrialNow = () => {
    const now = Date.now();
    setWarmupLeftSec(0);
    setTrialStartedAt(now);
    setTrialElapsedMs(0);
    setPhase('trial');
  };

  const finishOneKm = () => {
    const oneKmMs = Math.max(1000, trialElapsedMs);
    const next = buildQualifyingResult(oneKmMs);
    setResult(next);
    setPhase('result');
  };

  const confirmAndContinue = () => {
    if (!result) return;
    onComplete(result);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 24 }]}>
      <Text style={styles.title}>QUALIFYING</Text>
      <Text style={styles.subtitle}>Set your baseline pace before interval programs.</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>DRIVER</Text>
          <Text style={styles.value}>{driverCode} #{profile.raceNumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>FLOW</Text>
          <Text style={styles.value}>FLYING LAP {RECOMMENDED_WARMUP_MINUTES} MIN - 1KM TIME TRIAL</Text>
        </View>
        <Text style={styles.help}>
          Warm-up recommendation: easy jog first, then 3-4 short accelerations before the 1km effort.
        </Text>
      </View>

      {phase === 'intro' && (
        <View style={styles.main}>
          <Text style={styles.phaseTitle}>HOW QUALIFYING WORKS</Text>
          <View style={styles.flowRow}>
            <View style={styles.flowCard}>
              <Text style={styles.flowStep}>01</Text>
              <Text style={styles.flowLabel}>WARM-UP</Text>
              <Text style={styles.flowMeta}>{RECOMMENDED_WARMUP_MINUTES} MIN</Text>
            </View>
            <Text style={styles.flowArrow}>-</Text>
            <View style={styles.flowCard}>
              <Text style={styles.flowStep}>02</Text>
              <Text style={styles.flowLabel}>RUN</Text>
              <Text style={styles.flowMeta}>1KM TRIAL</Text>
            </View>
            <Text style={styles.flowArrow}>-</Text>
            <View style={styles.flowCard}>
              <Text style={styles.flowStep}>03</Text>
              <Text style={styles.flowLabel}>GET GRADE</Text>
              <Text style={styles.flowMeta}>A - D</Text>
            </View>
          </View>
          <View style={styles.gradeCard}>
            <Text style={styles.gradeTitle}>GRADE GUIDE (1KM)</Text>
            <View style={styles.gradeBandRow}>
              <Text style={styles.gradeBand}>A {'<='} 4:30</Text>
              <Text style={styles.gradeBand}>B {'<='} 5:30</Text>
              <Text style={styles.gradeBand}>C {'<='} 6:30</Text>
              <Text style={styles.gradeBand}>D {'>'} 6:30</Text>
            </View>
            <Text style={styles.gradeDesc}>
              Your grade sets baseline pace and interval intensity for upcoming running programs.
            </Text>
          </View>
          <Text style={styles.phaseDesc}>
            Start qualifying to measure your current level first. We will use this result to tailor your interval plan.
          </Text>
          <GradientCtaButton
            width={buttonWidth}
            height={CTA_HEIGHT}
            label="START QUALIFYING"
            enabled
            textButtonType="checkbox"
            textButtonLabel="On a Treadmil?"
            textButtonChecked={isTreadmillMode}
            onPressTextButton={() => setIsTreadmillMode((prev) => !prev)}
            onPress={startWarmup}
          />
        </View>
      )}

      {phase === 'warmup' && (
        <View style={styles.main}>
          <Text style={styles.phaseTitle}>FLYING LAP WARM-UP</Text>
          <Text style={styles.timer}>{fmtClock(warmupLeftSec)}</Text>
          <Text style={styles.phaseDesc}>Keep this effort easy. Focus on breathing and cadence.</Text>
          <Pressable onPress={startTrialNow} style={{ width: buttonWidth, height: 52 }}>
            <SvgButton
              width={buttonWidth}
              height={52}
              radius={12}
              fill="rgba(255,255,255,0.06)"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={1}
              textColor="#FFFFFF"
              fontFamily="Formula1-Bold"
              fontSize={14}
              label="START 1KM NOW"
            />
          </Pressable>
        </View>
      )}

      {phase === 'trial' && (
        <View style={styles.main}>
          <Text style={styles.phaseTitle}>1KM TIME TRIAL</Text>
          <Text style={styles.timer}>{fmtStopwatch(trialElapsedMs)}</Text>
          <Text style={styles.phaseDesc}>Push controlled pace. Press FINISH exactly at 1.00km.</Text>
          <Pressable onPress={finishOneKm} style={{ width: buttonWidth, height: 56 }}>
            <SvgButton
              width={buttonWidth}
              height={56}
              radius={12}
              fill="#FCB827"
              stroke="#FCB827"
              strokeWidth={1}
              textColor="#17171C"
              fontFamily="Formula1-Bold"
              fontSize={16}
              label="FINISH 1KM"
            />
          </Pressable>
        </View>
      )}

      {phase === 'result' && result && (
        <View style={styles.main}>
          <Text style={styles.phaseTitle}>QUALIFYING RESULT</Text>
          <Text style={styles.timer}>{fmtStopwatch(result.oneKmMs)}</Text>
          <Text style={styles.resultGrade}>GRADE {result.grade}</Text>
          <Text style={styles.phaseDesc}>{result.nextIntervalHint}</Text>
          <GradientCtaButton
            width={buttonWidth}
            height={56}
            label="CONTINUE TO READY"
            enabled
            onPress={confirmAndContinue}
          />
        </View>
      )}
    </View>
  );
}

function buildQualifyingResult(oneKmMs: number): QualifyingResult {
  const paceSec = oneKmMs / 1000;
  if (paceSec <= 270) {
    return {
      warmupMinutes: RECOMMENDED_WARMUP_MINUTES,
      oneKmMs,
      paceSecPerKm: paceSec,
      grade: 'A',
      nextIntervalHint: 'A Grade: 400m x 6, recovery 90s, target pace 4:45-5:05/km.',
    };
  }
  if (paceSec <= 330) {
    return {
      warmupMinutes: RECOMMENDED_WARMUP_MINUTES,
      oneKmMs,
      paceSecPerKm: paceSec,
      grade: 'B',
      nextIntervalHint: 'B Grade: 400m x 5, recovery 90s, target pace 5:20-5:45/km.',
    };
  }
  if (paceSec <= 390) {
    return {
      warmupMinutes: RECOMMENDED_WARMUP_MINUTES,
      oneKmMs,
      paceSecPerKm: paceSec,
      grade: 'C',
      nextIntervalHint: 'C Grade: 300m x 5, recovery 90-120s, target pace 6:00-6:35/km.',
    };
  }
  return {
    warmupMinutes: RECOMMENDED_WARMUP_MINUTES,
    oneKmMs,
    paceSecPerKm: paceSec,
    grade: 'D',
    nextIntervalHint: 'D Grade: 1min run + 1min walk x 10, then repeat qualifying next week.',
  };
}

function fmtClock(totalSec: number): string {
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function fmtStopwatch(ms: number): string {
  const total = Math.floor(ms / 10);
  const cs = total % 100;
  const sec = Math.floor(total / 100) % 60;
  const min = Math.floor(total / 6000);
  return `${min}:${sec < 10 ? '0' : ''}${sec}.${cs < 10 ? '0' : ''}${cs}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17171C',
    paddingHorizontal: 28,
    gap: 16,
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'Formula1-Black',
    fontSize: 36,
    letterSpacing: 1,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.72)',
    fontFamily: 'Formula1-Regular',
    fontSize: 13,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: '#202028',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    color: 'rgba(255,255,255,0.58)',
    fontFamily: 'Formula1-Regular',
    fontSize: 12,
  },
  value: {
    color: '#FFFFFF',
    fontFamily: 'Formula1-Bold',
    fontSize: 12,
    textAlign: 'right',
    flex: 1,
  },
  help: {
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Formula1-Regular',
    fontSize: 12,
    lineHeight: 18,
  },
  main: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: '#1D1D24',
    paddingHorizontal: 16,
    paddingVertical: 22,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  phaseTitle: {
    color: '#FFFFFF',
    fontFamily: 'Formula1-Bold',
    fontSize: 21,
    textAlign: 'center',
  },
  timer: {
    color: '#FFFFFF',
    fontFamily: 'Formula1-Black',
    fontSize: 54,
    letterSpacing: 1.2,
  },
  phaseDesc: {
    color: 'rgba(255,255,255,0.76)',
    fontFamily: 'Formula1-Regular',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
  },
  flowRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  flowCard: {
    flex: 1,
    minHeight: 82,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    gap: 4,
  },
  flowStep: {
    color: 'rgba(255,255,255,0.52)',
    fontFamily: 'Formula1-Regular',
    fontSize: 10,
  },
  flowLabel: {
    color: '#FFFFFF',
    fontFamily: 'Formula1-Bold',
    fontSize: 11,
  },
  flowMeta: {
    color: '#FCB827',
    fontFamily: 'Formula1-Bold',
    fontSize: 10,
  },
  flowArrow: {
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'Formula1-Bold',
    fontSize: 16,
  },
  gradeCard: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(224,58,62,0.4)',
    backgroundColor: 'rgba(224,58,62,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  gradeTitle: {
    color: '#FFFFFF',
    fontFamily: 'Formula1-Bold',
    fontSize: 11,
  },
  gradeBandRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  gradeBand: {
    color: '#FFFFFF',
    fontFamily: 'Formula1-Regular',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  gradeDesc: {
    color: 'rgba(255,255,255,0.74)',
    fontFamily: 'Formula1-Regular',
    fontSize: 11,
    lineHeight: 16,
  },
  resultGrade: {
    color: '#FCB827',
    fontFamily: 'Formula1-Black',
    fontSize: 30,
    letterSpacing: 1.3,
  },
});
