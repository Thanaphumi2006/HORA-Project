/**
 * Login / Register UI — from "App Design 375x812" by Pasariya Vorapanya
 * Cream ground, didone serif, gold accents, neumorphic card, lavender actions.
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import Svg, {Circle, Defs, Ellipse, Path, RadialGradient, Rect, Stop} from 'react-native-svg';
import {SafeAreaProvider, useSafeAreaInsets} from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import hora, {getScale} from './src/theme';
// DEV PREVIEW — delete this line to remove the loading-state preview
import DevLoadingPreview, {DEV_PREVIEW_ENABLED} from './src/devLoadingPreview';
import Splash from './src/components/Splash';
import ReadingLoader from './src/components/ReadingLoader';
import {useDelayedVisible} from './src/hooks/useDelayedVisible';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  GOOGLE_WEB_CLIENT_ID,
  REQUEST_ID_TOKEN,
  isGoogleConfigured,
} from './googleAuthConfig';

const COLORS = {
  screenBg: '#F1ECE2',
  card: '#F6F2E9',
  ink: '#1A150F',
  gold: '#AE9569',
  goldSoft: '#C4AF8A',
  lavender: '#A9A2D4',
  lavenderDeep: '#938BC7',
  waveLavender: '#DEDDF4',
  waveLavenderPale: 'rgba(222, 221, 244, 0.42)',
  wavePink: '#F7DEE6',
  wavePinkPale: 'rgba(247, 222, 230, 0.42)',
  marbleBase: '#F6ECEC',
  marbleBlush: '#F0D5DC',
  marbleMauve: '#E7D8E6',
  avatarTan: '#B49B73',
};

// "The Seasons" (the original Canva font) is Canva-licensed only;
// Prata is the closest freely licensed didone.
const SERIF = 'Prata';

/** What the transition loader says on the way to each screen. */
const TRANSITION_COPY: Record<
  'login' | 'register' | 'profile',
  {stage: string; sub: string}
> = {
  login: {stage: 'Back to login', sub: 'Just a moment'},
  register: {stage: 'Opening register', sub: 'Just a moment'},
  profile: {stage: 'Opening HORA', sub: 'Just a moment'},
};

/** Soft pink-marble backdrop for the profile screen. */
const MarbleBackground = ({width, height}: {width: number; height: number}) => (
  <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <Svg width={width} height={height}>
      <Defs>
        <RadialGradient id="blush" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={COLORS.marbleBlush} stopOpacity="0.9" />
          <Stop offset="100%" stopColor={COLORS.marbleBlush} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="mauve" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={COLORS.marbleMauve} stopOpacity="0.85" />
          <Stop offset="100%" stopColor={COLORS.marbleMauve} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect x="0" y="0" width={width} height={height} fill={COLORS.marbleBase} />
      <Ellipse cx={width * 0.15} cy={height * 0.08} rx={width * 0.7} ry={height * 0.28} fill="url(#blush)" />
      <Ellipse cx={width * 0.9} cy={height * 0.22} rx={width * 0.6} ry={height * 0.24} fill="url(#mauve)" />
      <Ellipse cx={width * 0.5} cy={height * 0.5} rx={width * 0.75} ry={height * 0.3} fill="url(#glow)" />
      <Ellipse cx={width * 0.1} cy={height * 0.78} rx={width * 0.6} ry={height * 0.26} fill="url(#blush)" />
      <Ellipse cx={width * 0.95} cy={height * 0.95} rx={width * 0.65} ry={height * 0.25} fill="url(#mauve)" />
    </Svg>
  </View>
);

type GoogleProfile = {
  name: string | null;
  email: string;
  photo: string | null;
};

