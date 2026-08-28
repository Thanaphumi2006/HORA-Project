import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import theme from '../theme';
import CloverProgress from './CloverProgress';

type Props = {
  step: 0 | 1 | 2;
  total?: 3;
  onBack?: () => void;
  onSkip?: () => void;
  scale: number;
  /**
   * Which leaf the flow is on, 1-4. Defaults to step + 1, but SignRevealStep
   * reuses step 1 (it asks nothing) while still being the third screen, so it
   * passes its own.
   */
  leaves?: 1 | 2 | 3 | 4;
};

const Chevron = ({size, color}: {size: number; color: string}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M15 5 L8 12 L15 19"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export default function StepChrome({
  step,
  onBack,
  onSkip,
  scale,
  leaves,
}: Props) {
  const s = (n: number) => n * scale;
  const filled = leaves ?? ((step + 1) as 1 | 2 | 3 | 4);

  return (
    <View style={{paddingHorizontal: s(24)}}>
      <View style={styles.row}>
        {onBack && step > 0 ? (
          <Pressable
            onPress={onBack}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Back"
            style={styles.hit}>
            <Chevron size={s(22)} color={theme.text.primary} />
          </Pressable>
        ) : (
          <View style={styles.hit} />
        )}

        {/* lifted out of the row's vertical centre so it sits nearer the top
            edge than the Back and Skip controls */}
        <View style={{marginTop: -s(26)}}>
          <CloverProgress filled={filled} size={s(52)} />
        </View>

        {onSkip ? (
          <Pressable
            onPress={onSkip}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Skip this step"
            style={[styles.hit, styles.hitRight]}>
            <Text style={[styles.skip, {fontSize: s(12.5)}]}>Skip</Text>
          </Pressable>
        ) : (
          <View style={styles.hit} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hit: {minWidth: theme.hit, minHeight: theme.hit, justifyContent: 'center'},
  hitRight: {alignItems: 'flex-end'},
  skip: {
    fontFamily: theme.font.body,
    color: theme.text.primary,
    textDecorationLine: 'underline',
  },
});
