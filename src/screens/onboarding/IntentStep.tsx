import React, {useState} from 'react';
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
import StepChrome from '../../components/StepChrome';
import MoonTapCTA from '../../components/MoonTapCTA';
import Chip from '../../components/Chip';

export const INTENTS = ['Self growth', 'Love', 'Career', 'Daily guidance'];

type Props = {
  initial: string[];
  onFinish: (intents: string[]) => void;
  onBack: () => void;
};

export default function IntentStep({initial, onFinish, onBack}: Props) {
  const {width} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scale = getScale(width);
  const s = (n: number) => n * scale;
  const [picked, setPicked] = useState<string[]>(initial);

  const toggle = (label: string) =>
    setPicked(p => (p.includes(label) ? p.filter(x => x !== label) : [...p, label]));

  // floor: at exact halves, sub-pixel rounding tips the pair over the row
  // width and the grid collapses to a single column
  const colWidth = Math.floor((width - s(48) - s(12)) / 2);

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
        <StepChrome step={2} onBack={onBack} scale={scale} leaves={4} />

        <View style={{marginHorizontal: s(24)}}>
          <Text style={[styles.q, {fontSize: s(38), marginTop: s(28)}]}>
            What brings you here?
          </Text>
          <Text style={[styles.helper, {fontSize: s(12), marginTop: s(8)}]}>
            Pick any. You can change these later.
          </Text>

          <View style={{height: s(34)}} />

          <View style={[styles.grid, {gap: s(12)}]}>
            {INTENTS.map(label => (
              <View key={label} style={{width: colWidth}}>
                <Chip
                  label={label}
                  selected={picked.includes(label)}
                  onPress={() => toggle(label)}
                  scale={scale}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.flex} />

        {/* zero selections is a valid answer, so this never blocks */}
      </ScrollView>
      {/* zero selections is a valid answer, so this never blocks */}
      <MoonTapCTA
        label="Finish"
        hint="Continue"
        onPress={() => onFinish(picked)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // transparent: ProfileSetup paints the ground and the moon behind
  root: {flex: 1},
  flex: {flex: 1},
  grid: {flexDirection: 'row', flexWrap: 'wrap'},
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
