import React, {useEffect, useRef, useState} from 'react';
import {AccessibilityInfo, Animated, Easing} from 'react-native';
import Svg, {Circle, Path} from 'react-native-svg';
import {palette} from '../theme';

/** [cx, cy, r, opacity] in the 64x64 viewBox; centre is (32,32), radius 30. */
const CRATERS: ReadonlyArray<[number, number, number, number]> = [
  // outer band — these are the ones that actually cross the visible arc
  [32, 7, 3.2, 0.22],
  [45, 13, 2.4, 0.18],
  [18, 12, 2.8, 0.2],
  [52, 26, 2.6, 0.17],
  [11, 27, 2.2, 0.17],
  [50, 44, 3.0, 0.19],
  [16, 46, 2.6, 0.18],
  [33, 57, 2.8, 0.2],
  // mid field
  [24, 20, 4.6, 0.2],
  [41, 24, 3.4, 0.17],
  [28, 41, 5.0, 0.18],
  [44, 38, 2.8, 0.15],
  [20, 34, 3.0, 0.16],
  // specks
  [37, 15, 1.4, 0.16],
  [26, 12, 1.2, 0.15],
  [48, 33, 1.3, 0.14],
  [14, 20, 1.1, 0.14],
  [39, 49, 1.5, 0.15],
  [23, 50, 1.3, 0.14],
];

type Props = {
  size: number;
  /** Defaults to the lavender mark; pass palette.hairline for the pale backdrop. */
  color?: string;
  /** Attendant stars read as clutter at backdrop scale. */
  showStars?: boolean;
  /** 'full' is a cratered disc — a bare circle would look static while spinning. */
  variant?: 'crescent' | 'full';
};

/**
 * Slowly rotating crescent, sat at the foot of the reading loader.
 *
 * Decoration only — the determinate rule above it carries the actual progress.
 * Rotation is suppressed under reduced motion; the crescent still renders.
 */
export default function MoonSpinner({
  size,
  color = palette.lavenderMid,
  showStars = true,
  variant = 'crescent',
}: Props) {
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

  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduceMotion) {
      spin.stopAnimation();
      spin.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion, spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      accessible={false}
      style={reduceMotion ? null : {transform: [{rotate}]}}>
      <Svg width={size} height={size} viewBox="0 0 64 64">
        {/* Crescent as outer arc + shallower return arc. The return radius must
            stay >= half the chord (28 here) or SVG silently inflates it and the
            shape collapses to a sliver. */}
        {variant === 'full' ? (
          <>
            <Circle cx="32" cy="32" r="30" fill={color} />
            {/* Craters give the disc something to rotate. Many sit near the rim
                on purpose — only the outer band is ever on screen, so inner
                detail would spend the whole cycle below the fold. */}
            {CRATERS.map(([cx, cy, r, o], i) => (
              <Circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill={palette.lavenderMid}
                fillOpacity={o}
              />
            ))}
          </>
        ) : (
          <Path
            d="M32 4 A28 28 0 1 0 32 60 A36 36 0 0 1 32 4 Z"
            fill={color}
          />
        )}
        {showStars && (
          <>
            {/* attendant stars, so the rotation is legible */}
            <Circle cx="52" cy="16" r="2.6" fill={palette.lavenderPale} />
            <Circle cx="14" cy="46" r="2" fill={palette.lavenderPale} />
          </>
        )}
      </Svg>
    </Animated.View>
  );
}
