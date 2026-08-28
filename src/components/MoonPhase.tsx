import React, {useEffect, useRef, useState} from 'react';
import {AccessibilityInfo, Animated, Easing, StyleSheet, View} from 'react-native';
import Svg, {Circle, ClipPath, Defs, Ellipse, G, Path} from 'react-native-svg';
import {palette} from '../theme';

type Props = {
  /** Full diameter. Most of it sits below the screen edge. */
  size: number;
  /** 0 = new moon, 1 = full. Waxes as the flow progresses. */
  progress: number;
  /** Fraction of the disc left visible above the bottom edge. */
  reveal?: number;
};

/** Geometry shared with MoonTapCTA, which centres its label on the moon. */
export const MOON = {sizeRatio: 1.45, reveal: 0.3};

const R = 100;
const CX = 100;
const CY = 100;

/**
 * [cx, cy, r, opacity]. Only the top band of the disc is ever on screen — with
 * a 25% reveal that is roughly x 55-145, y 10-50 in this viewBox — so the
 * detail is concentrated there rather than spread over a hidden sphere.
 */
const CRATERS: ReadonlyArray<[number, number, number, number]> = [
  // the disc narrows sharply toward its crown, so these follow that lens
  [100, 12, 6, 0.18],
  [122, 20, 8, 0.2],
  [80, 22, 7, 0.18],
  [140, 32, 6.5, 0.17],
  [62, 34, 6, 0.17],
  [108, 34, 5, 0.15],
  [88, 44, 7.5, 0.18],
  [128, 48, 6, 0.16],
  [52, 48, 5.5, 0.16],
  [152, 44, 5, 0.15],
  [70, 56, 5, 0.14],
  [110, 56, 6.5, 0.16],
  [142, 58, 4.5, 0.14],
  // specks, for grain rather than shape
  [93, 28, 2.2, 0.15],
  [133, 12, 1.8, 0.13],
  [68, 14, 1.6, 0.12],
  [158, 34, 2, 0.13],
  [45, 40, 1.8, 0.12],
  [118, 40, 1.5, 0.12],
];

/** Broad maria, laid under the craters so the surface is not uniformly flat. */
const MARIA: ReadonlyArray<[number, number, number, number, number]> = [
  [110, 26, 26, 14, 0.07],
  [74, 44, 20, 12, 0.06],
  [140, 50, 18, 11, 0.06],
];

/**
 * The lit region is bounded by the right semicircle plus an elliptical
 * terminator whose width tracks the phase.
 *
 *   rx    = R * |1 - 2p|   — zero at half moon, where the terminator is straight
 *   sweep = 1 past half     — the arc then bulges into the left half (gibbous)
 *           0 before it     — and carves into the right half (crescent)
 */
function litPath(p: number): string {
  const k = 1 - 2 * p;
  const rx = Math.abs(k) * R;
  const sweep = p > 0.5 ? 1 : 0;
  return [
    `M ${CX},${CY - R}`,
    `A ${R},${R} 0 0 1 ${CX},${CY + R}`,
    `A ${rx},${R} 0 0 ${sweep} ${CX},${CY - R}`,
    'Z',
  ].join(' ');
}

/**
 * A large moon rising from the bottom edge, in place of the bottom wave. It
 * doubles as the progress indicator — the further through the flow, the more of
 * it is lit.
 *
 * Mount this ABOVE the steps rather than inside each one: it has to survive
 * step changes for the phase to animate between them instead of cutting.
 */
export default function MoonPhase({size, progress, reveal = 0.25}: Props) {
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

  // The SVG `d` attribute cannot be interpolated on the native driver, so the
  // tween runs in JS and re-renders the path each frame. It is one short
  // transition on a two-element drawing, so the cost is negligible.
  const anim = useRef(new Animated.Value(progress)).current;
  const [p, setP] = useState(progress);

  useEffect(() => {
    const id = anim.addListener(({value}) => setP(value));
    Animated.timing(anim, {
      toValue: progress,
      duration: reduceMotion ? 0 : 800,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start();
    return () => anim.removeListener(id);
  }, [progress, reduceMotion, anim]);

  const lit = Math.max(0, Math.min(1, p));

  return (
    <View
      pointerEvents="none"
      style={[
        styles.wrap,
        {width: size, height: size, marginLeft: -size / 2, bottom: -size * (1 - reveal)},
      ]}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Defs>
          <ClipPath id="lit">
            <Path d={litPath(lit)} />
          </ClipPath>
        </Defs>

        {/* unlit disc */}
        <Circle cx={CX} cy={CY} r={R} fill={palette.lavenderMid} fillOpacity={0.42} />

        {/* faint relief on the unlit side, so the disc never looks flat */}
        {CRATERS.map(([cx, cy, r, o], i) => (
          <Circle
            key={`u${i}`}
            cx={cx}
            cy={cy}
            r={r}
            fill={palette.ink}
            fillOpacity={o * 0.28}
          />
        ))}

        {/* lit crescent through to full */}
        {lit > 0.001 && <Path d={litPath(lit)} fill={palette.onInk} />}

        {/* Surface detail is clipped to the lit region — craters floating on the
            dark side would read as a rendering fault, not a moon. */}
        <G clipPath="url(#lit)">
          {MARIA.map(([cx, cy, rx, ry, o], i) => (
            <Ellipse
              key={`m${i}`}
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              fill={palette.lavenderMid}
              fillOpacity={o}
            />
          ))}
          {CRATERS.map(([cx, cy, r, o], i) => (
            <Circle
              key={`c${i}`}
              cx={cx}
              cy={cy}
              r={r}
              fill={palette.lavenderMid}
              fillOpacity={o}
            />
          ))}
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {position: 'absolute', left: '50%'},
});
