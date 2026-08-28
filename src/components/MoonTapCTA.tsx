import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
} from 'react-native';
import theme, {getScale} from '../theme';
import {MOON} from './MoonPhase';

type Props = {
  /** Accessible name for the action, e.g. "Continue" or "Finish". */
  label: string;
  /** Visible prompt sitting on the moon. */
  hint: string;
  onPress: () => void;
};

/**
 * The primary action for the onboarding steps: the moon at the foot of the
 * screen is the button.
 *
 * Rendered as an absolutely positioned sibling of each step's ScrollView, not
 * inside it — two reasons. It has to sit ON TOP to receive the touch (MoonPhase
 * itself is mounted behind the steps by ProfileSetup, so it can never be
 * tapped), and being absolute lets it match the moon's visible crown exactly
 * rather than wherever the scroll content happens to end.
 */
export default function MoonTapCTA({label, hint, onPress}: Props) {
  const {width} = useWindowDimensions();
  const s = (n: number) => n * getScale(width);
  // the crown showing above the screen edge, straight from the moon's own geometry
  const visible = width * MOON.sizeRatio * MOON.reveal;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({pressed}) => [
        styles.tap,
        {height: Math.max(theme.hit, visible), opacity: pressed ? 0.6 : 1},
      ]}>
      <Text style={[styles.hint, {fontSize: s(26)}]}>{hint}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    fontFamily: theme.font.displayBold,
    color: theme.text.primary,
    textAlign: 'center',
  },
});
