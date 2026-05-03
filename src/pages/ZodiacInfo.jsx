import { useSearchParams } from 'react-router-dom';
import { useFadeNavigate } from '../lib/useFadeNavigate.js';
import { zodiacInfoData, elementColors } from '../lib/zodiacinfo.js';
import { ZodiacSymbol } from '../lib/ZodiacSymbols.jsx';
import './ZodiacInfo.css';

export default function ZodiacInfo() {
  const fadeNavigate = useFadeNavigate();
  const [params] = useSearchParams();
  const zodiac = params.get('zodiac') || 'Pisces';
  const bdayQ = `name=${encodeURIComponent(params.get('name') || '')}&day=${params.get('day') || ''}&month=${encodeURIComponent(params.get('month') || '')}&year=${params.get('year') || ''}`;

  const info = zodiacInfoData[zodiac] || zodiacInfoData.Pisces;
  const ec = elementColors[info.element] || elementColors.Water;

  function handleBack(e) {
    e.preventDefault();
    fadeNavigate(`/home?${bdayQ}`);
  }

  return (
    <div className="page zodiac-info-page">
      <div className="zi-sparkles" aria-hidden="true">
        <span className="zi-sp zi-sp-1">✦</span>
        <span className="zi-sp zi-sp-2">✦</span>
        <span className="zi-sp zi-sp-3">✦</span>
        <span className="zi-sp zi-sp-4">✦</span>
      </div>

      <div className="zi-header">
        <a className="btn-back" href="#/" onClick={handleBack}>
          <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
        </a>
        <span className="zi-title">{zodiac}</span>
        <span className="zi-symbol">{info.symbol}</span>
      </div>

      <div className="zi-hero">
        <div className="zi-symbol-big">
          <ZodiacSymbol sign={zodiac} size={60} />
        </div>
        <div className="zi-dates">{info.dates}</div>
        <div className="zi-badges">
          <span className="zi-badge" style={{ background: ec.bg, border: `1px solid ${ec.border}`, color: ec.text }}>
            {info.element}
          </span>
          <span className="zi-badge zi-badge-mode">{info.mode}</span>
          <span className="zi-badge zi-badge-planet">☽ {info.planet}</span>
        </div>
      </div>

      <div className="zi-desc-card">
        <p className="zi-desc">{info.description}</p>
      </div>

      <div className="zi-section-label">Strengths</div>
      <div className="zi-traits-row">
        {info.traits.map(t => (
          <span key={t} className="zi-trait zi-trait-pos">{t}</span>
        ))}
      </div>

      <div className="zi-section-label">Growth Areas</div>
      <div className="zi-traits-row">
        {info.shadow.map(t => (
          <span key={t} className="zi-trait zi-trait-shadow">{t}</span>
        ))}
      </div>

      <div className="zi-section-label">Compatible Signs</div>
      <div className="zi-compat-row">
        {info.compatible.map(sign => {
          const s = zodiacInfoData[sign];
          return (
            <div key={sign} className="zi-compat-chip">
              <span className="zi-compat-sym">
                <ZodiacSymbol sign={sign} size={16} />
              </span>
              <span className="zi-compat-name">{sign}</span>
            </div>
          );
        })}
      </div>

      <div className="zi-section-label">Lucky Numbers</div>
      <div className="zi-lucky-row">
        {info.lucky.map(n => (
          <span key={n} className="zi-lucky-num" style={{ background: info.color + '22', color: info.color, borderColor: info.color + '55' }}>
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}
