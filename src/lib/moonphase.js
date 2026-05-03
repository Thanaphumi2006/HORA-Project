const KNOWN_NEW_MOON = new Date(2000, 0, 6, 18, 14, 0);
const CYCLE = 29.53059;

export function getMoonPhase(date = new Date()) {
  const days = (date - KNOWN_NEW_MOON) / 86400000;
  const phase = ((days % CYCLE) + CYCLE) % CYCLE;
  if (phase < 1.85)  return { name: 'New Moon',        emoji: '🌑', pct: 0 };
  if (phase < 5.53)  return { name: 'Waxing Crescent', emoji: '🌒', pct: Math.round((phase / 7.38) * 50) };
  if (phase < 9.22)  return { name: 'First Quarter',   emoji: '🌓', pct: 50 };
  if (phase < 12.91) return { name: 'Waxing Gibbous',  emoji: '🌔', pct: Math.round(50 + ((phase - 9.22) / 7.38) * 50) };
  if (phase < 16.61) return { name: 'Full Moon',        emoji: '🌕', pct: 100 };
  if (phase < 20.30) return { name: 'Waning Gibbous',  emoji: '🌖', pct: Math.round(100 - ((phase - 16.61) / 7.38) * 50) };
  if (phase < 23.99) return { name: 'Last Quarter',    emoji: '🌗', pct: 50 };
  return { name: 'Waning Crescent', emoji: '🌘', pct: Math.round(((29.53 - phase) / 7.38) * 50) };
}
