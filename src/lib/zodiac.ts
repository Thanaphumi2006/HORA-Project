export type Sign = {
  name: string;
  range: string;
  /** Stored unattributed and without quote marks — the component supplies the
   *  typographic quotes. */
  quote: string;
};

/**
 * Each sign carries a quotation rather than a character description — the Terms
 * commit to framing everything as reflection, never as a claim about the reader.
 */
const SIGNS: Record<string, Sign> = {
  capricorn: {
    name: 'Capricorn',
    range: '22 Dec – 19 Jan',
    quote:
      'How wonderful that we have met with a paradox. Now we have some hope of making progress.',
  },
  aquarius: {
    name: 'Aquarius',
    range: '20 Jan – 18 Feb',
    quote:
      'Each new hour holds new chances for a new beginning.',
  },
  pisces: {
    name: 'Pisces',
    range: '19 Feb – 20 Mar',
    quote:
      'Never doubt that a small group of thoughtful, concerned citizens can change the world.',
  },
  aries: {
    name: 'Aries',
    range: '21 Mar – 19 Apr',
    quote:
      'You have to go out there and make it happen.',
  },
  taurus: {
    name: 'Taurus',
    range: '20 Apr – 20 May',
    quote:
      'I am simple, complex, generous, selfish, unattractive, beautiful, lazy and driven.',
  },
  gemini: {
    name: 'Gemini',
    range: '21 May – 20 Jun',
    quote:
      'The important thing is not to stop questioning. Curiosity has its own reason for existing.',
  },
  cancer: {
    name: 'Cancer',
    range: '21 Jun – 22 Jul',
    quote:
      '...the only cure for loneliness, despair and hopelessness is love.',
  },
  leo: {
    name: 'Leo',
    range: '23 Jul – 22 Aug',
    quote:
      'One should train in deeds of merit... that yield long-lasting happiness.',
  },
  virgo: {
    name: 'Virgo',
    range: '23 Aug – 22 Sep',
    quote:
      'Power and machinery, money and goods, are useful only as they set us free to live.',
  },
  libra: {
    name: 'Libra',
    range: '23 Sep – 22 Oct',
    quote:
      '...never give in except to convictions of honour and good sense.',
  },
  scorpio: {
    name: 'Scorpio',
    range: '23 Oct – 21 Nov',
    quote:
      'If you shift your focus from yourself to others... this will have the immediate effect of opening up your life.',
  },
  sagittarius: {
    name: 'Sagittarius',
    range: '22 Nov – 21 Dec',
    quote:
      'The universe is full of magical things patiently waiting for our senses to grow sharper.',
  },
};

/**
 * [cusp day, sign at or after the cusp, sign before it] for each month.
 * Indexed 1-12; index 0 is unused.
 */
const CUSPS: Array<[number, string, string]> = [
  [0, '', ''],
  [20, 'aquarius', 'capricorn'], // Jan
  [19, 'pisces', 'aquarius'], // Feb
  [21, 'aries', 'pisces'], // Mar
  [20, 'taurus', 'aries'], // Apr
  [21, 'gemini', 'taurus'], // May
  [21, 'cancer', 'gemini'], // Jun
  [23, 'leo', 'cancer'], // Jul
  [23, 'virgo', 'leo'], // Aug
  [23, 'libra', 'virgo'], // Sep
  [23, 'scorpio', 'libra'], // Oct
  [22, 'sagittarius', 'scorpio'], // Nov
  [22, 'capricorn', 'sagittarius'], // Dec
];

/** month is 1-12. */
export function signFor(month: number, day: number): Sign {
  const m = Math.min(12, Math.max(1, Math.round(month)));
  const [cusp, onOrAfter, before] = CUSPS[m];
  return SIGNS[day >= cusp ? onOrAfter : before];
}

/** month is 1-12. Handles leap years, so 31 February can never validate. */
export function daysInMonth(month: number, year: number): number {
  if (month === 2) {
    const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    return leap ? 29 : 28;
  }
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

export const MONTH_ABBR = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

/** Accepts "3", "03", "mar", "MAR". Returns 1-12, or 0 when unparseable. */
export function parseMonth(raw: string): number {
  const t = raw.trim().toUpperCase();
  if (!t) {
    return 0;
  }
  if (/^\d{1,2}$/.test(t)) {
    const n = parseInt(t, 10);
    return n >= 1 && n <= 12 ? n : 0;
  }
  const i = MONTH_ABBR.indexOf(t.slice(0, 3));
  return i >= 0 ? i + 1 : 0;
}
