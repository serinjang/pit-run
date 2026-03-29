import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Asset } from 'expo-asset';
import { useDistanceDisplayFont } from '../hooks/useDistanceDisplayFont';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const COUNTDOWN_PAGE_MS = 1000;
const DISSOLVE_MS = 120;
const COUNTDOWN_NUMBER_HEIGHT_MULTIPLIER = 0.82;
const DIGIT_OCCUPANCY_Y = 1 / 3;
const DIGIT_TOP_IN_PNG_RATIO = 0.305;
const DESIGN_SCREEN_HEIGHT = 874;
const RUNNING_DISTANCE_TOP = 174;
const SKIP_BOTTOM_OFFSET = 55;

type CountdownValue = 5 | 4 | 3 | 2 | 1 | 0;

const NUMBER_SOURCE: Record<CountdownValue, any> = {
  5: require('../../assets/countdown/number-5.png'),
  4: require('../../assets/countdown/number-4.png'),
  3: require('../../assets/countdown/number-3.png'),
  2: require('../../assets/countdown/number-2.png'),
  1: require('../../assets/countdown/number-1.png'),
  0: require('../../assets/countdown/number-0.png'),
};

const SIGNAL_SOURCE: Record<CountdownValue, any> = {
  5: require('../../assets/countdown/signal-5.png'),
  4: require('../../assets/countdown/signal-4.png'),
  3: require('../../assets/countdown/signal-3.png'),
  2: require('../../assets/countdown/signal-2.png'),
  1: require('../../assets/countdown/signal-1.png'),
  0: require('../../assets/countdown/signal-0.png'),
};

const NUMBER_ASPECT_RATIO: Record<CountdownValue, number> = {
  5: 1024 / 764,
  4: 1024 / 764,
  3: 1024 / 764,
  2: 1024 / 764,
  1: 1024 / 764,
  0: 1792 / 1200,
};

const SIGNAL_ASPECT_RATIO = 1608 / 1056;
const COUNTDOWN_IMAGE_MODULES = [
  NUMBER_SOURCE[5],
  NUMBER_SOURCE[4],
  NUMBER_SOURCE[3],
  NUMBER_SOURCE[2],
  NUMBER_SOURCE[1],
  NUMBER_SOURCE[0],
  SIGNAL_SOURCE[5],
  SIGNAL_SOURCE[4],
  SIGNAL_SOURCE[3],
  SIGNAL_SOURCE[2],
  SIGNAL_SOURCE[1],
  SIGNAL_SOURCE[0],
];

type CountdownScreenProps = {
  onFinish: () => void;
};

