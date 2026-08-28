import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text} from 'react-native';
import theme from '../theme';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'filled' | 'outlined';
  busy?: boolean;
  scale: number;
};

/**
 * Always enabled. Validation happens on press and errors land on the offending
 * field — a greyed-out button with no explanation leaves people stuck with no
 * way to find out why.
 */
export default function PillButton({
  label,
  onPress,
  variant = 'filled',
  busy,
  scale,
}: Props) {
  const s = (n: number) => n * scale;
  const outlined = variant === 'outlined';

  return (
    <Pressable
      onPress={onPress}
      disabled={busy}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({pressed}) => [
        styles.base,
        outlined ? styles.outlined : styles.filled,
        {
          height: Math.max(theme.hit, s(54)),
          borderRadius: s(27),
          opacity: busy ? 0.6 : pressed ? 0.85 : 1,
        },
      ]}>
      {busy ? (
        <ActivityIndicator
          size="small"
          color={outlined ? theme.text.primary : theme.text.onAction}
        />
      ) : (
        <Text
          style={[
            styles.label,
            {fontSize: s(14)},
            outlined ? styles.labelOutlined : styles.labelFilled,
          ]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {alignItems: 'center', justifyContent: 'center'},
  filled: {backgroundColor: theme.surface.action},
  outlined: {
    backgroundColor: theme.surface.card,
    borderWidth: 1,
    borderColor: theme.line.rule,
  },
  label: {fontFamily: theme.font.body, fontWeight: '500'},
  labelFilled: {color: theme.text.onAction},
  labelOutlined: {color: theme.text.primary},
});
