/**
 * HORA design tokens.
 *
 * Colours come from the brand boards. They are split by ROLE because the
 * primary lavenders cannot carry text — every ratio below is measured against
 * the cream ground (#F9F2E7) and the white card (#FFFFFF):
 *
 *   #ABA3C7  2.15:1   surface only
 *   #7F7B9D  3.62:1   borders and rules only (passes the 3:1 non-text bar)
 *   #8D70B7  3.68:1   surface only
 *   #6F6598  4.73:1   secondary text, labels
 *   #4E456F  7.85:1   primary text, filled buttons
 *
 * Use `text.*` for anything readable and `surface.*` for anything painted.
 */

export const palette = {
  cream: '#F9F2E7',
  card: '#FFFFFF',
  cardWarm: '#FFFBF8',
  waveTop: '#ECE9F3',
  waveBack: '#DCD9F9',
  lavenderPale: '#DCD9F9',
  lavenderMid: '#ABA3C7',
  lavenderRule: '#7F7B9D',
  ink: '#4E456F',
  inkSoft: '#6F6598',
  hairline: '#DCD9E6',
  danger: '#8C2F39',
  onInk: '#FFFBF8',
} as const;

export const theme = {
  surface: {
    screen: palette.cream,
    card: palette.card,
    waveFront: palette.waveTop,
    waveBack: palette.waveBack,
    /** Primary filled button. White on this is 8.49:1. */
    action: palette.ink,
  },
  text: {
    primary: palette.ink,
    secondary: palette.inkSoft,
    /** Distinct from `primary` so an empty field never looks filled. */
    placeholder: palette.inkSoft,
    onAction: palette.onInk,
    danger: palette.danger,
  },
  line: {
    /** Resting input rule. 3.91:1 on white — meets SC 1.4.11. */
    rule: palette.lavenderRule,
    ruleActive: palette.ink,
    ruleDanger: palette.danger,
    hairline: palette.hairline,
  },
  /** 8pt grid, per the brand board's spacing system. */
  space: {xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48} as const,
  /** Radius scale from the brand board: 12 / 16 / 20 / 24. */
  radius: {sm: 12, md: 16, lg: 20, xl: 24, slab: 58, pill: 40} as const,
  /** Soft shadow, per the brand board: X0 Y6 blur20 opacity 6%. */
  shadow: {
    shadowColor: palette.ink,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 3,
  },
  font: {
    /** Display only — never below 20px. Cormorant is too light to hold at small sizes. */
    display: 'CormorantGaramond-SemiBold',
    /**
     * The large onboarding questions. Family name carries the weight — never
     * pair this with fontWeight, or Android stacks a synthetic bold on top of
     * the real one and the letterforms smear.
     */
    displayBold: 'CormorantGaramond-Bold',
    body: 'Kodchasan-Regular',
    bodyMedium: 'Kodchasan-Medium',
    bodySemi: 'Kodchasan-SemiBold',
  },
  size: {title: 56, wordmark: 20, body: 16.5, label: 11, meta: 12},
  /** Minimum tappable size — SC 2.5.8, iOS HIG, Material. */
  hit: 48,
} as const;

/**
 * The old code used `width / 375` unclamped, which produced a 131px title and
 * pushed content 361px below the fold on an iPad. Clamping keeps phone
 * proportions and stops tablets exploding.
 */
export const getScale = (width: number) =>
  Math.min(Math.max(width / 375, 0.92), 1.2);

/**
 * Vertical companion to `getScale`. Spacing driven only by width left a dead
 * bottom third on tall screens and clipped short ones, so rhythm tracks height
 * while type and radii keep tracking width.
 */
export const getVerticalScale = (height: number) =>
  Math.min(Math.max(height / 812, 0.85), 1.25);

export default theme;
