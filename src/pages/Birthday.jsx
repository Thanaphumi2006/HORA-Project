import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFadeNavigate } from '../lib/useFadeNavigate.js';
import { monthNames } from '../lib/zodiac.js';
import './Birthday.css';

const ITEM_H = 44;

export default function Birthday() {
  const fadeNavigate = useFadeNavigate();
  const [params] = useSearchParams();
  const name = params.get('name') || '';

  const dayRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

  useEffect(() => {
    const today = new Date();
    requestAnimationFrame(() => {
      if (dayRef.current) dayRef.current.scrollTop = (today.getDate() - 1) * ITEM_H;
      if (monthRef.current) monthRef.current.scrollTop = today.getMonth() * ITEM_H;
      if (yearRef.current) yearRef.current.scrollTop = 0;
    });
  }, []);

  function getSelected(ref, items) {
    if (!ref.current) return items[0];
    const index = Math.round(ref.current.scrollTop / ITEM_H);
    return items[Math.min(Math.max(index, 0), items.length - 1)];
  }

  function handleBack(e) {
    e.preventDefault();
    fadeNavigate(`/name?name=${encodeURIComponent(name)}`);
  }

  function handleContinue() {
    const day = getSelected(dayRef, days);
    const month = getSelected(monthRef, monthNames);
    const year = getSelected(yearRef, years);
    fadeNavigate(
      `/question?name=${encodeURIComponent(name)}&day=${day}&month=${encodeURIComponent(month)}&year=${year}`
    );
  }

  return (
    <div className="page birthday-page">
      <div className="solar">
        <div className="sun"></div>
        <div className="orbit"></div>
        <div className="orbit2"></div>
      </div>

      <a className="btn-back" href="#/" onClick={handleBack}>
        <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
        Back
      </a>

      <div className="bday-page">
        <span className="label">Enter Birthday</span>

        <div className="picker-card">
          <div className="picker-columns">
            <div className="picker-col" ref={dayRef}>
              {days.map((d) => <div key={`d${d}`} className="picker-item">{d}</div>)}
            </div>
            <div className="picker-col" ref={monthRef}>
              {monthNames.map((m) => <div key={`m${m}`} className="picker-item">{m}</div>)}
            </div>
            <div className="picker-col" ref={yearRef}>
              {years.map((y) => <div key={`y${y}`} className="picker-item">{y}</div>)}
            </div>
          </div>
        </div>

        <button className="btn-continue" onClick={handleContinue}>Continue</button>
      </div>
    </div>
  );
}
