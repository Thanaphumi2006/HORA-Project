import React from 'react';
import {Image, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import theme, {getScale} from '../theme';
import TopWave from './TopWave';
import BottomWave from './BottomWave';
import KitsuneMark from './KitsuneMark';
import {mascot} from '../assets/mascot';

/**
 * Cold start only.
 *
 * Deliberately inert — no spinner, no progress, no animation. A cold start has
 * no measurable progress to report, so anything moving here would be theatre.
 * This is the only centred screen in the app.
 */
export default function Splash() {
  const {width, height} = useWindowDimensions();
  const s = (n: number) => n * getScale(width);

  const artW = s(164);
  const artH = s(200);
  // clears the top wave, so the mascot never sits on the lavender
  const topWaveH = Math.max(s(184), height * 0.22);

  return (
    <View style={styles.root}>
      <TopWave width={width} height={topWaveH} />
      <BottomWave width={width} height={Math.max(s(176), height * 0.19)} />

      {/* mascot and lockup read as one group, as in the reference */}
      <View style={[styles.centre, {paddingTop: topWaveH * 0.4}]}>
        <View style={{width: artW, height: artH}}>
          {mascot ? (
            <Image
              source={mascot}
              accessible={false}
              resizeMode="contain"
              style={styles.fill}
            />
          ) : (
            <KitsuneMark width={artW} height={artH} />
          )}
        </View>

        <Text
          style={[
            styles.wordmark,
            {fontSize: s(26), letterSpacing: s(7), marginTop: s(24)},
          ]}>
          HORA
        </Text>
        <Text style={[styles.tagline, {fontSize: s(12), marginTop: s(8)}]}>
          your daily guide, written in the stars
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: theme.surface.screen},
  art: {alignSelf: 'center'},
  centre: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  fill: {width: '100%', height: '100%'},
  wordmark: {
    fontFamily: theme.font.display,
    color: theme.text.primary,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: theme.font.body,
    color: theme.text.secondary,
    textAlign: 'center',
  },
});
