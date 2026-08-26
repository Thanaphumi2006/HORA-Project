/**
 * The kitsune mascot.
 *
 * Sourced from the artwork supplied on 2026-08-26, with the flat background
 * knocked out to transparency and exported at 1x/2x/3x (163x200 up to 488x600).
 *
 * Indirected through this module rather than `require`d at each call site so a
 * missing asset degrades to "no mascot" instead of failing the whole bundle —
 * Metro errors on an unresolved asset path.
 */
import type {ImageSourcePropType} from 'react-native';

export const mascot: ImageSourcePropType | null = require('./kitsune.png');

export default mascot;
