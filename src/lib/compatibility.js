const elements = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water',
};

export const zodiacSymbols = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

const elementOrder = ['Fire', 'Earth', 'Air', 'Water'];

const elementPairs = {
  'Fire-Fire': {
    love: 84, friendship: 78, work: 68,
    description: "Two flames burning side by side — this pairing crackles with passion, ambition, and raw energy. You push each other to dream bigger and move faster. The danger is that when egos collide, even a small spark can become a wildfire.",
    tip: "Take turns leading. Channel the shared fire into one bold goal rather than two competing ones.",
  },
  'Fire-Earth': {
    love: 52, friendship: 60, work: 72,
    description: "Fire leaps; Earth steadies. Your rhythms rarely sync naturally — one wants to sprint, the other prefers to walk. But when you lean into the contrast, Fire sparks the vision and Earth turns it into something real.",
    tip: "Resist the urge to convert each other. The friction between you produces progress neither could manage alone.",
  },
  'Fire-Air': {
    love: 87, friendship: 86, work: 79,
    description: "Air feeds Fire's flame and Fire fills Air's ideas with heat. Your connection is electric — you finish each other's thoughts, share restless curiosity, and rarely run out of things to say or explore together.",
    tip: "When conflict comes, Air goes cold while Fire goes hot. Slow down and meet each other halfway before things escalate.",
  },
  'Fire-Water': {
    love: 62, friendship: 55, work: 47,
    description: "Fire warms Water's depths; Water tempers Fire's intensity. There's real chemistry here, but the elements are fundamentally at odds. Patience is everything — too much pressure and you turn each other to steam.",
    tip: "Fire: listen more than you react. Water: say your needs out loud rather than waiting for Fire to read your mind.",
  },
  'Earth-Earth': {
    love: 79, friendship: 83, work: 88,
    description: "Two builders, one shared foundation. Your bond is built on loyalty, reliability, and shared values. Life together is warm and steady — sometimes almost too predictable, but always trustworthy when it matters most.",
    tip: "Actively choose novelty. Your strength is follow-through, so treat spontaneity like any other shared goal: plan for it.",
  },
  'Earth-Air': {
    love: 48, friendship: 56, work: 64,
    description: "Earth craves certainty and roots; Air craves freedom and new horizons. At your best, practical plans meet creative vision. At your worst, one feels suffocated and the other feels unanchored.",
    tip: "Earth: release the schedule occasionally. Air: follow through on one more commitment than feels comfortable.",
  },
  'Earth-Water': {
    love: 84, friendship: 83, work: 76,
    description: "A naturally nourishing pair. Water flows into the cracks of Earth and brings it to life; Earth gives Water a safe, steady shore. This is the kind of bond that quietly deepens over years without needing drama to prove it's real.",
    tip: "When Water withdraws inward, Earth should stay present rather than pushing. Silence is not rejection — it's recharging.",
  },
  'Air-Air': {
    love: 74, friendship: 86, work: 79,
    description: "Two minds in constant conversation — clever, stimulating, and almost never boring. Your bond is built on wit, ideas, and shared curiosity. The risk is that you keep things so light that real emotional depth never gets room to breathe.",
    tip: "Make time for genuine vulnerability. The relationship needs more than a meeting of minds — let it be a meeting of hearts too.",
  },
  'Air-Water': {
    love: 64, friendship: 66, work: 59,
    description: "Thought meets feeling in an unpredictable dance. Air brings lightness and perspective to Water's emotional depths; Water brings meaning and intuition to Air's ideas. Miscommunication is the main hazard here.",
    tip: "Air: validate the emotion before you explain the logic. Water: put feelings into words instead of hoping Air senses them.",
  },
  'Water-Water': {
    love: 82, friendship: 79, work: 68,
    description: "An ocean of shared empathy. You understand each other's unspoken language, intuit moods before they're named, and create a deeply safe space together. The shadow side: you can amplify each other's anxieties without meaning to.",
    tip: "Keep individual boundaries clear. Your depth is a gift — protect it by holding onto the parts of yourself that belong only to you.",
  },
};

export function getCompatibility(sign1, sign2) {
  const e1 = elements[sign1];
  const e2 = elements[sign2];
  const sorted = [e1, e2].sort((a, b) => elementOrder.indexOf(a) - elementOrder.indexOf(b));
  const key = sorted.join('-');

  const base = elementPairs[key];
  let love = base.love;
  let friendship = base.friendship;
  let work = base.work;

  if (sign1 === sign2) {
    love = Math.min(100, love + 8);
    friendship = Math.min(100, friendship + 6);
  }

  const overall = Math.round((love + friendship + work) / 3);

  return {
    love, friendship, work, overall,
    element1: e1, element2: e2,
    symbol1: zodiacSymbols[sign1],
    symbol2: zodiacSymbols[sign2],
    description: base.description,
    tip: base.tip,
  };
}
