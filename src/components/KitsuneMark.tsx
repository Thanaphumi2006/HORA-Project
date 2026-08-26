import React from 'react';
import Svg, {Circle, G, Path} from 'react-native-svg';
import {palette} from '../theme';

type Props = {width: number; height: number};

const OUTLINE = palette.lavenderMid;
const FILL = palette.card;
const ACCENT = palette.lavenderPale;
const SOFT = palette.hairline;

/**
 * STAND-IN for the kitsune artwork, drawn to match the reference: pale lavender
 * line art, sitting pose, curled tail with a filled tip, closed eyes, forehead
 * gem, clover and sparkles.
 *
 * The real `kitsune.png` was never delivered with the design handoff. Every
 * colour comes from the palette — the reference's green clover is rendered in
 * the lavender family instead, since the theme has no green token and its
 * values are not to be edited.
 *
 * To replace: drop `kitsune.png` (+ @2x/@3x) into src/assets and point
 * src/assets/mascot.ts at it. Splash prefers the real image automatically, and
 * this file can then be deleted.
 */
export default function KitsuneMark({width, height}: Props) {
  const stroke = {
    stroke: OUTLINE,
    strokeWidth: 2.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <Svg width={width} height={height} viewBox="0 0 200 190">
      {/* ---------- tail, behind the body ---------- */}
      <Path
        d="M118 150 C158 152 180 130 176 106 C172 82 148 72 134 86 C122 98 128 118 143 120"
        fill={FILL}
        {...stroke}
      />
      <Path
        d="M143 120 C128 118 122 98 134 86 C140 80 148 79 155 82 C146 92 142 106 143 120 Z"
        fill={ACCENT}
        {...stroke}
      />

      {/* ---------- body ---------- */}
      <Path
        d="M58 98 C48 118 46 140 58 152 C74 164 108 164 122 152 C134 141 130 118 120 98 Z"
        fill={FILL}
        {...stroke}
      />

      {/* ---------- ears ---------- */}
      <Path d="M52 48 C47 28 48 16 52 8 C65 17 75 29 80 40 Z" fill={FILL} {...stroke} />
      <Path d="M118 48 C123 28 122 16 118 8 C105 17 95 29 90 40 Z" fill={FILL} {...stroke} />
      <Path d="M57 42 C54 29 55 21 57 16 C64 22 70 30 73 38 Z" fill={ACCENT} />
      <Path d="M113 42 C116 29 115 21 113 16 C106 22 100 30 97 38 Z" fill={ACCENT} />

      {/* ---------- head ---------- */}
      <Path
        d="M85 32 C112 32 128 50 128 72 C128 95 110 110 85 110 C60 110 42 95 42 72 C42 50 58 32 85 32 Z"
        fill={FILL}
        {...stroke}
      />

      {/* forehead gem */}
      <G>
        <Path d="M85 42 L90 51 L85 60 L80 51 Z" fill={ACCENT} {...stroke} strokeWidth={1.6} />
        <Path d="M78 46 L74 51 M92 46 L96 51" {...stroke} strokeWidth={1.6} fill="none" />
      </G>

      {/* closed, happy eyes */}
      <Path d="M64 76 C68 82 76 82 80 76" {...stroke} fill="none" />
      <Path d="M90 76 C94 82 102 82 106 76" {...stroke} fill="none" />

      {/* muzzle + nose */}
      <Path d="M85 88 L90 93 C88 96 86 97 85 97 C84 97 82 96 80 93 Z" fill={OUTLINE} />
      <Path d="M85 97 L85 101 M85 101 C82 104 78 104 76 101 M85 101 C88 104 92 104 94 101" {...stroke} strokeWidth={1.8} fill="none" />

      {/* ---------- clover ---------- */}
      <G>
        <Path d="M62 128 C56 122 46 124 46 132 C46 139 55 141 61 136 Z" fill={SOFT} {...stroke} strokeWidth={1.8} />
        <Path d="M64 126 C60 118 64 109 71 112 C77 115 76 124 68 128 Z" fill={SOFT} {...stroke} strokeWidth={1.8} />
        <Path d="M68 132 C76 128 84 134 81 140 C78 146 69 143 66 136 Z" fill={SOFT} {...stroke} strokeWidth={1.8} />
        <Path d="M62 138 C58 146 62 154 69 151 C75 148 73 140 66 138 Z" fill={SOFT} {...stroke} strokeWidth={1.8} />
        <Path d="M66 134 C70 142 74 150 76 158" {...stroke} strokeWidth={1.8} fill="none" />
      </G>

      {/* ---------- sparkles ---------- */}
      <Path
        d="M170 62 C171 70 174 73 181 74 C174 75 171 78 170 86 C169 78 166 75 159 74 C166 73 169 70 170 62 Z"
        fill={ACCENT}
      />
      <Path
        d="M186 92 C187 97 189 99 193 100 C189 101 187 103 186 108 C185 103 183 101 179 100 C183 99 185 97 186 92 Z"
        fill={ACCENT}
      />
      <Circle cx="156" cy="96" r="2.4" fill={ACCENT} />
    </Svg>
  );
}
