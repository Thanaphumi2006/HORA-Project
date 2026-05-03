import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFadeNavigate } from '../lib/useFadeNavigate.js';
import { getZodiac, monthNames } from '../lib/zodiac.js';
import { zodiacHoroscope } from '../lib/horoscope.js';
import { zodiacTarotData } from '../lib/tarot.js';
import { authSignOut, getCurrentUser, saveUserProfile } from '../lib/auth.js';
import { getMoonPhase } from '../lib/moonphase.js';
import { zodiacInfoData } from '../lib/zodiacinfo.js';
import { ZodiacSymbol } from '../lib/ZodiacSymbols.jsx';
import './Home.css';

export default function Home() {
  const fadeNavigate = useFadeNavigate();
  const [params, setParams] = useSearchParams();
  const [expanded, setExpanded] = useState(null);
  const [horoscopeLoaded, setHoroscopeLoaded] = useState(false);

  const name = params.get('name') || 'there';
  const day = parseInt(params.get('day')) || new Date().getDate();
  const monthStr = params.get('month') || 'January';
  const year = parseInt(params.get('year')) || new Date().getFullYear();
  const focus = params.get('focus') || 'love';

  const monthNum = monthNames.indexOf(monthStr) + 1;
  const zodiac = useMemo(() => getZodiac(day, monthNum), [day, monthNum]);
  const ruling = zodiacTarotData[zodiac] || zodiacTarotData.Pisces;
  const moon = useMemo(() => getMoonPhase(), []);

  const [horoscope, setHoroscope] = useState(zodiacHoroscope[zodiac] || zodiacHoroscope.Pisces);
  const [tarotMeanings, setTarotMeanings] = useState({ up: ruling.up, rev: ruling.rev, name: ruling.name, value: ruling.value });

  useEffect(() => {
    let cancelled = false;
    setHoroscopeLoaded(false);
    fetch(`https://freehoroscopeapi.com/api/v1/get-horoscope/daily?sign=${zodiac}&day=today`)
      .then(r => r.json())
      .then(d => {
        if (!cancelled && d?.data?.horoscope) {
          setHoroscope(d.data.horoscope.replace(/^Here is your horoscope[^:]*:\s*/i, '').trim());
        }
        if (!cancelled) setHoroscopeLoaded(true);
      })
      .catch(() =>
        fetch(`https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${zodiac}&day=today`)
          .then(r => r.json())
          .then(d => {
            if (!cancelled && d?.data?.horoscope) {
              setHoroscope(d.data.horoscope.replace(/^Here is your horoscope[^:]*:\s*/i, '').trim());
            }
            if (!cancelled) setHoroscopeLoaded(true);
          })
          .catch(() => { if (!cancelled) setHoroscopeLoaded(true); })
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

  function changeFocus(newFocus) {
    const user = getCurrentUser();
    if (user) saveUserProfile(user.email, { focus: newFocus });
    const next = new URLSearchParams(params);
    next.set('focus', newFocus);
    setParams(next, { replace: true });
  }

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

  function openZodiacInfo(e) {
    e.stopPropagation();
    fadeNavigate(`/zodiac?zodiac=${zodiac}&${bdayQ}`);
  }

  return (
    <div className="page home-page">
      <div className="home-aurora"    aria-hidden="true" />
      <div className="home-stars"     aria-hidden="true" />
      <div className="home-sparkles"  aria-hidden="true">
        <span className="hsp hsp-1">✦</span>
        <span className="hsp hsp-2">✦</span>
        <span className="hsp hsp-3">✦</span>
        <span className="hsp hsp-4">✦</span>
        <span className="hsp hsp-5">✦</span>
        <span className="hsp hsp-6">✦</span>
      </div>

      <div className="home-orbit home-orbit-left" aria-hidden="true">
        <div className="ho-ring ho-ring-1"></div>
        <div className="ho-ring ho-ring-2"></div>
        <div className="ho-ring ho-ring-3"></div>
      </div>
      <div className="home-orbit home-orbit-right" aria-hidden="true">
        <div className="ho-ring ho-ring-1"></div>
        <div className="ho-ring ho-ring-2"></div>
        <div className="ho-ring ho-ring-3"></div>
      </div>

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
        <button className="zodiac-badge" onClick={openZodiacInfo} title="View zodiac info">
          <span className="zodiac-badge-sym">
            <ZodiacSymbol sign={zodiac} size={20} />
          </span>
          <span className="zodiac-badge-name">{zodiac}</span>
          <svg className="zi-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
        <div className="home-moon-row">
          <span className="home-moon-emoji">{moon.emoji}</span>
          <span className="home-moon-name">{moon.name}</span>
          <span className="home-moon-pct">{moon.pct}% illuminated</span>
        </div>
        <div className="focus-pills">
          {['love', 'work', 'health', 'social'].map(f => (
            <button
              key={f}
              className={`home-focus-pill ${f}${focus === f ? ' active' : ''}`}
              onClick={() => changeFocus(f)}
            >
              {f}
            </button>
          ))}
        </div>
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

        <div className="compat-banner" onClick={() => fadeNavigate(`/question?${bdayQ}&focus=${focus}`)}>
          <div className="compat-banner-left">
            <span className="compat-banner-icon">🔮</span>
            <div>
              <div className="compat-banner-title">Ask a Question</div>
              <div className="compat-banner-sub">Draw a card for guidance on what's on your mind</div>
            </div>
          </div>
          <svg className="compat-banner-arrow" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
        </div>

        <div
          className={`circle-card${expanded === 'predict' ? ' expanded' : ''}`}
          onClick={() => setExpanded(prev => prev === 'predict' ? null : 'predict')}
        >
          <div className="circle-label">
            <span className="circle-icon">✦</span>
            <span className="circle-title">Today<br />Prediction</span>
            <span className="circle-cta">Click here to view prediction</span>
          </div>
          <div className="circle-content">
            <div className="content-title">Today Prediction</div>
            <div className="content-tag">{zodiac}</div>
            <div className="content-divider"></div>
            {horoscopeLoaded ? (
              <div className="content-body">{horoscope}</div>
            ) : (
              <div className="content-skeleton">
                <div className="skel-line skel-w90"></div>
                <div className="skel-line skel-w75"></div>
                <div className="skel-line skel-w85"></div>
                <div className="skel-line skel-w60"></div>
              </div>
            )}
            <button className="circle-nav-btn" onClick={(e) => { e.stopPropagation(); openPredict(); }}>
              View Full Prediction →
            </button>
          </div>
        </div>

        <div
          className={`circle-card${expanded === 'tarot' ? ' expanded' : ''}`}
          onClick={() => setExpanded(prev => prev === 'tarot' ? null : 'tarot')}
        >
          <div className="circle-label">
            <span className="circle-icon">🜁</span>
            <span className="circle-title">Tarot Reading</span>
            <span className="circle-card-name">{tarotMeanings.name}</span>
            <span className="circle-card-sub">{zodiac}'s Ruling Card</span>
            <span className="circle-cta">Click here to view or pick the card</span>
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
            <button className="circle-nav-btn" onClick={(e) => { e.stopPropagation(); openTarot(); }}>
              Pick Your Cards →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
