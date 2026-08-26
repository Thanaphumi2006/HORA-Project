import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Svg, {Circle, Path} from 'react-native-svg';
import theme from '../theme';

type Props = {met: boolean; label: string; scale: number};

/**
 * A single live password rule.
 *
 * The circle changes SHAPE as well as colour — hollow ring to filled disc with
 * a check. Signalling state by colour alone fails SC 1.4.1 for anyone who
 * cannot distinguish the two tones.
 */
export default function Requirement({met, label, scale}: Props) {
  const s = (n: number) => n * scale;
  const size = s(13);

  return (
    <View
      accessible
      accessibilityLabel={`${label}. ${met ? 'Met' : 'Not met yet'}`}
      style={[styles.row, {gap: s(8), paddingVertical: s(3)}]}>
      <Svg width={size} height={size} viewBox="0 0 13 13">
        {met ? (
          <>
            <Circle cx="6.5" cy="6.5" r="6.5" fill={theme.text.primary} />
            <Path
              d="M3.5 6.9 L5.6 9 L9.5 4.5"
              stroke={theme.text.onAction}
              strokeWidth={1.7}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        ) : (
          <Circle
            cx="6.5"
            cy="6.5"
            r="5.85"
            stroke={theme.line.rule}
            strokeWidth={1.3}
            fill="none"
          />
        )}
      </Svg>
      <Text
        style={{
          fontFamily: theme.font.body,
          fontSize: s(11.5),
          color: met ? theme.text.primary : theme.text.secondary,
        }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center'},
});
