import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFadeNavigate } from '../lib/useFadeNavigate.js';
import { getZodiac, monthNames } from '../lib/zodiac.js';
import { deckMap, typeColors, zodiacTarotMap } from '../lib/tarot.js';
import { getCurrentUser, saveRecord } from '../lib/auth.js';
import './TarotResult.css';

function ShareButton({ text, title }) {
  const [copied, setCopied] = useState(false);
  async function handleShare() {
    if (navigator.share) {
      try { await navigator.share({ title, text }); } catch (_) {}
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  }
  return (
    <button className="btn-share" onClick={handleShare}>
      {copied ? (
        <><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>Copied!</>
      ) : (
        <><svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>Share</>
      )}
    </button>
  );
}

function MiniCardImage({ src, alt, fallback, gradient }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="mini-card-fallback" style={{ background: gradient }}>
        <span style={{ fontSize: '34px' }}>{fallback}</span>
      </div>
    );
  }
  return <img className="mini-card-img" src={src} alt={alt} onError={() => setFailed(true)} />;
}

export default function TarotResult() {
  const fadeNavigate = useFadeNavigate();
  const [params] = useSearchParams();

  const name = params.get('name') || '';
  const day = params.get('day') || '';
  const monthStr = params.get('month') || 'January';
  const year = params.get('year') || '';
  const cardIds = (params.get('cards') || '').split(',').filter(Boolean);

  const monthNum = monthNames.indexOf(monthStr) + 1;
  const zodiac = useMemo(() => getZodiac(day, monthNum), [day, monthNum]);
  const rulingId = zodiacTarotMap[zodiac] || 'maj18';
  const rulingCard = deckMap[rulingId];

  const bdayQ = `name=${encodeURIComponent(name)}&day=${day}&month=${encodeURIComponent(monthStr)}&year=${year}`;
  const cards = cardIds.map(id => deckMap[id]).filter(Boolean);

  const todayDate = useMemo(() =>
    new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), []);
  const isoDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const shareText = [
    rulingCard ? `${zodiac}'s Ruling Card: ${rulingCard.name}\n${rulingCard.up}` : '',
    ...cards.map((c, i) => `Card ${i + 1}: ${c.name}\n${c.up}`),
  ].filter(Boolean).join('\n\n');

  // Save tarot reading to history
  useEffect(() => {
    const user = getCurrentUser();
    if (!user || cards.length === 0) return;
    saveRecord(user.email, {
      type: 'tarot',
      isoDate,
      date: todayDate,
      zodiac,
      name: name || user.displayName,
      cards: cards.map(c => ({ id: c.id, name: c.name, keywords: c.keywords, up: c.up, symbol: c.symbol, type: c.type })),
      rulingCard: rulingCard ? { id: rulingCard.id, name: rulingCard.name, up: rulingCard.up } : null,
    });
  }, []);

  function handleBack(e) {
    e.preventDefault();
    fadeNavigate(`/tarot?${bdayQ}`);
  }

  function handleHome(e) {
    e.preventDefault();
    fadeNavigate(`/home?${bdayQ}`);
  }

  return (
    <div className="page tarot-result-page">
      <div className="tr-header">
        <a className="btn-back" href="#/" onClick={handleBack}>
          <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
        </a>
        <span className="page-title">Card Prediction</span>
        <ShareButton text={shareText} title={`${zodiac} Tarot Reading`} />
      </div>

      {rulingCard && (
        <div className="first-card-banner">
          <div className="banner-label">Your Ruling Card · Today's Prediction</div>
          <div className="banner-card-name">{rulingCard.name}  ·  {zodiac}'s Ruling Card</div>
          <div className="banner-text">{rulingCard.up}</div>
        </div>
      )}

      <div className="section-label">Your Selected Cards</div>
      <div className="result-list">
        {cards.map((card, idx) => {
          const [c1, c2] = typeColors[card.type] || ['#0f1f3d', '#1a3a5c'];
          return (
            <div
              key={card.id}
              className="result-row"
              style={{ animationDelay: `${idx * 0.12}s` }}
            >
              <div className="mini-card">
                <MiniCardImage
                  src={card.img}
                  alt={card.name}
                  fallback={card.symbol}
                  gradient={`linear-gradient(160deg, ${c1}, ${c2})`}
                />
                <div className="mini-card-label">{card.name}</div>
              </div>
              <div className="result-meaning">
                <div className="meaning-number">Card {idx + 1} of 3</div>
                <div className="meaning-name">{card.name}</div>
                <div className="meaning-type">
                  {card.type === 'Major' ? 'Major Arcana' : `${card.type} · Minor Arcana`}
                </div>
                <div className="meaning-keywords">{card.keywords}</div>
                <div className="meaning-divider"></div>
                <div className="meaning-up-label">Upright Meaning</div>
                <div className="meaning-text">{card.up}</div>
              </div>
            </div>
          );
        })}
      </div>

      <a className="btn-home" href="#/" onClick={handleHome}>Back to Home</a>
    </div>
  );
}
