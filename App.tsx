/**
 * Login / Register UI — from "App Design 375x812" by Pasariya Vorapanya
 * Cream ground, didone serif, gold accents, neumorphic card, lavender actions.
 */

import React, {useRef, useState} from 'react';
import {
  Animated,
  Modal,
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

type IconProps = {size: number; color: string};

const UserIcon = ({size, color}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="8" r="3.6" stroke={color} strokeWidth={1.8} fill="none" />
    <Path
      d="M5 20c1.2-4 4-5.5 7-5.5s5.8 1.5 7 5.5"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      fill="none"
    />
  </Svg>
);

const LockIcon = ({size, color}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M7 10V8a5 5 0 0 1 10 0v2h.6c.8 0 1.4.6 1.4 1.4v7.2c0 .8-.6 1.4-1.4 1.4H6.4c-.8 0-1.4-.6-1.4-1.4v-7.2C5 10.6 5.6 10 6.4 10H7Zm2 0h6V8a3 3 0 0 0-6 0v2Zm3 4a1.4 1.4 0 0 0-.7 2.6V18a.7.7 0 0 0 1.4 0v-1.4A1.4 1.4 0 0 0 12 14Z"
      fill={color}
    />
  </Svg>
);

const AtIcon = ({size, color}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth={1.7} fill="none" />
    <Path
      d="M16 8v5a2.5 2.5 0 0 0 5 0v-1a9 9 0 1 0-3.6 7.2"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
      fill="none"
    />
  </Svg>
);

const ArrowIcon = ({size, color}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M4 12h15M13 6l6 6-6 6"
      stroke={color}
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

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

/** Pale pink wave flowing in from the top edge. */
const TopWaves = ({width, height}: {width: number; height: number}) => (
  <View pointerEvents="none" style={[StyleSheet.absoluteFill, {justifyContent: 'flex-start'}]}>
    <Svg width={width} height={height} viewBox="0 0 387 190" preserveAspectRatio="none">
      <Path
        d="M0,0 L0,130 C70,160 140,96 210,86 C280,76 330,110 387,60 L387,0 Z"
        fill={COLORS.wavePinkPale}
      />
      <Path
        d="M0,0 L0,96 C80,124 150,62 220,54 C290,46 340,74 387,28 L387,0 Z"
        fill={COLORS.wavePink}
      />
    </Svg>
  </View>
);

/** Layered waves along the bottom of the screen. */
const BottomWaves = ({width, height}: {width: number; height: number}) => (
  <View pointerEvents="none" style={[StyleSheet.absoluteFill, {justifyContent: 'flex-end'}]}>
    <Svg width={width} height={height} viewBox="0 0 387 260" preserveAspectRatio="none">
      <Path
        d="M0,260 L0,190 C90,150 150,215 240,175 C310,145 350,90 387,80 L387,260 Z"
        fill={COLORS.waveLavenderPale}
      />
      <Path
        d="M0,260 L0,235 C110,200 180,250 270,208 C330,180 360,140 387,132 L387,260 Z"
        fill={COLORS.waveLavender}
      />
    </Svg>
  </View>
);

type FieldProps = {
  icon: 'user' | 'lock' | 'at';
  placeholder: string;
  secure?: boolean;
  email?: boolean;
  scale: number;
  last?: boolean;
};

const Field = ({icon, placeholder, secure, email, scale, last}: FieldProps) => {
  const s = (n: number) => n * scale;
  const Icon = icon === 'user' ? UserIcon : icon === 'lock' ? LockIcon : AtIcon;
  return (
    <View>
      <View style={[styles.fieldRow, {gap: s(14), paddingVertical: s(10)}]}>
        <Icon size={s(21)} color={COLORS.gold} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={COLORS.ink}
          secureTextEntry={secure}
          keyboardType={email ? 'email-address' : 'default'}
          autoCapitalize="none"
          style={[
            styles.input,
            {
              fontSize: secure ? s(18) : s(21),
              letterSpacing: secure ? s(2) : s(0.4),
            },
          ]}
        />
      </View>
      {!last && (
        <View style={[styles.rule, {height: s(2), width: '78%', borderRadius: s(2)}]} />
      )}
    </View>
  );
};

type ScreenProps = {
  variant: 'login' | 'register';
  onSwitch: () => void;
  onEnter: () => void;
  scale: number;
  screenH: number;
};

const AuthScreen = ({variant, onSwitch, onEnter, scale, screenH}: ScreenProps) => {
  const s = (n: number) => n * scale;
  const isLogin = variant === 'login';

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* switch link, top right */}
      <Pressable
        onPress={onSwitch}
        hitSlop={12}
        style={{position: 'absolute', top: s(76), right: s(36)}}>
        <Text style={{fontFamily: SERIF, fontSize: s(19), color: COLORS.gold}}>
          {isLogin ? 'Register' : 'Log in'}
        </Text>
      </Pressable>

      {/* title */}
      <Text
        style={{
          position: 'absolute',
          top: s(132),
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: SERIF,
          fontSize: s(66),
          color: COLORS.ink,
        }}>
        {isLogin ? 'Login' : 'Register'}
      </Text>

      {/* neumorphic input card, bleeding off the left edge */}
      <View
        style={[
          styles.card,
          {
            top: isLogin ? s(292) : s(272),
            left: s(-48),
            width: s(322),
            borderTopRightRadius: s(85),
            borderBottomRightRadius: s(85),
            paddingVertical: s(38),
            paddingRight: s(36),
            paddingLeft: s(84),
          },
        ]}>
        <Field icon="user" placeholder="Username" scale={scale} />
        <Field
          icon="lock"
          placeholder={isLogin ? '•••••••••••••' : 'Password'}
          secure
          scale={scale}
          last={isLogin}
        />
        {!isLogin && <Field icon="at" placeholder="Email" email scale={scale} last />}
      </View>

      {/* lavender arrow button */}
      <Pressable
        onPress={onEnter}
        style={({pressed}) => [
          styles.go,
          {
            top: s(isLogin ? 348 : 352),
            right: s(30),
            width: s(100),
            height: s(100),
            borderRadius: s(50),
            transform: [{scale: pressed ? 0.94 : 1}],
          },
        ]}>
        <ArrowIcon size={s(42)} color="#FFFFFF" />
      </Pressable>

      {/* try now pill */}
      <Pressable
        onPress={onEnter}
        style={({pressed}) => [
          styles.tryPill,
          {
            top: screenH * 0.72,
            left: s(-42),
            borderTopRightRadius: s(60),
            borderBottomRightRadius: s(60),
            paddingVertical: s(22),
            paddingLeft: s(80),
            paddingRight: s(52),
            transform: [{translateX: pressed ? s(4) : 0}],
          },
        ]}>
        <Text style={{fontFamily: SERIF, fontSize: s(26), color: COLORS.lavender}}>
          Try now
        </Text>
      </Pressable>
    </View>
  );
};

