import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFadeNavigate } from '../lib/useFadeNavigate.js';
import { getZodiac, lifePathNumber, monthNames } from '../lib/zodiac.js';
import { focusLabels, lpnColors, zodiacFocusPredictions, zodiacWeeklyForecast } from '../lib/horoscope.js';
import { getCurrentUser, saveRecord } from '../lib/auth.js';
import './Predict.css';

function ShareButton({ text, title }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text });
      } catch (_) { /* user cancelled */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) { /* clipboard denied */ }
  }

  return (
    <button className="btn-share" onClick={handleShare}>
      {copied ? (
        <>
          <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
          Copied!
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
          Share
        </>
      )}
    </button>
  );
}

export default function Predict() {
  const fadeNavigate = useFadeNavigate();
  const [params] = useSearchParams();
  const [tab, setTab] = useState('today');

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
  const isoDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const focusPoints = zodiacFocusPredictions[focus] || zodiacFocusPredictions.love;
  const points = focusPoints[zodiac] || focusPoints.Pisces;
  const recs = lpnColors[lpn] || lpnColors[9];
  const focusLabel = focusLabels[focus] || focus;
  const weeklyText = zodiacWeeklyForecast[zodiac] || zodiacWeeklyForecast.Pisces;

  const shareText = tab === 'today'
    ? `My ${focusLabel} horoscope for ${zodiac}:\n\n${points.join('\n\n')}`
    : `My weekly forecast for ${zodiac}:\n\n${weeklyText}`;

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;
    saveRecord(user.email, {
      type: 'daily',
      isoDate,
      date: todayDate,
      zodiac,
      focus,
      focusLabel,
      name: name || user.displayName,
      predictions: points,
      lpn,
      luckyColors: recs,
    });
  }, []);

  function handleBack(e) {
    e.preventDefault();
    fadeNavigate(`/home?name=${encodeURIComponent(name)}&day=${day}&month=${encodeURIComponent(monthStr)}&year=${year}&focus=${focus}`);
  }

  return (
    <div className="page predict-page">
      <div className="predict-header">
        <a className="btn-back" href="#/" onClick={handleBack}>
          <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
        </a>
        <span className="page-title">{focusLabel} Prediction</span>
        <ShareButton text={shareText} title={`${zodiac} ${focusLabel} Horoscope`} />
      </div>

      <div className="zodiac-row">
        <span className="zodiac-pill">{zodiac}</span>
        <span className={`focus-pill ${focus}`}>{focusLabel}</span>
        <span className="today-date">{todayDate}</span>
      </div>

      <div className="predict-tabs">
        <button
          className={`predict-tab${tab === 'today' ? ' active' : ''}`}
          onClick={() => setTab('today')}
        >Today</button>
        <button
          className={`predict-tab${tab === 'week' ? ' active' : ''}`}
          onClick={() => setTab('week')}
        >This Week</button>
      </div>

      {tab === 'today' ? (
        <div className="prediction-box">
          {points.map((p, i) => <p key={i} className="prediction-point">{p}</p>)}
        </div>
      ) : (
        <div className="prediction-box weekly-box">
          <p className="weekly-text">{weeklyText}</p>
        </div>
      )}

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
    </div>
  );
}
