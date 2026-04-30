import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFadeNavigate } from '../lib/useFadeNavigate.js';
import { getZodiac, lifePathNumber, monthNames } from '../lib/zodiac.js';
import { focusLabels, lpnColors, zodiacFocusPredictions } from '../lib/horoscope.js';
import { getCurrentUser, saveRecord } from '../lib/auth.js';
import './Predict.css';

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
  const isoDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const focusPoints = zodiacFocusPredictions[focus] || zodiacFocusPredictions.love;
  const points = focusPoints[zodiac] || focusPoints.Pisces;
  const recs = lpnColors[lpn] || lpnColors[9];
  const focusLabel = focusLabels[focus] || focus;

  // Save to history once per day per focus
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
    </div>
  );
}
