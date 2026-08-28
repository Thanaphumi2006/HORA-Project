import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import theme, {getScale} from '../../theme';
import TopWave from '../../components/TopWave';
import PillButton from '../../components/PillButton';
import {signFor, parseMonth} from '../../lib/zodiac';
import type {Profile} from './ProfileSetup';

type Props = {
  profile: Profile;
  email?: string;
  onSignOut: () => void;
};

/**
 * STAND-IN for the home screen, which does not exist yet.
 *
 * It exists so the flow has an ending and, more importantly, so the app is not
 * a dead end — before this there was no route back to login once setup began.
 * Replace it with the real home screen when there is one.
 */
export default function SetupComplete({profile, email, onSignOut}: Props) {
  const {width} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const s = (n: number) => n * getScale(width);

  const month = parseMonth(profile.month);
  const day = parseInt(profile.day, 10);
  const sign = month ? signFor(month, day || 1) : null;

  return (
    <View style={styles.root}>
      <TopWave width={width} height={s(146)} />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + s(44),
          paddingBottom: insets.bottom + s(24),
          paddingHorizontal: s(24),
        }}
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.q, {fontSize: s(38), marginTop: s(28)}]}>
          {profile.name ? `Welcome, ${profile.name}` : 'Welcome'}
        </Text>
        <Text style={[styles.helper, {fontSize: s(12), marginTop: s(8)}]}>
          Your profile is set up.
        </Text>

        <View style={{height: s(34)}} />

        {!!sign && (
          <View style={[styles.row, {marginBottom: s(14)}]}>
            <Text style={[styles.label, {fontSize: s(11), letterSpacing: s(1.2)}]}>
              SUN SIGN
            </Text>
            <Text style={[styles.value, {fontSize: s(14)}]}>{sign.name}</Text>
          </View>
        )}

        {!!profile.intents.length && (
          <View style={[styles.row, {marginBottom: s(14)}]}>
            <Text style={[styles.label, {fontSize: s(11), letterSpacing: s(1.2)}]}>
              HERE FOR
            </Text>
            <Text style={[styles.value, {fontSize: s(14)}]} numberOfLines={2}>
              {profile.intents.join(', ')}
            </Text>
          </View>
        )}

        {!!email && (
          <View style={styles.row}>
            <Text style={[styles.label, {fontSize: s(11), letterSpacing: s(1.2)}]}>
              ACCOUNT
            </Text>
            <Text style={[styles.value, {fontSize: s(14)}]} numberOfLines={1}>
              {email}
            </Text>
          </View>
        )}

        <View style={styles.flex} />

        <PillButton
          label="Sign out"
          onPress={onSignOut}
          variant="outlined"
          scale={getScale(width)}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: theme.surface.screen},
  flex: {flex: 1},
  q: {fontFamily: theme.font.displayBold, color: theme.text.primary},
  helper: {fontFamily: theme.font.body, color: theme.text.secondary},
  row: {flexDirection: 'row', alignItems: 'baseline'},
  label: {
    fontFamily: theme.font.body,
    color: theme.text.secondary,
    width: '34%',
  },
  value: {flex: 1, fontFamily: theme.font.body, color: theme.text.primary},
});
