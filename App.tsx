/**
 * Login / Register UI — from "App Design 375x812" by Pasariya Vorapanya
 * Cream ground, didone serif, gold accents, neumorphic card, lavender actions.
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProfileSetup, {type Profile} from './src/screens/onboarding/ProfileSetup';
import SetupComplete from './src/screens/onboarding/SetupComplete';
import hora, {getScale} from './src/theme';
// DEV PREVIEW — delete this line to remove the loading-state preview
import DevLoadingPreview, {
  DEV_PREVIEW_ENABLED,
  DEV_PROFILE_SETUP,
} from './src/devLoadingPreview';
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
  'login' | 'register' | 'profile' | 'done',
  {stage: string; sub: string}
> = {
  done: {stage: 'Opening HORA', sub: 'Just a moment'},
  login: {stage: 'Back to login', sub: 'Just a moment'},
  register: {stage: 'Opening register', sub: 'Just a moment'},
  profile: {stage: 'Opening HORA', sub: 'Just a moment'},
};

type GoogleProfile = {
  name: string | null;
  email: string;
  photo: string | null;
};

function AppInner() {
  const {width} = useWindowDimensions();
  // Clamped: raw width/375 produced a 131px title and pushed content far below
  // the fold on tablets, and cramped it on an iPhone SE.
  const scale = getScale(width);

  const [screen, setScreen] = useState<'login' | 'register' | 'profile' | 'done'>('login');
  const fade = useRef(new Animated.Value(1)).current;

  const [toast, setToast] = useState('');
  const toastFade = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [googleUser, setGoogleUser] = useState<GoogleProfile | null>(null);
  /** Completed onboarding answers. Lives here because there is no store yet. */
  const [profile, setProfile] = useState<Profile | null>(null);
  const [googleBusy, setGoogleBusy] = useState(false);
  /** Cold start: hold the splash until we know whether a session exists. */
  const [bootstrapping, setBootstrapping] = useState(true);
  /**
   * Loading screen used as the transition into the app. Unlike a network call,
   * a transition has a known duration, so the bar tracks elapsed time honestly
   * rather than guessing at unknown work.
   */
  const [transition, setTransition] = useState<{
    target: 'login' | 'register' | 'profile' | 'done';
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
  const goTo = (target: 'login' | 'register' | 'profile' | 'done') => {
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

  const handleProfileComplete = (p: Profile) => {
    setProfile(p);
    goTo('done');
  };

  const handleSignOut = async () => {
    if (googleUser) {
      try {
        await GoogleSignin.signOut();
      } catch (err) {
        console.warn('[GoogleSignIn] signOut', err);
      }
      setGoogleUser(null);
    }
    setProfile(null);
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
        {screen === 'done' && profile ? (
          <SetupComplete
            profile={profile}
            email={googleUser?.email}
            onSignOut={handleSignOut}
          />
        ) : screen === 'profile' ? (
          <ProfileSetup
            key={googleUser?.email ?? 'guest'}
            onComplete={handleProfileComplete}
          />
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
  // DEV PROFILE SETUP — delete this block to remove the shortcut
  if (DEV_PROFILE_SETUP) {
    return (
      <SafeAreaProvider>
        <ProfileSetup onComplete={p => console.log('[dev] profile complete', p)} />
      </SafeAreaProvider>
    );
  }

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
