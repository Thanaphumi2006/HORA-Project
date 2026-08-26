import React from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import theme, {getScale} from '../theme';
import {TERMS, TERMS_OUTRO, TERMS_TITLE, type Block} from '../content/terms';

type Props = {onClose: () => void};

export default function TermsScreen({onClose}: Props) {
  const {width} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const s = (n: number) => n * getScale(width);

  const renderBlock = (block: Block, key: string) => {
    switch (block.type) {
      case 'bullets':
        return (
          <View key={key} style={{marginTop: s(8)}}>
            {block.items.map((item, i) => (
              <View key={i} style={[styles.bulletRow, {marginTop: s(6), gap: s(8)}]}>
                <Text style={[styles.bulletDot, {fontSize: s(13)}]}>•</Text>
                <Text style={[styles.body, {fontSize: s(13)}]}>{item}</Text>
              </View>
            ))}
          </View>
        );

      case 'crisis':
        // The one place in the app where acting fast matters more than reading,
        // so the numbers are dialable rather than just printed.
        return (
          <View
            key={key}
            style={[
              styles.crisis,
              {marginTop: s(10), padding: s(14), borderRadius: s(theme.radius.md)},
            ]}>
            <Text style={[styles.body, {fontSize: s(13)}]}>{block.text}</Text>
            <View style={{marginTop: s(10), gap: s(8)}}>
              {block.calls.map(call => (
                <Pressable
                  key={call.number}
                  onPress={() => Linking.openURL(`tel:${call.number}`)}
                  accessibilityRole="button"
                  accessibilityLabel={call.label}
                  style={({pressed}) => [
                    styles.callBtn,
                    {
                      borderRadius: s(theme.radius.pill),
                      paddingHorizontal: s(18),
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}>
                  <Text style={[styles.callLabel, {fontSize: s(13)}]}>{call.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        );

      case 'note':
        // An editorial instruction, not terms. Flagged so it cannot be mistaken
        // for something the reader is agreeing to.
        return (
          <View
            key={key}
            style={[
              styles.note,
              {marginTop: s(10), padding: s(12), borderRadius: s(theme.radius.sm)},
            ]}>
            <Text style={[styles.noteLabel, {fontSize: s(10)}]}>
              UNRESOLVED — REMOVE BEFORE RELEASE
            </Text>
            <Text style={[styles.body, {fontSize: s(12), marginTop: s(4)}]}>
              {block.text}
            </Text>
          </View>
        );

      default:
        return (
          <Text key={key} style={[styles.body, {fontSize: s(13), marginTop: s(10)}]}>
            {block.text}
          </Text>
        );
    }
  };

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.header,
          {paddingTop: insets.top + s(8), paddingHorizontal: s(24), paddingBottom: s(10)},
        ]}>
        <Text style={[styles.title, {fontSize: s(20)}]} numberOfLines={1}>
          {TERMS_TITLE}
        </Text>
        <Pressable
          onPress={onClose}
          hitSlop={14}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={styles.hit}>
          <Text style={[styles.close, {fontSize: s(13)}]}>Close</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: s(24),
          paddingBottom: insets.bottom + s(32),
        }}
        showsVerticalScrollIndicator>
        {TERMS.map(section => (
          <View key={section.n} style={{marginTop: s(22)}}>
            <Text style={[styles.sectionTitle, {fontSize: s(16)}]}>
              {section.n}. {section.title}
            </Text>
            {section.blocks.map((b, i) => renderBlock(b, `${section.n}-${i}`))}
          </View>
        ))}

        <Text style={[styles.outro, {fontSize: s(13), marginTop: s(28)}]}>
          {TERMS_OUTRO}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: theme.surface.screen},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.surface.waveFront,
  },
  hit: {minHeight: theme.hit, justifyContent: 'center'},
  title: {fontFamily: theme.font.display, color: theme.text.primary, flex: 1},
  close: {
    fontFamily: theme.font.body,
    color: theme.text.primary,
    textDecorationLine: 'underline',
  },
  sectionTitle: {fontFamily: theme.font.display, color: theme.text.primary},
  body: {
    flex: 1,
    fontFamily: theme.font.body,
    color: theme.text.secondary,
    lineHeight: 21,
  },
  bulletRow: {flexDirection: 'row'},
  bulletDot: {fontFamily: theme.font.body, color: theme.text.secondary},
  crisis: {
    backgroundColor: theme.surface.card,
    borderWidth: 1,
    borderColor: theme.line.ruleDanger,
  },
  callBtn: {
    backgroundColor: theme.surface.action,
    minHeight: theme.hit,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callLabel: {fontFamily: theme.font.body, color: theme.text.onAction},
  note: {
    backgroundColor: theme.surface.card,
    borderWidth: 1,
    borderColor: theme.line.rule,
    borderStyle: 'dashed',
  },
  noteLabel: {
    fontFamily: theme.font.bodySemi,
    color: theme.text.danger,
    letterSpacing: 1,
  },
  outro: {
    fontFamily: theme.font.body,
    color: theme.text.primary,
    lineHeight: 21,
  },
});
