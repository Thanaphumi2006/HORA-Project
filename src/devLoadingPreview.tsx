/**
 * ============================================================================
 * TEMPORARY DEV PREVIEW — NOT PRODUCTION CODE
 *
 * To remove it completely:
 *   1. delete this file
 *   2. in App.tsx delete the two lines marked `DEV PREVIEW` (the import and the
 *      early-return block inside App())
 * Nothing else references it.
 *
 * To turn it off but keep it around, set DEV_PREVIEW_ENABLED to false.
 * ============================================================================
 */
import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import theme from './theme';
import Splash from './components/Splash';
import ReadingLoader from './components/ReadingLoader';
import Skeleton from './components/Skeleton';

export const DEV_PREVIEW_ENABLED = false;

/**
 * TEMPORARY — jump straight into the profile setup flow without signing up.
 * Set to false, or delete this constant plus the `DEV PROFILE SETUP` block in
 * App.tsx, to remove it.
 */
export const DEV_PROFILE_SETUP = false;

type State = 'splash' | 'reading' | 'skeleton' | 'error';
const ORDER: State[] = ['splash', 'reading', 'skeleton', 'error'];

export default function DevLoadingPreview() {
  const [state, setState] = useState<State>('splash');
  const [progress, setProgress] = useState(42);

  const next = () => setState(ORDER[(ORDER.indexOf(state) + 1) % ORDER.length]);

  return (
    <View style={styles.root}>
      {state === 'splash' && <Splash />}

      {state === 'reading' && (
        <ReadingLoader
          progress={progress}
          stage="Drawing your reading"
          stageSub="This usually takes a few seconds"
        />
      )}

      {state === 'skeleton' && <Skeleton variant="reading" />}

      {state === 'error' && (
        <ReadingLoader
          progress={0}
          stage="Drawing your reading"
          error="We couldn't reach the stars"
          onRetry={() => setState('reading')}
        />
      )}

      <View style={styles.bar} pointerEvents="box-none">
        <Pressable onPress={next} style={styles.chip}>
          <Text style={styles.chipText}>{state} ▸</Text>
        </Pressable>
        {state === 'reading' && (
          <Pressable
            onPress={() => setProgress(p => (p >= 100 ? 0 : p + 20))}
            style={styles.chip}>
            <Text style={styles.chipText}>progress {progress}%</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  bar: {
    position: 'absolute',
    bottom: 130,   // clear of the loader's moon
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  chip: {
    backgroundColor: theme.surface.action,
    paddingHorizontal: 16,
    minHeight: theme.hit,
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
  },
  chipText: {color: theme.text.onAction, fontFamily: theme.font.body, fontSize: 13},
});
