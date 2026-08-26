import React from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import theme from '../theme';

type Props = {width: number; height: number};

/**
 * One sweep in two tones, replacing the four stacked waves in the original.
 * The old version layered pink and lavender at the same opacity, which is why
 * it read as busy — two tones of one hue give depth without the noise.
 *
 * This must be SVG: elliptical border-radius (`0 0 44% 44% / 0 0 30px 30px`)
 * is a CSS-only feature and React Native does not support it.
 */
export default function TopWave({width, height}: Props) {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.wrap]}>
      <Svg
        width={width}
        height={height}
        viewBox="0 0 320 184"
        preserveAspectRatio="none">
        <Path
          d="M0,0 L320,0 L320,110 C244,152 176,172 96,156 C58,148 26,134 0,148 Z"
          fill={theme.surface.waveBack}
          fillOpacity={0.55}
        />
        <Path
          d="M0,0 L320,0 L320,86 C248,124 178,144 100,130 C60,123 26,110 0,122 Z"
          fill={theme.surface.waveFront}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {justifyContent: 'flex-start'},
});
