import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFadeNavigate } from '../lib/useFadeNavigate.js';
import './Name.css';

export default function Name() {
  const fadeNavigate = useFadeNavigate();
  const [params] = useSearchParams();
  const [value, setValue] = useState(params.get('name') || '');

  function handleBack(e) {
    e.preventDefault();
    fadeNavigate('/');
  }

  function handleContinue() {
    const name = value.trim();
    if (!name) return;
    fadeNavigate(`/birthday?name=${encodeURIComponent(name)}`);
  }

  const showButton = value.trim().length > 0;

  return (
    <div className="page name-page">
      <a className="btn-back" href="/" onClick={handleBack}>
        <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
        Back
      </a>

      <div className="container">
        <div className="avatar">
          <img src={`${import.meta.env.BASE_URL}Image/Newlogo.png`} alt="Avatar" />
        </div>

        <p className="heading">Tell us who you are</p>

        <div className="input-section">
          <span className="input-label">Enter your name</span>
          <input
            className="name-input"
            type="text"
            placeholder="your name"
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <span className="hint">Tap above to type</span>
        </div>

        <button
          className={`btn-continue${showButton ? ' visible' : ''}`}
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
