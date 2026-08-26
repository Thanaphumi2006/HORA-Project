import React from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import theme from '../theme';

type Props = {width: number; height: number};

/**
 * Mirror of TopWave, anchored to the bottom edge.
 *
 * Must be SVG: this silhouette is an elliptical curve, and React Native has no
 * elliptical border-radius (`/` syntax) to fake it with.
 *
 * Callers own the height. The reference is max(s(176), height * 0.19).
 */
export default function BottomWave({width, height}: Props) {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.wrap]}>
      <Svg
        width={width}
        height={height}
        viewBox="0 0 320 190"
        preserveAspectRatio="none">
        <Path
          d="M0,190 L320,190 L320,60 C246,26 176,10 96,26 C58,34 26,50 0,40 Z"
          fill={theme.surface.waveBack}
          fillOpacity={0.5}
        />
        <Path
          d="M0,190 L320,190 L320,88 C248,56 178,40 100,56 C60,64 26,80 0,70 Z"
          fill={theme.surface.waveFront}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {justifyContent: 'flex-end'},
});
