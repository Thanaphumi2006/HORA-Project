import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFadeNavigate } from '../lib/useFadeNavigate.js';
import { deck, shuffle } from '../lib/tarot.js';
import './Tarot.css';

const MAX = 3;

function suitFallback(type) {
  if (type === 'Wands') return '🔥';
  if (type === 'Cups') return '💧';
  if (type === 'Swords') return '💨';
  if (type === 'Pentacles') return '🌱';
  return '✦';
}

export default function Tarot() {
  const fadeNavigate = useFadeNavigate();
  const [params] = useSearchParams();

  const name = params.get('name') || '';
  const day = params.get('day') || '';
  const monthStr = params.get('month') || '';
  const year = params.get('year') || '';
  const bdayQ = `name=${encodeURIComponent(name)}&day=${day}&month=${encodeURIComponent(monthStr)}&year=${year}`;

  // Stable shuffle for the lifetime of this mounted page.
  const hand = useMemo(() => shuffle(deck).slice(0, 6), []);
  const [flipped, setFlipped] = useState([]);

  function handleBack(e) {
    e.preventDefault();
    fadeNavigate(`/home?${bdayQ}`);
  }

  function flip(card) {
    if (flipped.includes(card.id)) return;
    if (flipped.length >= MAX) return;
    setFlipped([...flipped, card.id]);
  }

  function handleSeeReading() {
    fadeNavigate(`/tarot-result?${bdayQ}&cards=${encodeURIComponent(flipped.join(','))}`);
  }

  return (
    <div className="page tarot-page">
      <div className="tarot-header">
        <a className="btn-back" href="#/" onClick={handleBack}>
          <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
        </a>
        <div className="menu-icon"><span></span><span></span><span></span></div>
      </div>

      <div className="title-wrap">
        <div className="page-title">Tarot Reading</div>
        <div className="page-sub">Flip 3 Cards</div>
      </div>

      <div className="counter">
        <div className="counter-dots">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`counter-dot${i < flipped.length ? ' filled' : ''}`}></div>
          ))}
        </div>
        <span>{flipped.length} / {MAX} Flipped</span>
      </div>

      <div className="card-grid">
        {hand.map((card) => {
          const isFlipped = flipped.includes(card.id);
          const isDisabled = !isFlipped && flipped.length >= MAX;
          return (
            <div
              key={card.id}
              className={`card-wrap${isFlipped ? ' flipped' : ''}${isDisabled ? ' disabled' : ''}`}
              onClick={() => flip(card)}
            >
              <div className="card-inner">
                <div className="card-back">
                  <div className="card-back-inner">
                    <span className="card-back-star">✦</span>
                    <div className="card-back-dots">
                      <span></span><span></span><span></span><span></span><span></span>
                    </div>
                    <span className="card-back-text">Hora</span>
                  </div>
                </div>
                <div className="card-face">
                  <CardFaceImage src={card.img} alt={card.name} fallback={suitFallback(card.type)} />
                  <div className="card-face-name">{card.name}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        className={`btn-reading${flipped.length >= MAX ? ' visible' : ''}`}
        onClick={handleSeeReading}
      >
        See Your Reading
      </button>
    </div>
  );
}

function CardFaceImage({ src, alt, fallback }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="card-face-fallback">
        <span style={{ fontSize: '36px' }}>{fallback}</span>
      </div>
    );
  }
  return <img className="card-face-img" src={src} alt={alt} onError={() => setFailed(true)} />;
}
