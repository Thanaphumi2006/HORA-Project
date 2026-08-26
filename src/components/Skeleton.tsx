import React, {useEffect, useRef, useState} from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import theme, {getScale} from '../theme';

type Props = {variant: 'reading'};

/**
 * For screens whose shape is already known.
 *
 * Every block sits at its real final position, so content landing swaps tone
 * rather than reflowing. A spinner here would throw away layout information we
 * already have.
 */
export default function Skeleton({variant}: Props) {
  const {width} = useWindowDimensions();
  const s = (n: number) => n * getScale(width);
  const gutter = s(24);
  const contentWidth = width - gutter * 2;

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

  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (reduceMotion) {
      pulse.stopAnimation();
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.55,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion, pulse]);

  if (variant !== 'reading') {
    return null;
  }

  const buttonWidth = (contentWidth - s(12)) / 2;

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.root,
        {paddingHorizontal: gutter, opacity: reduceMotion ? 1 : pulse},
      ]}>
      <View
        style={[styles.block, {width: s(150), height: s(18), borderRadius: s(9)}]}
      />

      <View
        style={[
          styles.block,
          styles.centred,
          {width: s(176), height: s(264), borderRadius: s(16), marginTop: s(24)},
        ]}
      />

      <View
        style={[
          styles.block,
          styles.centred,
          {width: s(104), height: s(14), borderRadius: s(7), marginTop: s(16)},
        ]}
      />

      <View
        style={[
          styles.block,
          {width: '100%', height: s(12), borderRadius: s(6), marginTop: s(24)},
        ]}
      />
      <View
        style={[
          styles.block,
          {width: '100%', height: s(12), borderRadius: s(6), marginTop: s(12)},
        ]}
      />
      <View
        style={[
          styles.block,
          {width: '55%', height: s(12), borderRadius: s(6), marginTop: s(12)},
        ]}
      />

      <View style={[styles.row, {marginTop: s(24), gap: s(12)}]}>
        <View
          style={[
            styles.block,
            {width: buttonWidth, height: s(56), borderRadius: s(16)},
          ]}
        />
        <View
          style={[
            styles.block,
            {width: buttonWidth, height: s(56), borderRadius: s(16)},
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: theme.surface.screen, justifyContent: 'center'},
  block: {backgroundColor: theme.line.hairline},
  centred: {alignSelf: 'center'},
  row: {flexDirection: 'row'},
});