type ProfileProps = {
  onLogout: () => void;
  onAction: (msg: string) => void;
  scale: number;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = Array.from({length: 31}, (_, i) => String(i + 1));
const YEARS = Array.from({length: 100}, (_, i) => String(new Date().getFullYear() - i));

const ProfileScreen = ({onLogout, onAction, scale}: ProfileProps) => {
  const s = (n: number) => n * scale;
  const [name, setName] = useState('');
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
    <View style={StyleSheet.absoluteFill}>
      <Pressable onPress={onLogout} hitSlop={12} style={{position: 'absolute', top: s(50), right: s(30)}}>
        <Text style={{fontFamily: SERIF, fontSize: s(16), color: COLORS.gold}}>Back</Text>
      </Pressable>

      {/* avatar with add-photo badge */}
      <Pressable
        onPress={() => onAction('Photo picker coming soon')}
        style={{position: 'absolute', top: s(108), alignSelf: 'center', width: avatarSize, height: avatarSize}}>
        <Svg width={avatarSize} height={avatarSize} viewBox="0 0 150 150">
          <Circle cx="75" cy="75" r="72" stroke={COLORS.avatarTan} strokeWidth="4" fill="none" />
          <Circle cx="75" cy="58" r="26" fill={COLORS.avatarTan} />
          <Path d="M27 122 C36 90 55 80 75 80 C95 80 114 90 123 122 A72 72 0 0 1 27 122 Z" fill={COLORS.avatarTan} />
          <Path d="M137 122 v22 M126 133 h22" stroke={COLORS.avatarTan} strokeWidth="7" strokeLinecap="round" />
        </Svg>
      </Pressable>

      <Text
        style={{
          position: 'absolute',
          top: s(292),
          left: s(30),
          right: s(30),
          textAlign: 'center',
          fontFamily: SERIF,
          fontSize: s(30),
          color: COLORS.avatarTan,
        }}
        numberOfLines={1}
        adjustsFontSizeToFit>
        {name.trim() ? `Hello, ${name.trim()}` : 'Hello, ...'}
      </Text>

      {/* name pill */}
      <View
        style={[
          styles.namePill,
          {
            top: s(376),
            left: s(34),
            right: s(34),
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
            top: s(486),
            left: s(26),
            right: s(26),
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
    </View>
  );
};

export default function App() {
  const {width, height} = useWindowDimensions();
  const scale = width / 375;

  const [screen, setScreen] = useState<'login' | 'register' | 'profile'>('login');
  const fade = useRef(new Animated.Value(1)).current;

  const [toast, setToast] = useState('');
  const toastFade = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (target: 'login' | 'register' | 'profile') => {
    Animated.timing(fade, {toValue: 0, duration: 200, useNativeDriver: true}).start(() => {
      setScreen(target);
      Animated.timing(fade, {toValue: 1, duration: 260, useNativeDriver: true}).start();
    });
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

  return (
    <View style={{flex: 1, backgroundColor: screen === 'profile' ? COLORS.marbleBase : COLORS.screenBg}}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={screen === 'profile' ? COLORS.marbleBase : COLORS.wavePink}
      />
      <Animated.View style={[StyleSheet.absoluteFill, {opacity: fade}]}>
        {screen === 'profile' ? (
          <>
            <MarbleBackground width={width} height={height} />
            <ProfileScreen onLogout={() => goTo('login')} onAction={showToast} scale={scale} />
          </>
        ) : (
          <>
            <TopWaves width={width} height={190 * scale} />
            <BottomWaves width={width} height={260 * scale} />
            <AuthScreen
              variant={screen}
              onSwitch={() => goTo(screen === 'login' ? 'register' : 'login')}
              onEnter={() => goTo('profile')}
              scale={scale}
              screenH={height}
            />
          </>
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
          },
        ]}>
        <Text style={{fontFamily: SERIF, fontSize: 16 * scale, color: COLORS.screenBg}}>
          {toast}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontFamily: SERIF,
    color: COLORS.ink,
    paddingVertical: 0,
  },
  rule: {
    backgroundColor: COLORS.goldSoft,
    opacity: 0.55,
    marginBottom: 2,
  },
  card: {
    position: 'absolute',
    backgroundColor: COLORS.card,
    shadowColor: '#85755C',
    shadowOffset: {width: 14, height: 18},
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 12,
  },
  go: {
    position: 'absolute',
    backgroundColor: COLORS.lavender,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#786EA0',
    shadowOffset: {width: 10, height: 14},
    shadowOpacity: 0.38,
    shadowRadius: 18,
    elevation: 14,
  },
  tryPill: {
    position: 'absolute',
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
  namePill: {
    position: 'absolute',
    backgroundColor: COLORS.card,
    shadowColor: '#85755C',
    shadowOffset: {width: 14, height: 18},
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 12,
  },
  dobCard: {
    position: 'absolute',
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
