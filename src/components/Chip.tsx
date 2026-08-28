import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import theme from '../theme';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  scale: number;
};

/**
 * The check is not decoration. Selection signalled by fill colour alone fails
 * SC 1.4.1, so the shape has to change too.
 */
export default function Chip({label, selected, onPress, scale}: Props) {
  const s = (n: number) => n * scale;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{checked: selected}}
      accessibilityLabel={label}
      style={({pressed}) => [
        styles.base,
        selected ? styles.on : styles.off,
        {
          height: Math.max(theme.hit, s(54)),
          borderRadius: s(16),
          paddingHorizontal: s(16),
          gap: s(8),
          opacity: pressed ? 0.85 : 1,
        },
      ]}>
      <View style={{width: s(14)}}>
        {selected && (
          <Svg width={s(14)} height={s(14)} viewBox="0 0 14 14">
            <Path
              d="M2.5 7.4 L5.6 10.5 L11.5 4"
              stroke={theme.text.onAction}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        )}
      </View>
      <Text
        style={[
          styles.label,
          {fontSize: s(13)},
          selected ? styles.labelOn : styles.labelOff,
        ]}
        numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {flexDirection: 'row', alignItems: 'center'},
  on: {backgroundColor: theme.surface.action},
  off: {
    backgroundColor: theme.surface.card,
    borderWidth: 1,
    borderColor: theme.line.rule,
  },
  label: {flex: 1, fontFamily: theme.font.body},
  labelOn: {color: theme.text.onAction},
  labelOff: {color: theme.text.primary},
});
