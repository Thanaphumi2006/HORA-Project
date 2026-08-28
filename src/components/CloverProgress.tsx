import React, {useEffect, useRef, useState} from 'react';
import {AccessibilityInfo, Animated, Easing, View} from 'react-native';
import Svg, {G, Path} from 'react-native-svg';
import theme from '../theme';

type Props = {
  /** How many of the four leaves are filled, 0-4. */
  filled: number;
  size: number;
};

/**
 * One leaf, apex at the centre (50,49) and lobes reaching up. The four are the
 * same path rotated, so they stay identical.
 */
const LEAF =
  'M50,49 C44,43 37,37 37,29 C37,23.5 41.5,20 45,22.5 C47,24 49,26.5 50,29.5 ' +
  'C51,26.5 53,24 55,22.5 C58.5,20 63,23.5 63,29 C63,37 56,43 50,49 Z';

const ANGLES = [-45, 45, 135, 225];

const AnimatedG = Animated.createAnimatedComponent(G);

/**
 * Progress as a four-leaf clover, echoing the one the kitsune is holding.
 * Each completed step fills another leaf.
 */
export default function CloverProgress({filled, size}: Props) {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then(v => {
      if (alive) {
        setReduceMotion(v);
      }
    });
    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);

  // Per-leaf fade. SVG props are not native-driver safe, so this one runs in JS.
  const fades = useRef(ANGLES.map(() => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(
      reduceMotion ? 0 : 130,
      fades.map((v, i) =>
        Animated.timing(v, {
          toValue: i < filled ? 1 : 0,
          duration: reduceMotion ? 0 : 460,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ),
    ).start();
  }, [filled, reduceMotion, fades]);

  // Earning a leaf springs the whole clover — this rides on the native driver,
  // so the flourish stays smooth while the SVG fade runs in JS.
  const pop = useRef(new Animated.Value(1)).current;
  const tilt = useRef(new Animated.Value(1)).current;
  const previous = useRef(filled);

  useEffect(() => {
    const gained = filled > previous.current;
    previous.current = filled;
    if (!gained || reduceMotion) {
      return;
    }
    pop.setValue(0.72);
    tilt.setValue(0);
    Animated.parallel([
      Animated.spring(pop, {
        toValue: 1,
        friction: 3.6,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.timing(tilt, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.back(2.2)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [filled, reduceMotion, pop, tilt]);

  const rotate = tilt.interpolate({
    inputRange: [0, 1],
    outputRange: ['-24deg', '0deg'],
  });

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{now: filled, min: 0, max: 4}}
      accessibilityLabel={`Step ${filled} of 4`}>
      <Animated.View style={{transform: [{scale: pop}, {rotate}]}}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          {/* outlines: the full clover is always present, so progress reads as
              filling in rather than as leaves appearing from nowhere */}
          {ANGLES.map(a => (
            <G key={`o${a}`} rotation={a} origin="50, 50">
              <Path
                d={LEAF}
                fill="none"
                stroke={theme.line.rule}
                strokeWidth={3}
                strokeLinejoin="round"
              />
            </G>
          ))}

          {ANGLES.map((a, i) => (
            <AnimatedG key={`f${a}`} rotation={a} origin="50, 50" opacity={fades[i]}>
              <Path d={LEAF} fill={theme.text.primary} />
            </AnimatedG>
          ))}

          {/* stem */}
          <Path
            d="M50,52 C50,64 48,74 43,84"
            fill="none"
            stroke={theme.line.rule}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}