type ProfileProps = {
  onLogout: () => void;
  onAction: (msg: string) => void;
  scale: number;
  googleUser: GoogleProfile | null;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = Array.from({length: 31}, (_, i) => String(i + 1));
const YEARS = Array.from({length: 100}, (_, i) => String(new Date().getFullYear() - i));

const ProfileScreen = ({onLogout, onAction, scale, googleUser}: ProfileProps) => {
  const s = (n: number) => n * scale;
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(googleUser?.name ?? '');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');
  const [openPicker, setOpenPicker] = useState<'Month' | 'Day' | 'Year' | null>(null);
  const avatarSize = s(150);

  const pickerOptions =
    openPicker === 'Month' ? MONTHS : openPicker === 'Day' ? DAYS : YEARS;
  const setPicked =
    openPicker === 'Month' ? setMonth : openPicker === 'Day' ? setDay : setYear;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + s(12),
          paddingBottom: insets.bottom + s(32),
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Pressable
          onPress={onLogout}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={googleUser ? 'Sign out' : 'Go back'}
          style={{alignSelf: 'flex-end', paddingRight: s(30), paddingVertical: s(8)}}>
          <Text style={{fontFamily: SERIF, fontSize: s(16), color: COLORS.gold}}>
            {googleUser ? 'Sign out' : 'Back'}
          </Text>
        </Pressable>

        {/* avatar — the Google photo when signed in, else the drawn placeholder */}
        <Pressable
          onPress={() =>
            onAction(
              googleUser ? `Signed in as ${googleUser.email}` : 'Photo picker coming soon',
            )
          }
          accessibilityRole="button"
          accessibilityLabel="Profile photo"
          style={{
            alignSelf: 'center',
            marginTop: s(20),
            width: avatarSize,
            height: avatarSize,
          }}>
        {googleUser?.photo ? (
          <Image
            source={{uri: googleUser.photo}}
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              borderWidth: s(4),
              borderColor: COLORS.avatarTan,
            }}
          />
        ) : (
          <Svg width={avatarSize} height={avatarSize} viewBox="0 0 150 150">
            <Circle cx="75" cy="75" r="72" stroke={COLORS.avatarTan} strokeWidth="4" fill="none" />
            <Circle cx="75" cy="58" r="26" fill={COLORS.avatarTan} />
            <Path d="M27 122 C36 90 55 80 75 80 C95 80 114 90 123 122 A72 72 0 0 1 27 122 Z" fill={COLORS.avatarTan} />
            <Path d="M137 122 v22 M126 133 h22" stroke={COLORS.avatarTan} strokeWidth="7" strokeLinecap="round" />
          </Svg>
        )}
      </Pressable>

        <Text
          style={{
            marginTop: s(26),
            paddingHorizontal: s(30),
            textAlign: 'center',
            fontFamily: SERIF,
            fontSize: s(30),
            color: COLORS.avatarTan,
          }}
          numberOfLines={1}
          adjustsFontSizeToFit>
          {name.trim() ? `Hello, ${name.trim()}` : 'Hello, ...'}
        </Text>

        {googleUser && (
          <Text
            style={{
              marginTop: s(6),
              paddingHorizontal: s(30),
              textAlign: 'center',
              fontFamily: SERIF,
              fontSize: s(14),
              color: COLORS.gold,
            }}
            numberOfLines={1}>
            {googleUser.email}
          </Text>
        )}

        {/* name pill */}
        <View
          style={[
            styles.namePill,
            {
              marginTop: s(26),
              marginHorizontal: s(34),
              borderRadius: s(22),
              paddingVertical: s(14),
              paddingHorizontal: s(24),
            },
          ]}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor={COLORS.gold}
          autoCapitalize="words"
          style={{
            fontFamily: SERIF,
            fontSize: s(16),
            color: COLORS.ink,
            textAlign: 'center',
            paddingVertical: 0,
          }}
        />
        <View style={[styles.rule, {height: s(1.5), width: '70%', alignSelf: 'center', marginTop: s(6)}]} />
      </View>

        {/* date of birth card */}
        <View
          style={[
            styles.dobCard,
            {
              marginTop: s(30),
              marginHorizontal: s(26),
              borderRadius: s(28),
              paddingVertical: s(28),
              paddingHorizontal: s(22),
            },
          ]}>
        <Text
          style={{
            fontFamily: SERIF,
            fontSize: s(26),
            lineHeight: s(34),
            color: COLORS.avatarTan,
            textAlign: 'center',
          }}>
          Enter your{'\n'}Date of birth
        </Text>

        <View style={{flexDirection: 'row', gap: s(12), marginTop: s(24)}}>
          {[
            {ph: 'Month' as const, val: month},
            {ph: 'Day' as const, val: day},
            {ph: 'Year' as const, val: year},
          ].map(f => (
            <Pressable
              key={f.ph}
              onPress={() => setOpenPicker(f.ph)}
              style={({pressed}) => [
                styles.dobBox,
                {
                  borderRadius: s(12),
                  borderWidth: s(1.6),
                  paddingVertical: s(12),
                  backgroundColor: pressed ? 'rgba(169,162,212,0.18)' : 'rgba(255,255,255,0.55)',
                },
              ]}>
              <Text
                style={{
                  fontFamily: SERIF,
                  fontSize: s(15),
                  color: f.val ? COLORS.ink : COLORS.gold,
                  textAlign: 'center',
                }}>
                {f.val || f.ph}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() =>
            onAction(name.trim() ? `Welcome, ${name.trim()}` : 'Please enter your name')
          }
          style={({pressed}) => [
            styles.continueBtn,
            {
              marginTop: s(20),
              borderRadius: s(10),
              paddingVertical: s(13),
              opacity: pressed ? 0.85 : 1,
            },
          ]}>
          <Text style={{fontFamily: SERIF, fontSize: s(16), color: '#FFFFFF', textAlign: 'center'}}>
            Continue
          </Text>
        </Pressable>
      </View>

      {/* dropdown picker */}
      <Modal
        visible={openPicker !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenPicker(null)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setOpenPicker(null)}>
          <View
            style={[
              styles.pickerSheet,
              {borderRadius: s(24), paddingVertical: s(18), width: s(220), maxHeight: s(400)},
            ]}>
            <Text
              style={{
                fontFamily: SERIF,
                fontSize: s(20),
                color: COLORS.avatarTan,
                textAlign: 'center',
                marginBottom: s(10),
              }}>
              {openPicker}
            </Text>
            <ScrollView>
              {pickerOptions.map(opt => (
                <Pressable
                  key={opt}
                  onPress={() => {
                    setPicked(opt);
                    setOpenPicker(null);
                  }}
                  style={({pressed}) => ({
                    paddingVertical: s(11),
                    backgroundColor: pressed ? 'rgba(169,162,212,0.25)' : 'transparent',
                  })}>
                  <Text
                    style={{
                      fontFamily: SERIF,
                      fontSize: s(17),
                      color: COLORS.ink,
                      textAlign: 'center',
                    }}>
                    {opt}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

function AppInner() {
  const {width, height} = useWindowDimensions();
  // Clamped: raw width/375 produced a 131px title and pushed content far below
  // the fold on tablets, and cramped it on an iPhone SE.
  const scale = getScale(width);

  const [screen, setScreen] = useState<'login' | 'register' | 'profile'>('login');
  const fade = useRef(new Animated.Value(1)).current;

  const [toast, setToast] = useState('');
  const toastFade = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [googleUser, setGoogleUser] = useState<GoogleProfile | null>(null);
  const [googleBusy, setGoogleBusy] = useState(false);
  /** Cold start: hold the splash until we know whether a session exists. */
  const [bootstrapping, setBootstrapping] = useState(true);
  /**
   * Loading screen used as the transition into the app. Unlike a network call,
   * a transition has a known duration, so the bar tracks elapsed time honestly
   * rather than guessing at unknown work.
   */
  const [transition, setTransition] = useState<{
    target: 'login' | 'register' | 'profile';
    progress: number;
  } | null>(null);
  const transitionTarget = transition?.target;

  useEffect(() => {
    if (!transitionTarget) {
      return;
    }
    const started = Date.now();
    const DURATION = 900;
    const id = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - started) / DURATION) * 100);
      if (pct >= 100) {
        clearInterval(id);
        setScreen(transitionTarget);
        setTransition(null);
      } else {
        setTransition(t => (t ? {...t, progress: pct} : t));
      }
    }, 50);
    return () => clearInterval(id);
  }, [transitionTarget]);

  /** Milestones from the real sign-in call, not a timer. */
  const [signInStage, setSignInStage] = useState({stage: '', progress: 0});
  const [signInError, setSignInError] = useState<string | undefined>();
  const [signInSlow, setSignInSlow] = useState(false);

  // Under 300ms the loader never appears, so a fast sign-in does not flash.
  const showSignInLoader = useDelayedVisible(googleBusy, 300);

  // Past 2.5s the copy becomes honest about the wait; progress is untouched.
  useEffect(() => {
    if (!googleBusy) {
      setSignInSlow(false);
      return;
    }
    const t = setTimeout(() => setSignInSlow(true), 2500);
    return () => clearTimeout(t);
  }, [googleBusy]);

  useEffect(() => {
    if (!isGoogleConfigured()) {
      setBootstrapping(false);
      return;
    }
    // webClientId is only sent when an idToken is actually wanted; requesting one
    // without a matching Android OAuth client is what raises DEVELOPER_ERROR.
    GoogleSignin.configure(
      REQUEST_ID_TOKEN
        ? {webClientId: GOOGLE_WEB_CLIENT_ID, offlineAccess: false}
        : {offlineAccess: false},
    );
    // Restore a previous session without showing the account chooser.
    GoogleSignin.signInSilently()
      .then(res => {
        if (res.type === 'success') {
          setGoogleUser(res.data.user);
          setScreen('profile');
        }
      })
      .catch(() => {})
      .finally(() => setBootstrapping(false));
  }, []);

  /** Every navigation runs through the loading screen. */
  const goTo = (target: 'login' | 'register' | 'profile') => {
    setTransition({target, progress: 0});
  };

  const showToast = (msg: string) => {
    setToast(msg);
    Animated.timing(toastFade, {toValue: 1, duration: 200, useNativeDriver: true}).start();
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    toastTimer.current = setTimeout(() => {
      Animated.timing(toastFade, {toValue: 0, duration: 300, useNativeDriver: true}).start();
    }, 1600);
  };

  const handleGoogleSignIn = async () => {
    if (!isGoogleConfigured()) {
      showToast('Add your Web client ID to googleAuthConfig.ts');
      return;
    }
    setSignInError(undefined);
    setGoogleBusy(true);
    // Each setSignInStage marks a real step completing — no interpolation and
    // no timer nudging the bar along.
    setSignInStage({stage: 'Checking Google Play Services', progress: 10});
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      setSignInStage({stage: 'Waiting for you to choose an account', progress: 40});
      const res = await GoogleSignin.signIn();
      setSignInStage({stage: 'Finishing sign in', progress: 85});
      if (res.type === 'success') {
        setGoogleUser(res.data.user);
        goTo('profile');
      } else {
        showToast('Sign-in cancelled');
      }
    } catch (err) {
      const code = (err as {code?: string})?.code;
      if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        showToast('Google Play Services unavailable');
      } else if (code === statusCodes.IN_PROGRESS) {
        showToast('Sign-in already in progress');
      } else if (code === statusCodes.SIGN_IN_CANCELLED) {
        showToast('Sign-in cancelled');
      } else {
        // DEVELOPER_ERROR lands here: SHA-1 / package name / client ID mismatch.
        // A loader must never be left spinning with no way out, so this becomes
        // the failure screen with a retry rather than a toast that vanishes.
        setSignInError("We couldn't sign you in");
        console.warn('[GoogleSignIn]', err);
      }
    } finally {
      setGoogleBusy(false);
    }
  };

  const handleLogout = async () => {
    if (googleUser) {
      try {
        await GoogleSignin.signOut();
      } catch (err) {
        console.warn('[GoogleSignIn] signOut', err);
      }
      setGoogleUser(null);
    }
    goTo('login');
  };

  const screenBg =
    screen === 'profile'
      ? COLORS.marbleBase
      : screen === 'login'
      ? hora.surface.screen
      : COLORS.screenBg;

  // Cold start — no measurable progress to show, so the splash stays inert.
  if (bootstrapping) {
    return <Splash />;
  }

  if (transition) {
    return (
      <ReadingLoader
        progress={transition.progress}
        stage={TRANSITION_COPY[transition.target].stage}
        stageSub={TRANSITION_COPY[transition.target].sub}
      />
    );
  }

  // Held open on failure too, so the error and its retry are reachable.
  if (showSignInLoader || signInError) {
    return (
      <ReadingLoader
        progress={signInStage.progress}
        stage={signInSlow ? 'Taking longer than usual' : signInStage.stage}
        stageSub={signInSlow ? 'Still working — you can keep waiting' : undefined}
        error={signInError}
        onRetry={() => {
          setSignInError(undefined);
          handleGoogleSignIn();
        }}
      />
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: screenBg}}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={
          screen === 'profile'
            ? COLORS.marbleBase
            : screen === 'login'
            ? hora.surface.waveFront
            : COLORS.wavePink
        }
      />
      <Animated.View style={[StyleSheet.absoluteFill, {opacity: fade}]}>
        {screen === 'profile' ? (
          <>
            <MarbleBackground width={width} height={height} />
            <ProfileScreen
              key={googleUser?.email ?? 'guest'}
              onLogout={handleLogout}
              onAction={showToast}
              scale={scale}
              googleUser={googleUser}
            />
          </>
        ) : screen === 'login' ? (
          <LoginScreen
            onSubmit={(username: string) => {
              showToast(`Welcome, ${username}`);
              goTo('profile');
            }}
            onGoogle={handleGoogleSignIn}
            onRegister={() => goTo('register')}
            onGuest={() => goTo('profile')}
            googleBusy={googleBusy}
          />
        ) : (
          <RegisterScreen
            onSubmit={(mail: string) => {
              showToast(`Welcome, ${mail}`);
              goTo('profile');
            }}
            onGoogle={handleGoogleSignIn}
            onLogin={() => goTo('login')}
            googleBusy={googleBusy}
          />
        )}
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.toast,
          {
            opacity: toastFade,
            bottom: 100 * scale,
            paddingHorizontal: 24 * scale,
            paddingVertical: 11 * scale,
            borderRadius: 40 * scale,
            maxWidth: width - 48 * scale,
          },
        ]}>
        <Text
          style={{
            fontFamily: SERIF,
            fontSize: 16 * scale,
            color: COLORS.screenBg,
            textAlign: 'center',
          }}>
          {toast}
        </Text>
      </Animated.View>
    </View>
  );
}

