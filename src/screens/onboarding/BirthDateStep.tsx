import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import theme, {getScale} from '../../theme';
import TopWave from '../../components/TopWave';
import StepChrome from '../../components/StepChrome';
import MoonTapCTA from '../../components/MoonTapCTA';
import {daysInMonth, parseMonth} from '../../lib/zodiac';

type Props = {
  initial: {day: string; month: string; year: string};
  onNext: (v: {day: string; month: string; year: string}) => void;
  onBack: () => void;
  /** Injected so the component stays pure and testable. */
  today?: Date;
};

type Which = 'd' | 'm' | 'y';

export default function BirthDateStep({initial, onNext, onBack, today}: Props) {
  const {width} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scale = getScale(width);
  const s = (n: number) => n * scale;

  const [day, setDay] = useState(initial.day);
  const [month, setMonth] = useState(initial.month);
  const [year, setYear] = useState(initial.year);
  const [error, setError] = useState<{which: Which; text: string} | null>(null);

  const colWidth = (width - s(48) - s(32)) / 3;

  const clearIf = (w: Which) => {
    if (error?.which === w) {
      setError(null);
    }
  };

  const submit = () => {
    const now = today ?? new Date();
    const m = parseMonth(month);
    const d = parseInt(day, 10);
    const y = parseInt(year, 10);

    if (!month.trim() || m === 0) {
      return setError({which: 'm', text: 'Check the month'});
    }
    if (!year.trim() || Number.isNaN(y) || year.trim().length !== 4) {
      return setError({which: 'y', text: 'Use a four-digit year'});
    }
    if (!day.trim() || Number.isNaN(d) || d < 1) {
      return setError({which: 'd', text: 'Check the day'});
    }
    // daysInMonth is leap-aware, so 31 February cannot pass
    if (d > daysInMonth(m, y)) {
      return setError({which: 'd', text: `Only ${daysInMonth(m, y)} days that month`});
    }

    let age = now.getFullYear() - y;
    const beforeBirthday =
      now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d);
    if (beforeBirthday) {
      age -= 1;
    }
    if (age < 13) {
      return setError({which: 'y', text: 'You must be at least 13'});
    }
    if (age > 120) {
      return setError({which: 'y', text: 'Check the year'});
    }

    setError(null);
    onNext({day: String(d), month: String(m), year: String(y)});
  };

  const column = (
    which: Which,
    label: string,
    value: string,
    setValue: (v: string) => void,
    numeric: boolean,
    maxLength: number,
  ) => {
    const bad = error?.which === which;
    return (
      <View style={{width: colWidth}}>
        <TextInput
          value={value}
          onChangeText={v => {
            setValue(v);
            clearIf(which);
          }}
          keyboardType={numeric ? 'number-pad' : 'default'}
          autoCapitalize="characters"
          maxLength={maxLength}
          accessibilityLabel={label}
          style={[
            styles.input,
            {fontSize: s(20), height: Math.max(theme.hit, s(48)), paddingVertical: 0},
          ]}
        />
        <View
          style={{
            height: bad ? 2 : 1,
            backgroundColor: bad ? theme.line.ruleDanger : theme.line.rule,
          }}
        />
        <Text
          style={[
            styles.colLabel,
            {fontSize: s(10), letterSpacing: s(1.2), marginTop: s(6)},
            bad && styles.colLabelBad,
          ]}>
          {label.toUpperCase()}
        </Text>
      </View>
    );
  };

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
          <StepChrome step={1} onBack={onBack} scale={scale} leaves={2} />

          <View style={{marginHorizontal: s(24)}}>
            <Text style={[styles.q, {fontSize: s(38), marginTop: s(28)}]}>
              When were you born?
            </Text>
            {/* purpose limitation, in plain words — this is what stops drop-off */}
            <Text style={[styles.helper, {fontSize: s(12), marginTop: s(8)}]}>
              We use this to find your sun sign. Nothing else.
            </Text>

            <View style={{height: s(34)}} />

            <View style={[styles.row, {gap: s(16)}]}>
              {column('d', 'Day', day, setDay, true, 2)}
              {column('m', 'Month', month, setMonth, false, 3)}
              {column('y', 'Year', year, setYear, true, 4)}
            </View>

            {!!error && (
              <Text
                accessibilityLiveRegion="polite"
                style={[styles.error, {fontSize: s(11.5), marginTop: s(12)}]}>
                {error.text}
              </Text>
            )}

            <Text style={[styles.note, {fontSize: s(11.5), marginTop: s(16)}]}>
              Birth time is optional and can be added later.
            </Text>
          </View>

          <View style={styles.flex} />

          {/* validation still runs on press — the moon is only the trigger */}
        </ScrollView>
      </KeyboardAvoidingView>
      {/* validation still runs on press — the moon is only the trigger */}
      <MoonTapCTA label="Continue" hint="Continue" onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  // transparent: ProfileSetup paints the ground and the moon behind
  root: {flex: 1},
  flex: {flex: 1},
  row: {flexDirection: 'row'},
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
  /** Left-aligned: it annotates the date columns, not the question. */
  note: {fontFamily: theme.font.body, color: theme.text.secondary},
  input: {fontFamily: theme.font.body, color: theme.text.primary},
  colLabel: {fontFamily: theme.font.body, color: theme.text.secondary},
  colLabelBad: {color: theme.text.danger},
  error: {fontFamily: theme.font.body, color: theme.text.danger},
});
