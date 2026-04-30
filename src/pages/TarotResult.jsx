import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFadeNavigate } from '../lib/useFadeNavigate.js';
import { getZodiac, monthNames } from '../lib/zodiac.js';
import { deckMap, typeColors, zodiacTarotMap } from '../lib/tarot.js';
import { getLastSent, getSavedEmail, recordSent, saveEmail, sendEmail } from '../lib/email.js';
import './TarotResult.css';

const SENDING_SVG = (
  <svg viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
    <path d="M12 2a10 10 0 1 0 10 10" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const CHECK_SVG = (
  <svg viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ENVELOPE_SVG = (
  <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 7 10-7" /></svg>
);

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

  const [emailValue, setEmailValue] = useState(getSavedEmail());
  const [emailStatus, setEmailStatus] = useState({ text: '', kind: '' });
  const [emailLog, setEmailLog] = useState('');
  const [sendState, setSendState] = useState('idle');

  useEffect(() => {
    const last = getLastSent('tarot');
    if (last) {
      const d = new Date(last.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      setEmailLog(`Last sent: ${d} → ${last.email}`);
    }
  }, []);

  function handleBack(e) {
    e.preventDefault();
    fadeNavigate(`/tarot?${bdayQ}`);
  }

  function handleHome(e) {
    e.preventDefault();
    fadeNavigate(`/home?${bdayQ}`);
  }

  function buildEmailContent() {
    const cardLines = cards.map(card => {
      const t = card.type === 'Major' ? 'Major Arcana' : `${card.type} · Minor Arcana`;
      return `${card.name} (${t})\n  ${card.up}`;
    }).join('\n\n');
    const bannerName = rulingCard ? `${rulingCard.name}  ·  ${zodiac}'s Ruling Card` : '';
    const bannerText = rulingCard ? rulingCard.up : '';
    return `HORA TAROT READING\n` +
           `══════════════════════════════\n` +
           `Name: ${name || 'You'}  |  Zodiac: ${zodiac}\n` +
           `Date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n\n` +
           `YOUR RULING CARD\n───────────────\n${bannerName}\n${bannerText}\n\n` +
           `YOUR SELECTED CARDS\n───────────────────\n${cardLines}\n\n` +
           `──────────────────────────────\nSent by HORA · Predicting ur Destiny\nhttps://thanaphumi2006.github.io/HORA-Project/`;
  }

  async function handleSend() {
    const userEmail = emailValue.trim();
    if (!userEmail || !userEmail.includes('@')) {
      setEmailStatus({ text: 'Please enter a valid email address.', kind: 'error' });
      return;
    }
    saveEmail(userEmail);
    setSendState('sending');
    setEmailStatus({ text: '', kind: '' });

    const sentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    try {
      const result = await sendEmail({
        toName: name || 'there',
        toEmail: userEmail,
        subject: `Your HORA Tarot Reading · ${sentDate}`,
        zodiac,
        sentDate,
        content: buildEmailContent(),
      });
      recordSent('tarot', userEmail);
      setSendState('sent');
      if (result.mode === 'mailto') {
        setEmailStatus({ text: `Opening your email app for ${userEmail}`, kind: 'success' });
      } else {
        setEmailStatus({ text: `Delivered to ${userEmail}`, kind: 'success' });
      }
      setEmailLog(`Sent on ${sentDate}`);
    } catch (err) {
      setSendState('failed');
      setEmailStatus({ text: 'Send failed — check your EmailJS config.', kind: 'error' });
    }
  }

  let buttonContent;
  if (sendState === 'sending') buttonContent = <>{SENDING_SVG} Sending...</>;
  else if (sendState === 'sent') buttonContent = <>{CHECK_SVG} {emailStatus.text.startsWith('Opening') ? 'Opening Email App...' : 'Sent!'}</>;
  else buttonContent = <>{ENVELOPE_SVG} Email My Results</>;

  return (
    <div className="page tarot-result-page">
      <div className="tr-header">
        <a className="btn-back" href="#/" onClick={handleBack}>
          <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
        </a>
        <span className="page-title">Card Prediction</span>
        <div className="menu-icon"><span></span><span></span><span></span></div>
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

      <div className="email-section">
        <div className="email-input-wrap">
          <span className="email-input-label">Send results to</span>
          <input
            className="email-input-field"
            type="email"
            placeholder="your@email.com"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
          />
        </div>
        <button
          className="btn-send-email"
          onClick={handleSend}
          disabled={sendState === 'sending' || sendState === 'sent'}
        >
          {buttonContent}
        </button>
        {emailStatus.text && (
          <div className={`email-status ${emailStatus.kind}`}>{emailStatus.text}</div>
        )}
        {emailLog && <div className="email-log">{emailLog}</div>}
      </div>
    </div>
  );
}