// LoginScreen reads useSafeAreaInsets(), which needs a provider above it.
export default function App() {
  // DEV PREVIEW — delete this block to remove the loading-state preview
  if (DEV_PREVIEW_ENABLED) {
    return (
      <SafeAreaProvider>
        <DevLoadingPreview />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AppInner />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rule: {
    backgroundColor: COLORS.goldSoft,
    opacity: 0.55,
    marginBottom: 2,
  },
  flex: {flex: 1},
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    shadowColor: '#85755C',
    shadowOffset: {width: 14, height: 18},
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 12,
  },
  go: {
    backgroundColor: COLORS.lavender,
    alignItems: 'center',
    justifyContent: 'center',
    // must out-elevate the card or Android paints it underneath
    zIndex: 2,
    shadowColor: '#786EA0',
    shadowOffset: {width: 10, height: 14},
    shadowOpacity: 0.38,
    shadowRadius: 18,
    elevation: 14,
  },
  tryPill: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.card,
    shadowColor: '#85755C',
    shadowOffset: {width: 10, height: 12},
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 10,
  },
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: COLORS.ink,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    borderColor: COLORS.goldSoft,
    shadowColor: '#85755C',
    shadowOffset: {width: 6, height: 8},
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 8,
  },
  namePill: {
    backgroundColor: COLORS.card,
    shadowColor: '#85755C',
    shadowOffset: {width: 14, height: 18},
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 12,
  },
  dobCard: {
    backgroundColor: COLORS.card,
    shadowColor: '#85755C',
    shadowOffset: {width: 14, height: 18},
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 12,
  },
  dobBox: {
    flex: 1,
    borderColor: COLORS.lavender,
    justifyContent: 'center',
  },
  continueBtn: {
    backgroundColor: COLORS.lavender,
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26,21,15,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerSheet: {
    backgroundColor: COLORS.card,
  },
});
