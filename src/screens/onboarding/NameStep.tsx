import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import theme, {getScale} from '../../theme';
import TopWave from '../../components/TopWave';
import Field from '../../components/Field';
import StepChrome from '../../components/StepChrome';
import MoonTapCTA from '../../components/MoonTapCTA';

type Props = {
  initial: string;
  onNext: (name: string) => void;
  onSkip: () => void;
};

export default function NameStep({initial, onNext, onSkip}: Props) {
  const {width} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scale = getScale(width);
  const s = (n: number) => n * scale;
  const [name, setName] = useState(initial);

  return (
    <View style={styles.root}>
      <TopWave width={width} height={s(146)} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top + s(44),
            paddingBottom: insets.bottom + s(24),
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <StepChrome step={0} onSkip={onSkip} scale={scale} leaves={1} />

          <View style={{marginHorizontal: s(24)}}>
            <Text style={[styles.q, {fontSize: s(38), marginTop: s(28)}]}>
              What should we call you?
            </Text>
            <Text style={[styles.helper, {fontSize: s(12), marginTop: s(8)}]}>
              Just a first name is fine.
            </Text>

            {/* one gap under the question block; the CTA stays put because the
                flex spacer below absorbs it */}
            <View style={{height: s(34)}} />

            <View>
              <Field
                fullWidth
                label="Name"
                value={name}
                onChangeText={setName}
                scale={scale}
                autoCapitalize="words"
                textContentType="givenName"
                returnKeyType="next"
                onSubmitEditing={() => onNext(name.trim())}
              />
            </View>
          </View>

          <View style={styles.flex} />

        </ScrollView>
      </KeyboardAvoidingView>
      <MoonTapCTA
        label="Continue"
        hint="Continue"
        onPress={() => onNext(name.trim())}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // transparent: ProfileSetup paints the ground and the moon behind
  root: {flex: 1},
  flex: {flex: 1},
  q: {
    fontFamily: theme.font.displayBold,
    color: theme.text.primary,
    textAlign: 'center',
  },
  helper: {
    fontFamily: theme.font.body,
    color: theme.text.secondary,
    textAlign: 'center',
  },
});
