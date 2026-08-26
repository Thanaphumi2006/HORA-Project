import React, {useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg, {Path} from 'react-native-svg';
import theme, {getScale, getVerticalScale} from '../theme';
import TopWave from '../components/TopWave';
import BottomWave from '../components/BottomWave';
import GoogleMark from '../components/GoogleMark';
import Field from '../components/Field';

type Props = {
  onSubmit: (username: string, password: string) => void;
  onGoogle: () => void;
  onRegister: () => void;
  onGuest: () => void;
  googleBusy?: boolean;
};

const ArrowIcon = ({size, color}: {size: number; color: string}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M4 12h14M12 6l6 6-6 6"
      stroke={color}
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export default function LoginScreen({
  onSubmit,
  onGoogle,
  onRegister,
  onGuest,
  googleBusy,
}: Props) {
  const {width, height} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scale = getScale(width);
  /** Width-driven: type, radii, horizontal padding, the circle diameter. */
  const s = (n: number) => n * scale;
  /** Height-driven: vertical rhythm only. */
  const vs = (n: number) => n * getVerticalScale(height);
  /** Reserved so content never sits on top of the bottom wave. */
  const bottomWaveH = Math.max(s(88), height * 0.1);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{u?: string; p?: string}>({});

  const submit = () => {
    const next: {u?: string; p?: string} = {};
    if (!username.trim()) {
      next.u = 'Add your username';
    }
    if (password.length < 8) {
      next.p = 'At least 8 characters';
    }
    setErrors(next);
    if (!next.u && !next.p) {
      onSubmit(username.trim(), password);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.surface.waveFront} />
      <TopWave width={width} height={Math.max(s(184), height * 0.22)} />
      <BottomWave width={width} height={bottomWaveH} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top + vs(8),
            paddingBottom: insets.bottom + vs(24) + bottomWaveH,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* wordmark + switch link */}
          <View style={[styles.header, {paddingHorizontal: s(22)}]}>
            <Text
              style={[
                styles.wordmark,
                {fontSize: s(theme.size.wordmark), letterSpacing: s(4)},
              ]}>
              HORA
            </Text>
            <Pressable
              onPress={onRegister}
              hitSlop={14}
              accessibilityRole="button"
              accessibilityLabel="Go to register"
              style={styles.switchHit}>
              <Text style={[styles.switchLink, {fontSize: s(13)}]}>Register</Text>
            </Pressable>
          </View>

          <View style={{paddingHorizontal: s(26), marginTop: vs(64)}}>
            <Text style={[styles.title, {fontSize: s(theme.size.title)}]}>Login</Text>
            <Text style={[styles.tagline, {fontSize: s(theme.size.label), marginTop: vs(5)}]}>
              your daily guide, written in the stars
            </Text>
          </View>

          {/* slab bleeds off the left edge; the circle crashes into its right */}
          <View
            style={[
              styles.slabRow,
              {marginLeft: s(-34), marginRight: s(18), marginTop: vs(24)},
            ]}>
            <View
              style={[
                styles.slab,
                theme.shadow,
                {
                  borderTopRightRadius: s(theme.radius.slab),
                  borderBottomRightRadius: s(theme.radius.slab),
                  paddingVertical: vs(24),
                  paddingRight: s(24),
                  paddingLeft: s(58),
                },
              ]}>
              <Field
                label="Username"
                value={username}
                onChangeText={v => {
                  setUsername(v);
                  if (errors.u) setErrors(e => ({...e, u: undefined}));
                }}
                error={errors.u}
                scale={scale}
                autoCapitalize="none"
                autoComplete="username"
                textContentType="username"
              />
              <View style={{height: vs(18)}} />
              <Field
                label="Password"
                value={password}
                onChangeText={v => {
                  setPassword(v);
                  if (errors.p) setErrors(e => ({...e, p: undefined}));
                }}
                error={errors.p}
                helper="At least 8 characters"
                secure
                scale={scale}
                autoCapitalize="none"
                autoComplete="current-password"
                textContentType="password"
              />
            </View>

            <Pressable
              onPress={submit}
              accessibilityRole="button"
              accessibilityLabel="Log in"
              style={({pressed}) => [
                styles.circle,
                {
                  width: s(80),
                  height: s(80),
                  borderRadius: s(40),
                  marginLeft: s(-40),
                  transform: [{scale: pressed ? 0.94 : 1}],
                },
              ]}>
              <ArrowIcon size={s(30)} color={theme.text.onAction} />
            </Pressable>
          </View>

          {/* second bleeding pill — deliberately a different right inset */}
          <Pressable
            onPress={onGoogle}
            disabled={googleBusy}
            accessibilityRole="button"
            style={({pressed}) => [
              styles.pill,
              theme.shadow,
              {
                marginLeft: s(-34),
                marginRight: s(76),
                marginTop: vs(24),
                borderTopRightRadius: s(theme.radius.pill),
                borderBottomRightRadius: s(theme.radius.pill),
                paddingVertical: vs(15),
                paddingLeft: s(76),
                paddingRight: s(20),
                opacity: googleBusy ? 0.6 : 1,
                transform: [{translateX: pressed ? s(4) : 0}],
              },
            ]}>
            {googleBusy ? (
              <ActivityIndicator size="small" color={theme.text.primary} />
            ) : (
              <View style={[styles.pillRow, {gap: s(10)}]}>
                <GoogleMark size={s(18)} />
                <Text style={[styles.pillText, {fontSize: s(13.5)}]}>
                  Continue with Google
                </Text>
              </View>
            )}
          </Pressable>

          <View style={{flex: 1, minHeight: vs(24)}} />

          <Pressable
            onPress={onGuest}
            hitSlop={14}
            accessibilityRole="button"
            style={{
              alignSelf: 'flex-end',
              justifyContent: 'center',
              minHeight: theme.hit,
              paddingHorizontal: s(26),
              paddingVertical: vs(18),
            }}>
            <Text style={[styles.guest, {fontSize: s(theme.size.meta)}]}>
              Explore as guest
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: theme.surface.screen},
  flex: {flex: 1},
  header: {flexDirection: 'row', alignItems: 'center'},
  switchHit: {minHeight: theme.hit, justifyContent: 'center'},
  wordmark: {
    flex: 1,
    fontFamily: theme.font.display,
    color: theme.text.primary,
  },
  switchLink: {
    fontFamily: theme.font.body,
    color: theme.text.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.line.rule,
  },
  title: {
    fontFamily: theme.font.display,
    color: theme.text.primary,
  },
  tagline: {fontFamily: theme.font.body, color: theme.text.secondary},
  slabRow: {flexDirection: 'row', alignItems: 'center'},
  slab: {flex: 1, backgroundColor: theme.surface.card},
  circle: {
    backgroundColor: theme.surface.action,
    alignItems: 'center',
    justifyContent: 'center',
    // must out-elevate the slab or Android paints it underneath
    elevation: 8,
    zIndex: 2,
  },
  pill: {
    backgroundColor: theme.surface.card,
    alignItems: 'flex-start',
    justifyContent: 'center',
    // vs() can shrink the padding below the 48px target on short screens
    minHeight: theme.hit,
  },
  pillRow: {flexDirection: 'row', alignItems: 'center'},
  pillText: {fontFamily: theme.font.body, color: theme.text.primary},
  guest: {fontFamily: theme.font.body, color: theme.text.secondary},
});
