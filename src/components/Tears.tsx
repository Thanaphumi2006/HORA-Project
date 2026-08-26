import React from 'react';
import {StyleSheet, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {palette} from '../theme';

type Props = {size: number};

/**
 * Tear overlay for the kitsune, used only on the failure state.
 *
 * The mascot artwork is a single happy PNG, so rather than ask for a second
 * illustration this draws tears on top of it. The offsets are percentages of
 * the mascot box, tuned to the closed eyes in kitsune.png, so they track the
 * art at every scale.
 */
const Drop = ({size}: Props) => (
  <Svg width={size} height={size * 1.4} viewBox="0 0 20 28">
    <Path
      d="M10 1 C10 1 19 14 19 19 C19 24.5 15 27 10 27 C5 27 1 24.5 1 19 C1 14 10 1 10 1 Z"
      fill={palette.waveBack}
      stroke={palette.lavenderMid}
      strokeWidth={1.6}
    />
  </Svg>
);

export default function Tears({size}: Props) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.tear, {left: '24%', top: '52%'}]}>
        <Drop size={size} />
      </View>
      <View style={[styles.tear, {left: '53%', top: '52%'}]}>
        <Drop size={size} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tear: {position: 'absolute'},
});
