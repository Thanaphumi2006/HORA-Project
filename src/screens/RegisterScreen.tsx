import React, {useEffect, useRef, useState} from 'react';
import {
  AccessibilityInfo,
  Modal,
  ActivityIndicator,
  Animated,
  Easing,
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
import theme, {getScale} from '../theme';
import TopWave from '../components/TopWave';
import BottomWave from '../components/BottomWave';
import Field from '../components/Field';
import Requirement from '../components/Requirement';
import TermsScreen from './TermsScreen';

type Props = {
  onSubmit: (email: string, password: string) => void;
  onGoogle: () => void;
  onLogin: () => void;
  googleBusy?: boolean;
};

/**
 * Mirrors the login screen, with the differences account creation needs:
 * Google above the form (it is the path most people take), live password rules
 * instead of a confirm field, and consent at the point of creation.
 */
export default function RegisterScreen({
  onSubmit,
  onGoogle,
  onLogin,
  googleBusy,
}: Props) {
  const {width, height} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scale = getScale(width);
  const s = (n: number) => n * scale;
  /**
   * A 640dp-tall screen cannot hold this form at full rhythm — the primary
   * button fell off the bottom edge. Vertical spacing tightens; horizontal
   * spacing, type colour and touch targets are untouched.
   */
  const compact = height < 700;
  const v = (n: number) => s(compact ? n * 0.55 : n);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{e?: string; p?: string}>({});
  const [termsOpen, setTermsOpen] = useState(false);

  const longEnough = password.length >= 8;
  const hasNumber = /\d/.test(password);

  // The rules expand in rather than popping, so the fields below slide down
  // instead of jumping. Height cannot run on the native driver, so this one
  // animation is JS-driven.
  const showRules = password.length > 0;
  const reveal = useRef(new Animated.Value(0)).current;
  const [rulesHeight, setRulesHeight] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then(v => {
      if (alive) {
        setReduceMotion(v);
      }
    });
    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);

  useEffect(() => {
    Animated.timing(reveal, {
      toValue: showRules ? 1 : 0,
      duration: reduceMotion ? 0 : 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [showRules, reduceMotion, reveal]);

  const submit = () => {
    const next: {e?: string; p?: string} = {};
    const at = email.indexOf('@');
    if (!email.trim()) {
      next.e = 'Add your email';
    } else if (at < 1 || email.indexOf('.', at) < 0) {
      next.e = 'Check your email';
    }
    if (!longEnough) {
      next.p = 'At least 8 characters';
    } else if (!hasNumber) {
      next.p = 'Add a number';
    }
    setErrors(next);
    if (!next.e && !next.p) {
      onSubmit(email.trim(), password);
    }
  };

  // one column: every element shares this inset
  const column = {marginLeft: s(24), marginRight: s(24)};

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.surface.waveFront} />
      <TopWave width={width} height={s(176)} />
      <BottomWave width={width} height={s(124)} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top + v(8),
            paddingBottom: insets.bottom + s(24),
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* 1. header */}
          <View style={[styles.header, column]}>
            <Text
              style={[
                styles.wordmark,
                {fontSize: s(15), letterSpacing: s(4)},
              ]}>
              HORA
            </Text>
            <Pressable
              onPress={onLogin}
              hitSlop={14}
              accessibilityRole="button"
              accessibilityLabel="Go to login"
              style={styles.hit}>
              <Text style={[styles.link, {fontSize: s(12.5)}]}>Log in</Text>
            </Pressable>
          </View>

          {/* 2 + 3. title and the reassurance line */}
          <Text style={[styles.title, column, {fontSize: s(compact ? 32 : 42), marginTop: v(48)}]}>
            Create account
          </Text>
          <Text style={[styles.sub, column, {fontSize: s(12), marginTop: v(6)}]}>
            Free. You'll set up your profile next.
          </Text>

          {/* 4. Google first — the path most people take */}
          <Pressable
            onPress={onGoogle}
            disabled={googleBusy}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
            style={({pressed}) => [
              styles.outlinePill,
              column,
              {
                height: Math.max(theme.hit, s(compact ? 48 : 54)),
                borderRadius: s(27),
                marginTop: v(22),
                opacity: googleBusy ? 0.6 : pressed ? 0.9 : 1,
              },
            ]}>
            {googleBusy ? (
              <ActivityIndicator size="small" color={theme.text.primary} />
            ) : (
              <Text style={[styles.outlineLabel, {fontSize: s(13.5)}]}>
                Continue with Google
              </Text>
            )}
          </Pressable>

          {/* 5. divider */}
          <View style={[styles.dividerRow, column, {marginTop: v(18), gap: s(12)}]}>
            <View style={styles.rule} />
            <Text style={[styles.sub, {fontSize: s(11)}]}>or</Text>
            <View style={styles.rule} />
          </View>

          {/* 6 + 7. the form */}
          <View style={[column, {marginTop: v(18)}]}>
            <Field
              fullWidth
              label="Email"
              value={email}
              onChangeText={v => {
                setEmail(v);
                if (errors.e) {
                  setErrors(p => ({...p, e: undefined}));
                }
              }}
              error={errors.e}
              scale={scale}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
            />

            <View style={{height: v(18)}} />

            <Field
              fullWidth
              label="Password"
              value={password}
              onChangeText={v => {
                setPassword(v);
                if (errors.p) {
                  setErrors(p => ({...p, p: undefined}));
                }
              }}
              error={errors.p}
              secure
              scale={scale}
              autoCapitalize="none"
              autoComplete="new-password"
              textContentType="newPassword"
            />

            {/* 8. rules stay out of the way until there is a password to judge */}
            <Animated.View
              style={{
                overflow: 'hidden',
                opacity: reveal,
                height: rulesHeight
                  ? reveal.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, rulesHeight],
                    })
                  : 0,
              }}>
              <View
                onLayout={e => {
                  const h = e.nativeEvent.layout.height;
                  if (h > 0 && h !== rulesHeight) {
                    setRulesHeight(h);
                  }
                }}
                style={{paddingTop: v(10)}}>
                <Requirement met={longEnough} label="At least 8 characters" scale={scale} />
                <Requirement met={hasNumber} label="Contains a number" scale={scale} />
              </View>
            </Animated.View>
          </View>

          {/* 9. consent, at the point of creation */}
          <View style={[column, {marginTop: v(14)}]}>
            <Text style={[styles.sub, {fontSize: s(11)}]}>
              By creating an account you agree to our
            </Text>
            <View style={[styles.termsRow, {gap: s(6)}]}>
              <Pressable
                onPress={() => setTermsOpen(true)}
                accessibilityRole="link"
                accessibilityLabel="Read the Terms and Conditions"
                hitSlop={14}
                style={styles.hit}>
                <Text style={[styles.link, {fontSize: s(11)}]}>Terms</Text>
              </Pressable>
              <Text style={[styles.sub, {fontSize: s(11)}]}>and</Text>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel="Privacy Policy"
                hitSlop={14}
                style={styles.hit}>
                <Text style={[styles.link, {fontSize: s(11)}]}>Privacy Policy</Text>
              </Pressable>
            </View>
          </View>

          {/* 10. always enabled — errors land on the fields, not on a dead button */}
          <Pressable
            onPress={submit}
            accessibilityRole="button"
            accessibilityLabel="Create account"
            style={({pressed}) => [
              styles.primaryPill,
              column,
              {
                height: Math.max(theme.hit, s(compact ? 48 : 54)),
                borderRadius: s(27),
                marginTop: v(20),
                opacity: pressed ? 0.85 : 1,
              },
            ]}>
            <Text style={[styles.primaryLabel, {fontSize: s(14)}]}>Create account</Text>
          </Pressable>

          {/* 11. explicit spacer — marginTop:'auto' is unreliable in a ScrollView */}
          <View style={{flex: 1, minHeight: v(24)}} />

          <View style={[styles.footer, {gap: s(5), paddingVertical: v(8)}]}>
            <Text style={[styles.footerText, {fontSize: s(12.5)}]}>
              Already have an account?
            </Text>
            <Pressable
              onPress={onLogin}
              hitSlop={14}
              accessibilityRole="button"
              accessibilityLabel="Go to login"
              style={styles.hit}>
              <Text style={[styles.link, {fontSize: s(12.5)}]}>Log in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal
        visible={termsOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setTermsOpen(false)}>
        <TermsScreen onClose={() => setTermsOpen(false)} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: theme.surface.screen},
  flex: {flex: 1},
  header: {flexDirection: 'row', alignItems: 'center'},
  hit: {minHeight: theme.hit, justifyContent: 'center'},
  wordmark: {
    flex: 1,
    fontFamily: theme.font.display,
    color: theme.text.primary,
  },
  link: {
    fontFamily: theme.font.body,
    color: theme.text.primary,
    textDecorationLine: 'underline',
  },
  title: {fontFamily: theme.font.display, color: theme.text.primary},
  sub: {fontFamily: theme.font.body, color: theme.text.secondary},
  outlinePill: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.surface.card,
    borderWidth: 1,
    borderColor: theme.line.rule,
  },
  outlineLabel: {fontFamily: theme.font.body, color: theme.text.primary},
  dividerRow: {flexDirection: 'row', alignItems: 'center'},
  rule: {flex: 1, height: 1, backgroundColor: theme.line.hairline},
  termsRow: {flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'},
  primaryPill: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.surface.action,
  },
  primaryLabel: {
    fontFamily: theme.font.body,
    color: theme.text.onAction,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // primary, not secondary: secondary is only 4.39:1 over the bottom wave
  footerText: {fontFamily: theme.font.body, color: theme.text.primary},
});
