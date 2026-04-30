import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFadeNavigate } from '../lib/useFadeNavigate.js';
import { getZodiac, lifePathNumber, monthNames } from '../lib/zodiac.js';
import { focusLabels, lpnColors, zodiacFocusPredictions } from '../lib/horoscope.js';
import { getLastSent, getSavedEmail, recordSent, saveEmail, sendEmail } from '../lib/email.js';
import './Predict.css';

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

export default function Predict() {
  const fadeNavigate = useFadeNavigate();
  const [params] = useSearchParams();

  const name = params.get('name') || '';
  const day = parseInt(params.get('day')) || new Date().getDate();
  const monthStr = params.get('month') || 'January';
  const year = parseInt(params.get('year')) || new Date().getFullYear();
  const focus = params.get('focus') || 'love';

  const monthNum = monthNames.indexOf(monthStr) + 1;
  const zodiac = useMemo(() => getZodiac(day, monthNum), [day, monthNum]);
  const lpn = useMemo(() => lifePathNumber(day, monthNum, year), [day, monthNum, year]);

  const todayDate = useMemo(() =>
    new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  []);

  const focusPoints = zodiacFocusPredictions[focus] || zodiacFocusPredictions.love;
  const points = focusPoints[zodiac] || focusPoints.Pisces;
  const recs = lpnColors[lpn] || lpnColors[9];
  const focusLabel = focusLabels[focus] || focus;

  const [emailValue, setEmailValue] = useState(getSavedEmail());
  const [emailStatus, setEmailStatus] = useState({ text: '', kind: '' });
  const [emailLog, setEmailLog] = useState('');
  const [sendState, setSendState] = useState('idle'); // idle | sending | sent | failed

  useEffect(() => {
    const last = getLastSent('prediction');
    if (last) {
      const d = new Date(last.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      setEmailLog(`Last sent: ${d} → ${last.email}`);
    }
  }, []);

  function handleBack(e) {
    e.preventDefault();
    fadeNavigate(`/home?name=${encodeURIComponent(name)}&day=${day}&month=${encodeURIComponent(monthStr)}&year=${year}&focus=${focus}`);
  }

  function buildEmailContent() {
    const rLines = recs.map(r => `• ${r.name} · ${r.meaning}\n  ${r.action}`).join('\n');
    return `HORA DAILY ${focus.toUpperCase()} PREDICTION\n` +
           `══════════════════════════════\n` +
           `Name: ${name || 'You'}  |  Zodiac: ${zodiac}  |  Focus: ${focusLabel}\n` +
           `Date: ${todayDate}\n\n` +
           `YOUR PREDICTION\n───────────────\n${points[0]}\n\n${points[1]}\n\n${points[2]}\n\n` +
           `LUCKY COLORS · LIFE PATH ${lpn}\n───────────────────────────\n${rLines}\n\n` +
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
        subject: `Your HORA ${focusLabel} Prediction · ${sentDate}`,
        zodiac,
        sentDate,
        content: buildEmailContent(),
      });
      recordSent('prediction', userEmail);
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
    <div className="page predict-page">
      <div className="predict-header">
        <a className="btn-back" href="#/" onClick={handleBack}>
          <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
        </a>
        <span className="page-title">{focusLabel} Prediction</span>
        <div className="menu-icon"><span></span><span></span><span></span></div>
      </div>

      <div className="zodiac-row">
        <span className="zodiac-pill">{zodiac}</span>
        <span className={`focus-pill ${focus}`}>{focusLabel}</span>
        <span className="today-date">{todayDate}</span>
      </div>

      <div className="prediction-box">
        {points.map((p, i) => <p key={i} className="prediction-point">{p}</p>)}
      </div>

      <div className="section-heading">Recommendation</div>
      <p className="lpn-label">Life Path {lpn} · Lucky Colors</p>

      <div className="recommendations">
        {recs.map((rec, i) => (
          <div key={i} className="rec-card">
            <div className="rec-color" style={{ background: rec.color }}></div>
            <div className="rec-info">
              <div className="rec-label">{rec.name} · {rec.meaning}</div>
              <div className="rec-text">{rec.action}</div>
            </div>
          </div>
        ))}
      </div>

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
