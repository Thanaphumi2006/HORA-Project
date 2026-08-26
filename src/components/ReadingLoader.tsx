import React, {useEffect, useRef, useState} from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import theme, {getScale, palette} from '../theme';
import {mascot} from '../assets/mascot';
import MoonSpinner from './MoonSpinner';
import Tears from './Tears';

type Props = {
  /** 0-100, driven by real request state. Never faked or eased to a stall. */
  progress: number;
  stage: string;
  /** Optional second line under the stage. */
  stageSub?: string;
  error?: string;
  onRetry?: () => void;
};

/**
 * Shown while a reading is being drawn.
 *
 * The progress rule is information, not decoration, so it keeps filling even
 * when reduced motion is on — only the mascot's float is suppressed.
 */
export default function ReadingLoader({
  progress,
  stage,
  stageSub,
  error,
  onRetry,
}: Props) {
  const {width} = useWindowDimensions();
  const s = (n: number) => n * getScale(width);

  const pct = Math.max(0, Math.min(100, progress));
  const failed = !!error;

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

  const float = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduceMotion) {
      float.stopAnimation();
      float.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion, float]);

  const translateY = float.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  const ruleWidth = width - s(128);
  const moonSize = width * 2.1;

  return (
    <View style={styles.root}>
      {/* pale rotating moon, in place of the wave pattern */}
      <View
        pointerEvents="none"
        style={[styles.moonSlot, {bottom: -moonSize * 0.75}]}>
        <MoonSpinner
          size={moonSize}
          color={palette.hairline}
          showStars={false}
          variant="full"
        />
      </View>

      <View style={styles.centre}>
        <Animated.View
          style={[
            {width: s(148), height: s(181)},
            reduceMotion ? null : {transform: [{translateY}]},
          ]}>
          {mascot && (
            <Image
              source={mascot}
              accessible={false}
              resizeMode="contain"
              style={styles.fill}
            />
          )}
          {failed && <Tears size={s(13)} />}
        </Animated.View>

        {failed ? (
          <Text
            accessibilityLiveRegion="polite"
            style={[styles.stage, styles.danger, {fontSize: s(26), marginTop: s(24)}]}>
            {error}
          </Text>
        ) : (
          <Text
            accessibilityLiveRegion="polite"
            style={[styles.stage, {fontSize: s(26), marginTop: s(24)}]}>
            {stage}
          </Text>
        )}

        {!failed && !!stageSub && (
          <Text style={[styles.stageSub, {fontSize: s(12), marginTop: s(8)}]}>
            {stageSub}
          </Text>
        )}

        {failed ? (
          onRetry && (
            <Pressable
              onPress={onRetry}
              accessibilityRole="button"
              accessibilityLabel="Try again"
              style={({pressed}) => [
                styles.retry,
                {
                  marginTop: s(24),
                  borderRadius: s(theme.radius.pill),
                  paddingHorizontal: s(32),
                  paddingVertical: s(14),
                  opacity: pressed ? 0.85 : 1,
                },
              ]}>
              <Text style={[styles.retryText, {fontSize: s(14)}]}>Try again</Text>
            </Pressable>
          )
        ) : (
          <View
            accessibilityRole="progressbar"
            accessibilityValue={{now: pct, min: 0, max: 100}}
            style={[
              styles.track,
              {width: ruleWidth, marginTop: s(24)},
            ]}>
            <View style={[styles.fillBar, {width: `${pct}%`}]} />
          </View>
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: theme.surface.screen},
  centre: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  moonSlot: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fill: {width: '100%', height: '100%'},
  stage: {
    fontFamily: theme.font.display,
    color: theme.text.primary,
    textAlign: 'center',
  },
  danger: {color: theme.text.danger},
  stageSub: {
    fontFamily: theme.font.body,
    color: theme.text.secondary,
    textAlign: 'center',
  },
  track: {
    height: 2,
    borderRadius: 1,
    backgroundColor: theme.line.hairline,
    overflow: 'hidden',
  },
  fillBar: {
    height: 2,
    borderRadius: 1,
    backgroundColor: theme.text.primary,
  },
  retry: {
    backgroundColor: theme.surface.action,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: theme.hit,
  },
  retryText: {fontFamily: theme.font.body, color: theme.text.onAction},
});