export default function CountdownScreen({ onFinish }: CountdownScreenProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [count, setCount] = useState<CountdownValue>(5);
  const [previousCount, setPreviousCount] = useState<CountdownValue | null>(null);
  const [assetsReady, setAssetsReady] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dissolveOpacity = useRef(new Animated.Value(1)).current;
  const finishCalledRef = useRef(false);
  const { lineHeight, sampleText, onSampleLayout } = useDistanceDisplayFont(screenWidth);

  const finishCountdown = () => {
    if (finishCalledRef.current) return;
    finishCalledRef.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    onFinish();
  };

  useEffect(() => {
    let mounted = true;

    Asset.loadAsync(COUNTDOWN_IMAGE_MODULES)
      .then(() => {
        if (mounted) setAssetsReady(true);
      })
      .catch(() => {
        if (mounted) setAssetsReady(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!assetsReady) return;

    setCount(5);
    setPreviousCount(null);
    dissolveOpacity.setValue(1);
    finishCalledRef.current = false;

    const tick = (n: CountdownValue) => {
      timeoutRef.current = setTimeout(() => {
        if (n <= 0) {
          finishCountdown();
          return;
        }

        const next = (n - 1) as CountdownValue;
        setPreviousCount(n);
        setCount(next);
        dissolveOpacity.setValue(0);
        Animated.timing(dissolveOpacity, {
          toValue: 1,
          duration: DISSOLVE_MS,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) setPreviousCount(null);
        });
        tick(next);
      }, COUNTDOWN_PAGE_MS);
    };

    tick(5);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      dissolveOpacity.stopAnimation();
    };
  }, [assetsReady, dissolveOpacity, onFinish]);

  const renderNumberLayer = useMemo(
    () => (value: CountdownValue, opacity: number | Animated.AnimatedInterpolation<number>) => {
      // The visible digit occupies roughly 1/5 width and 1/3 height inside PNG.
      // So we scale PNG size by the inverse occupancy to match digit size with running text.
      const targetDigitHeight = lineHeight * COUNTDOWN_NUMBER_HEIGHT_MULTIPLIER;
      const numberHeight = targetDigitHeight / DIGIT_OCCUPANCY_Y;
      const numberWidth = numberHeight * NUMBER_ASPECT_RATIO[value];
      const targetDigitTop = (screenHeight * RUNNING_DISTANCE_TOP) / DESIGN_SCREEN_HEIGHT;
      const numberTop = targetDigitTop - numberHeight * DIGIT_TOP_IN_PNG_RATIO;

      return (
        <Animated.View style={[styles.layer, { opacity }]} pointerEvents="none">
          <Image
            source={NUMBER_SOURCE[value]}
            style={[
              styles.numberImage,
              {
                width: numberWidth,
                height: numberHeight,
                left: (screenWidth - numberWidth) / 2,
                top: numberTop,
              },
            ]}
            resizeMode="contain"
          />
        </Animated.View>
      );
    },
    [lineHeight, screenHeight, screenWidth]
  );

  const currentSignalLayer = useMemo(() => {
    const targetDigitHeight = lineHeight * COUNTDOWN_NUMBER_HEIGHT_MULTIPLIER;
    const numberHeight = targetDigitHeight / DIGIT_OCCUPANCY_Y;
    const targetDigitTop = (screenHeight * RUNNING_DISTANCE_TOP) / DESIGN_SCREEN_HEIGHT;
    const numberTop = targetDigitTop - numberHeight * DIGIT_TOP_IN_PNG_RATIO;
    const signalWidth = screenWidth;
    const signalHeight = signalWidth / SIGNAL_ASPECT_RATIO;

    return (
      <Image
        source={SIGNAL_SOURCE[count]}
        style={[
          styles.signalImage,
          {
            width: signalWidth,
            height: signalHeight,
            top: numberTop + numberHeight,
          },
        ]}
        resizeMode="contain"
      />
    );
  }, [count, lineHeight, screenHeight, screenWidth]);

  const previousOpacity = dissolveOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <View style={styles.container}>
      <Text
        numberOfLines={1}
        allowFontScaling={false}
        onLayout={onSampleLayout}
        style={styles.hiddenMeasure}
      >
        {sampleText}
      </Text>
      {assetsReady && (
        <>
          {currentSignalLayer}
          {previousCount !== null && renderNumberLayer(previousCount, previousOpacity)}
          {renderNumberLayer(count, dissolveOpacity)}
        </>
      )}
      {count > 0 && (
        <Pressable
          onPress={finishCountdown}
          style={[
            styles.skipButton,
            {
              bottom: Math.max((screenHeight * SKIP_BOTTOM_OFFSET) / DESIGN_SCREEN_HEIGHT, insets.bottom + 16),
            },
          ]}
          hitSlop={12}
        >
          <Text style={styles.skipLabel}>Skip</Text>
          <Svg width={20} height={13} viewBox="0 0 20 13" style={styles.skipChevronIcon}>
            <Path
              d="M1.5 1.5L7 6.5L1.5 11.5"
              stroke="#FFFFFF"
              strokeOpacity={0.5}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d="M11.5 1.5L17 6.5L11.5 11.5"
              stroke="#FFFFFF"
              strokeOpacity={0.5}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17171C',
    overflow: 'hidden',
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
  },
  numberImage: {
    position: 'absolute',
  },
  signalImage: {
    position: 'absolute',
    left: 0,
  },
  hiddenMeasure: {
    position: 'absolute',
    opacity: 0,
    left: -9999,
    top: -9999,
    includeFontPadding: false,
    fontFamily: 'Formula1-Black',
    fontSize: 130.2486572265625,
    lineHeight: 156,
    letterSpacing: 6.5,
  },
  skipButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    elevation: 50,
  },
  skipLabel: {
    color: '#FFFFFF',
    opacity: 0.5,
    fontFamily: 'Formula1-Regular',
    fontSize: 24,
    lineHeight: 29,
    letterSpacing: -0.48,
    includeFontPadding: false,
  },
  skipChevronIcon: {
    marginLeft: 4,
  },
});
