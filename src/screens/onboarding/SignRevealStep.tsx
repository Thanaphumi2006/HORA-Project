import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import theme, {getScale} from '../../theme';
import TopWave from '../../components/TopWave';
import StepChrome from '../../components/StepChrome';
import {signFor} from '../../lib/zodiac';
import {ZODIAC_ART} from '../../assets/zodiac';
import MoonTapCTA from '../../components/MoonTapCTA';

type Props = {
  month: number;
  day: number;
  onNext: () => void;
  onBack: () => void;
};

/**
 * Pays off the date-of-birth request immediately, which is why it is its own
 * screen. The progress bar deliberately does not advance — nothing was asked.
 */
export default function SignRevealStep({month, day, onNext, onBack}: Props) {
  const {width} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scale = getScale(width);
  const s = (n: number) => n * scale;
  const sign = signFor(month, day);
  const art = ZODIAC_ART[sign.name.toLowerCase()];

  return (
    <View style={styles.root}>
      <TopWave width={width} height={s(146)} />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + s(44),
          paddingBottom: insets.bottom + s(24),
        }}
        showsVerticalScrollIndicator={false}>
        <StepChrome step={1} onBack={onBack} scale={scale} leaves={3} />

        <View style={{height: s(26)}} />

        <View style={[styles.centre, {marginTop: s(30)}]}>
          <Text style={[styles.eyebrow, {fontSize: s(18)}]}>You are</Text>

          <View
            style={[
              styles.card,
              {
                width: s(176),
                height: s(252),
                borderRadius: s(16),
                marginTop: s(14),
              },
            ]}>
            <View style={[styles.inset, {margin: s(10), borderRadius: s(10)}]}>
              {!!art && (
                <Image
                  source={art}
                  accessible={false}
                  resizeMode="contain"
                  style={{width: s(112), height: s(112)}}
                />
              )}
              <Text
                style={[styles.sign, {fontSize: s(28), marginTop: s(4)}]}
                numberOfLines={1}
                adjustsFontSizeToFit>
                {sign.name}
              </Text>
              <Text style={[styles.range, {fontSize: s(11), marginTop: s(4)}]}>
                {sign.range}
              </Text>
            </View>
          </View>

          {/* Unattributed by design. */}
          <Text
            style={[
              styles.quote,
              {fontSize: s(15), marginTop: s(22), marginHorizontal: s(32)},
            ]}>
            {'\u201C'}{sign.quote}{'\u201D'}
          </Text>
        </View>

        <View style={styles.flex} />

      </ScrollView>
      <MoonTapCTA label="Continue" hint="Continue" onPress={onNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  // transparent: ProfileSetup paints the ground and the moon behind
  root: {flex: 1},
  flex: {flex: 1},
  centre: {alignItems: 'center'},
  eyebrow: {fontFamily: theme.font.body, color: theme.text.secondary},
  card: {
    backgroundColor: theme.surface.waveFront,
    borderWidth: 1,
    borderColor: theme.line.rule,
  },
  inset: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.surface.waveBack,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sign: {fontFamily: theme.font.display, color: theme.text.primary, textAlign: 'center'},
  range: {fontFamily: theme.font.body, color: theme.text.secondary},
  quote: {
    // same face as the "You are" eyebrow
    fontFamily: theme.font.body,
    color: theme.text.primary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
