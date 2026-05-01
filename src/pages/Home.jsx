import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFadeNavigate } from '../lib/useFadeNavigate.js';
import { getZodiac, monthNames } from '../lib/zodiac.js';
import { zodiacHoroscope } from '../lib/horoscope.js';
import { zodiacTarotData } from '../lib/tarot.js';
import { authSignOut } from '../lib/auth.js';
import './Home.css';

export default function Home() {
  const fadeNavigate = useFadeNavigate();
  const [params] = useSearchParams();

  const name = params.get('name') || 'there';
  const day = parseInt(params.get('day')) || new Date().getDate();
  const monthStr = params.get('month') || 'January';
  const year = parseInt(params.get('year')) || new Date().getFullYear();
  const focus = params.get('focus') || 'love';

  const monthNum = monthNames.indexOf(monthStr) + 1;
  const zodiac = useMemo(() => getZodiac(day, monthNum), [day, monthNum]);
  const ruling = zodiacTarotData[zodiac] || zodiacTarotData.Pisces;

  const [horoscope, setHoroscope] = useState(zodiacHoroscope[zodiac] || zodiacHoroscope.Pisces);
  const [tarotMeanings, setTarotMeanings] = useState({ up: ruling.up, rev: ruling.rev, name: ruling.name, value: ruling.value });

  useEffect(() => {
    let cancelled = false;
    fetch(`https://freehoroscopeapi.com/api/v1/get-horoscope/daily?sign=${zodiac}&day=today`)
      .then(r => r.json())
      .then(d => {
        if (!cancelled && d?.data?.horoscope) {
          setHoroscope(d.data.horoscope.replace(/^Here is your horoscope[^:]*:\s*/i, '').trim());
        }
      })
      .catch(() =>
        fetch(`https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${zodiac}&day=today`)
          .then(r => r.json())
          .then(d => {
            if (!cancelled && d?.data?.horoscope) {
              setHoroscope(d.data.horoscope.replace(/^Here is your horoscope[^:]*:\s*/i, '').trim());
            }
          })
          .catch(() => { /* keep local */ })
      );
    return () => { cancelled = true; };
  }, [zodiac]);

  useEffect(() => {
    let cancelled = false;
    fetch('https://freehoroscopeapi.com/api/v1/tarot/cards/major')
      .then(r => r.json())
      .then(data => {
        if (cancelled || !data?.cards) return;
        const apiCard = data.cards.find(c => c.value_int === ruling.value);
        if (apiCard) {
          setTarotMeanings({
            name: apiCard.name,
            value: apiCard.value,
            up: apiCard.meaning_up,
            rev: apiCard.meaning_rev,
          });
        }
      })
      .catch(() => { /* keep local */ });
    return () => { cancelled = true; };
  }, [ruling.value]);

  const bdayQ = `name=${encodeURIComponent(name)}&day=${day}&month=${encodeURIComponent(monthStr)}&year=${year}`;

  function handleSignOut(e) {
    e.preventDefault();
    authSignOut();
    fadeNavigate('/');
  }

  function handleProfile(e) {
    e.preventDefault();
    fadeNavigate(`/profile?${bdayQ}`);
  }

  function openPredict() {
    fadeNavigate(`/predict?${bdayQ}&focus=${focus}`);
  }

  function openTarot() {
    fadeNavigate(`/tarot?${bdayQ}`);
  }

  function openCompatibility() {
    fadeNavigate(`/compatibility?${bdayQ}`);
  }

  return (
    <div className="page home-page">
      <div className="header">
        <div className="header-actions">
          <a className="btn-profile" href="#/" onClick={handleProfile}>
            <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
            Profile
          </a>
          <a className="btn-signout" href="#/" onClick={handleSignOut}>
            <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            Sign Out
          </a>
        </div>
        <div className="greeting">Hi <span>{name}</span></div>
        <div className="subtitle">Here is your today prediction</div>
        <div className="zodiac-badge">✦ <span>{zodiac}</span></div>
      </div>

      <div className="circles-wrap">
        <div className="compat-banner" onClick={openCompatibility}>
          <div className="compat-banner-left">
            <span className="compat-banner-icon">◈</span>
            <div>
              <div className="compat-banner-title">Compatibility Check</div>
              <div className="compat-banner-sub">See how your stars align with a friend</div>
            </div>
          </div>
          <svg className="compat-banner-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
        </div>

        <div className="circle-card" onClick={openPredict}>
          <div className="circle-label">
            <span className="circle-icon">✦</span>
            <span className="circle-title">Today<br />Prediction</span>
          </div>
          <div className="circle-content">
            <div className="content-title">Today Prediction</div>
            <div className="content-tag">{zodiac}</div>
            <div className="content-divider"></div>
            <div className="content-body">{horoscope}</div>
          </div>
        </div>

        <div className="circle-card" onClick={openTarot}>
          <div className="circle-label">
            <span className="circle-icon">🜁</span>
            <span className="circle-title">Tarot Reading</span>
            <span className="circle-card-name">{tarotMeanings.name}</span>
            <span className="circle-card-sub">{zodiac}'s Ruling Card</span>
          </div>
          <div className="circle-content">
            <div className="content-title">Tarot Reading</div>
            <div className="content-tag">{zodiac}'s Ruling Card</div>
            <div className="content-divider"></div>
            <div className="content-body">
              <span className="tarot-name">{tarotMeanings.name}</span>
              <span className="tarot-value">Card {tarotMeanings.value} · {zodiac}'s Ruling Card</span>
              <span className="section-label">Upright</span>
              <span>{tarotMeanings.up}</span>
              <span className="section-label">Reversed</span>
              <span>{tarotMeanings.rev}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
