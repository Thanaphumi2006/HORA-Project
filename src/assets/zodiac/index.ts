import type {ImageSourcePropType} from 'react-native';

/**
 * Sign mascots, keyed by the lowercase sign name.
 *
 * Sourced from the supplied artwork: background knocked out to transparency,
 * cropped to the subject, then fitted to an identical 160px square (320/480 at
 * 2x/3x) so every sign occupies the same footprint on the card. The art itself
 * has wildly different aspect ratios, so without that normalisation the mascots
 * would jump in size between signs.
 *
 * `require` needs a literal path, hence the explicit map rather than a loop.
 */
export const ZODIAC_ART: Record<string, ImageSourcePropType> = {
  aries: require('./aries.png'),
  taurus: require('./taurus.png'),
  gemini: require('./gemini.png'),
  cancer: require('./cancer.png'),
  leo: require('./leo.png'),
  virgo: require('./virgo.png'),
  libra: require('./libra.png'),
  scorpio: require('./scorpio.png'),
  sagittarius: require('./sagittarius.png'),
  capricorn: require('./capricorn.png'),
  aquarius: require('./aquarius.png'),
  pisces: require('./pisces.png'),
};

export default ZODIAC_ART;
