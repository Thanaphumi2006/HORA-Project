import React, {useEffect, useState} from 'react';
import {
  BackHandler,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import theme from '../../theme';
import MoonPhase, {MOON} from '../../components/MoonPhase';
import NameStep from './NameStep';
import BirthDateStep from './BirthDateStep';
import SignRevealStep from './SignRevealStep';
import IntentStep from './IntentStep';
import {parseMonth} from '../../lib/zodiac';

export type Profile = {
  name: string;
  day: string;
  month: string;
  year: string;
  intents: string[];
};

type Props = {onComplete: (profile: Profile) => void};

/** How lit the moon is on each step. It only ever waxes. */
const PHASE: Record<Step, number> = {0: 0.18, 1: 0.45, 2: 0.72, 3: 1};

/** name -> birth date -> sign reveal -> intent */
type Step = 0 | 1 | 2 | 3;

export default function ProfileSetup({onComplete}: Props) {
  const {width} = useWindowDimensions();
  const [step, setStep] = useState<Step>(0);
  const [profile, setProfile] = useState<Profile>({
    name: '',
    day: '',
    month: '',
    year: '',
    intents: [],
  });

  // Android hardware back walks the flow; on the first step it falls through to
  // the default handler so the OS can do its normal thing.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step === 0) {
        return false;
      }
      setStep(p => (p - 1) as Step);
      return true;
    });
    return () => sub.remove();
  }, [step]);

  const renderStep = () => {
    switch (step) {
    case 0:
      return (
        <NameStep
          initial={profile.name}
          onNext={name => {
            setProfile(p => ({...p, name}));
            setStep(1);
          }}
          // Skip passes an empty name straight through and must not block.
          onSkip={() => {
            setProfile(p => ({...p, name: ''}));
            setStep(1);
          }}
        />
      );

    case 1:
      return (
        <BirthDateStep
          initial={{day: profile.day, month: profile.month, year: profile.year}}
          onNext={v => {
            setProfile(p => ({...p, ...v}));
            setStep(2);
          }}
          onBack={() => setStep(0)}
        />
      );

    case 2:
      return (
        <SignRevealStep
          month={parseMonth(profile.month)}
          day={parseInt(profile.day, 10) || 1}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      );

    default:
      return (
        <IntentStep
          initial={profile.intents}
          onFinish={intents => {
            const done = {...profile, intents};
            setProfile(done);
            onComplete(done);
          }}
          onBack={() => setStep(2)}
        />
      );
    }
  };

  return (
    <View style={styles.root}>
      {/* One moon for the whole flow. Mounted here rather than per-step so the
          phase tweens across step changes instead of cutting. */}
      {/* 1.25x keeps the disc bigger than the screen while leaving nearly its
          full width on view — at 2.2x the crescent fell off the right edge and
          the phase became unreadable. */}
      <MoonPhase
        size={width * MOON.sizeRatio}
        progress={PHASE[step]}
        reveal={MOON.reveal}
      />
      {renderStep()}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: theme.surface.screen, overflow: 'hidden'},
});
