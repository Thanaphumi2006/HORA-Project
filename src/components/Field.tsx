import React, {useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import Svg, {Circle, Path} from 'react-native-svg';
import theme from '../theme';

type Props = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  scale: number;
  secure?: boolean;
  error?: string;
  helper?: string;
  placeholder?: string;
  /**
   * Login nests this in a narrow slab, where a 82% rule looks right. Register
   * puts it on the full column, where the rule must reach the right edge to
   * line up with the buttons.
   */
  fullWidth?: boolean;
} & Partial<
  Pick<
    TextInputProps,
    'autoCapitalize' | 'keyboardType' | 'autoComplete' | 'textContentType' | 'returnKeyType' | 'onSubmitEditing'
  >
>;

const EyeIcon = ({size, color, off}: {size: number; color: string; off: boolean}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12Z"
      stroke={color}
      strokeWidth={1.7}
      fill="none"
    />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1.7} fill="none" />
    {off && (
      <Path d="M4 20 20 4" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    )}
  </Svg>
);

const AlertIcon = ({size, color}: {size: number; color: string}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.8} fill="none" />
    <Path
      d="M12 7.5v5.5M12 16.4v.2"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </Svg>
);

export default function Field({
  label,
  value,
  onChangeText,
  scale,
  secure,
  error,
  helper,
  placeholder,
  fullWidth,
  ...inputProps
}: Props) {
  const s = (n: number) => n * scale;
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Focus and error are signalled by weight AND colour. Colour alone fails
  // for colour-blind users (SC 1.4.1).
  const active = focused || !!error;
  const tone = error
    ? theme.text.danger
    : focused
    ? theme.text.primary
    : theme.text.secondary;
  const ruleColor = error
    ? theme.line.ruleDanger
    : focused
    ? theme.line.ruleActive
    : theme.line.rule;

  return (
    <View>
      <Text
        style={[
          styles.label,
          {
            fontSize: s(theme.size.label),
            letterSpacing: s(1.3),
            color: tone,
            fontFamily: active ? theme.font.bodySemi : theme.font.bodyMedium,
          },
        ]}>
        {label}
      </Text>

      <View
        style={[
          styles.row,
          {minHeight: s(theme.hit) - s(18), width: fullWidth ? '100%' : '82%'},
        ]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={secure && !revealed}
          placeholder={placeholder}
          placeholderTextColor={theme.text.placeholder}
          accessibilityLabel={label}
          accessibilityHint={error ?? helper}
          style={[
            styles.input,
            {fontSize: s(theme.size.body), paddingVertical: s(8)},
          ]}
          {...inputProps}
        />
        {secure && (
          <Pressable
            onPress={() => setRevealed((r: boolean) => !r)}
            hitSlop={14}
            accessibilityRole="button"
            accessibilityLabel={revealed ? 'Hide password' : 'Show password'}>
            <EyeIcon size={s(18)} color={theme.text.secondary} off={revealed} />
          </Pressable>
        )}
      </View>

      <View
        style={{
          height: active ? s(2) : s(1),
          width: fullWidth ? '100%' : '82%',
          backgroundColor: ruleColor,
        }}
      />

      {!!error && (
        <View style={[styles.errorRow, {marginTop: s(6), gap: s(5)}]}>
          <AlertIcon size={s(13)} color={theme.text.danger} />
          <Text
            style={[styles.helper, {fontSize: s(theme.size.label), color: theme.text.danger}]}>
            {error}
          </Text>
        </View>
      )}
      {!error && !!helper && (
        <Text
          style={[
            styles.helper,
            {fontSize: s(theme.size.label), color: theme.text.secondary, marginTop: s(5)},
          ]}>
          {helper}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {textTransform: 'uppercase'},
  row: {flexDirection: 'row', alignItems: 'center'},
  input: {
    flex: 1,
    fontFamily: theme.font.body,
    color: theme.text.primary,
  },
  errorRow: {flexDirection: 'row', alignItems: 'center'},
  helper: {fontFamily: theme.font.body},
});
