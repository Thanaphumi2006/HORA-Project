const P = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.7',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function ZodiacSymbol({ sign, size = 22, className }) {
  const svg = { viewBox: '0 0 24 24', width: size, height: size, className };

  switch (sign) {
    case 'Aries':
      return (
        <svg {...svg}>
          <path {...P} d="M12 12C12 8 6.5 5 5 9.5C3.5 13.5 6 16.5 9 16.5" />
          <path {...P} d="M12 12C12 8 17.5 5 19 9.5C20.5 13.5 18 16.5 15 16.5" />
          <line {...P} x1="12" y1="12" x2="12" y2="20" />
        </svg>
      );

    case 'Taurus':
      return (
        <svg {...svg}>
          <circle {...P} cx="12" cy="16" r="5" />
          <path {...P} d="M7 12.5C7 6.5 17 6.5 17 12.5" />
        </svg>
      );

    case 'Gemini':
      return (
        <svg {...svg}>
          <line {...P} x1="8" y1="4" x2="8" y2="20" />
          <line {...P} x1="16" y1="4" x2="16" y2="20" />
          <line {...P} x1="8" y1="4" x2="16" y2="4" />
          <line {...P} x1="8" y1="20" x2="16" y2="20" />
        </svg>
      );

    case 'Cancer':
      return (
        <svg {...svg}>
          {/* top arc opening left, circle at right end */}
          <path {...P} d="M6.5 9.5A5 5 0 0 1 15.5 9.5" />
          <circle {...P} cx="16.5" cy="9.5" r="1.8" />
          {/* bottom arc opening right, circle at left end */}
          <path {...P} d="M17.5 14.5A5 5 0 0 1 8.5 14.5" />
          <circle {...P} cx="7.5" cy="14.5" r="1.8" />
        </svg>
      );

    case 'Leo':
      return (
        <svg {...svg}>
          <circle {...P} cx="9.5" cy="16" r="4.5" />
          {/* tail curling from circle up to the right */}
          <path {...P} d="M14 15.5C15.5 13.5 19.5 12.5 19 9C18.5 6 15.5 5 13.5 7C12 8.5 13 11 15 11" />
        </svg>
      );

    case 'Virgo':
      return (
        <svg {...svg}>
          <path {...P} d="M5 19V10C5 7 8.5 7 8.5 10V18" />
          <path {...P} d="M8.5 10C8.5 7 12 7 12 10V18" />
          <path {...P} d="M12 10C12 7 15.5 7 15.5 10V16C15.5 20.5 19 21.5 20.5 19" />
        </svg>
      );

    case 'Libra':
      return (
        <svg {...svg}>
          {/* arc bump */}
          <path {...P} d="M8.5 14A3.5 3.5 0 0 1 15.5 14" />
          {/* middle line */}
          <line {...P} x1="3" y1="14" x2="21" y2="14" />
          {/* bottom line */}
          <line {...P} x1="3" y1="18.5" x2="21" y2="18.5" />
        </svg>
      );

    case 'Scorpio':
      return (
        <svg {...svg}>
          {/* three humps */}
          <path {...P} d="M4 8V15C4 18 7 18 7 15C7 18 10 18 10 15C10 18 13 18 13 15V9" />
          {/* stinger going upper-right */}
          <path {...P} d="M13 12.5L18 7.5" />
          <path {...P} d="M15.5 7.5H18V10" />
        </svg>
      );

    case 'Sagittarius':
      return (
        <svg {...svg}>
          {/* diagonal shaft */}
          <line {...P} x1="4.5" y1="19.5" x2="19.5" y2="4.5" />
          {/* arrowhead */}
          <polyline {...P} points="11,4.5 19.5,4.5 19.5,13" />
        </svg>
      );

    case 'Capricorn':
      return (
        <svg {...svg}>
          {/* left horn of V going down */}
          <path {...P} d="M4 5C6 8 9 13 11 18" />
          {/* right side sweeps down then spirals into a loop */}
          <path {...P} d="M20 5C20 11 18 15 15 16.5C12 18 11 16 12 14.5C13 13 15.5 14 15.5 16.5C15.5 19 13.5 20.5 11.5 20" />
        </svg>
      );

    case 'Aquarius':
      return (
        <svg {...svg}>
          <path {...P} d="M3 10Q6 6.5 9 10Q12 13.5 15 10Q18 6.5 21 10" />
          <path {...P} d="M3 16Q6 12.5 9 16Q12 19.5 15 16Q18 12.5 21 16" />
        </svg>
      );

    case 'Pisces':
      return (
        <svg {...svg}>
          {/* left fish arc curving left */}
          <path {...P} d="M8 4C4 4 3 8 3 12C3 16 4 20 8 20" />
          {/* right fish arc curving right */}
          <path {...P} d="M16 4C20 4 21 8 21 12C21 16 20 20 16 20" />
          {/* connecting bar */}
          <line {...P} x1="3" y1="12" x2="21" y2="12" />
        </svg>
      );

    default:
      return (
        <svg {...svg}>
          <circle {...P} cx="12" cy="12" r="5" />
          <line {...P} x1="12" y1="7" x2="12" y2="17" />
          <line {...P} x1="7" y1="12" x2="17" y2="12" />
        </svg>
      );
  }
}
