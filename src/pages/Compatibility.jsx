import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFadeNavigate } from '../lib/useFadeNavigate.js';
import { getZodiac, monthNames } from '../lib/zodiac.js';
import { getCompatibility, zodiacSymbols } from '../lib/compatibility.js';
import './Compatibility.css';

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

export default function Compatibility() {
  const fadeNavigate = useFadeNavigate();
  const [params] = useSearchParams();

  const name = params.get('name') || 'there';
  const day = parseInt(params.get('day')) || new Date().getDate();
  const monthStr = params.get('month') || 'January';
  const year = parseInt(params.get('year')) || new Date().getFullYear();
  const focus = params.get('focus') || 'love';

  const monthNum = monthNames.indexOf(monthStr) + 1;
  const userZodiac = useMemo(() => getZodiac(day, monthNum), [day, monthNum]);

  const [friendName, setFriendName] = useState('');
  const [friendDay, setFriendDay] = useState(1);
  const [friendMonth, setFriendMonth] = useState('January');
  const [friendYear, setFriendYear] = useState(2000);
  const [result, setResult] = useState(null);

  const bdayQ = `name=${encodeURIComponent(name)}&day=${day}&month=${encodeURIComponent(monthStr)}&year=${year}&focus=${focus}`;

  function handleBack(e) {
    e.preventDefault();
    if (result) {
      setResult(null);
    } else {
      fadeNavigate(`/home?${bdayQ}`);
    }
  }

  function handleCheck(e) {
    e.preventDefault();
    const friendMonthNum = monthNames.indexOf(friendMonth) + 1;
    const friendZodiac = getZodiac(friendDay, friendMonthNum);
    const compat = getCompatibility(userZodiac, friendZodiac);
    setResult({
      ...compat,
      friendZodiac,
      friendDisplayName: friendName.trim() || 'Your Friend',
    });
  }

  return (
    <div className="page compatibility-page">
      <div className="compat-header">
        <a className="btn-back" href="#/" onClick={handleBack}>
          <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
        </a>
        <span className="page-title">Compatibility</span>
        <div className="header-spacer" />
      </div>

      {!result ? (
        <div className="compat-form">
          <div className="your-sign-card">
            <div className="sign-symbol">{zodiacSymbols[userZodiac]}</div>
            <div className="sign-info">
              <div className="sign-label">Your Sign</div>
              <div className="sign-name">{userZodiac}</div>
            </div>
          </div>

          <div className="plus-divider">+</div>

          <div className="friend-section">
            <div className="field-label">Friend's Name (optional)</div>
            <input
              className="compat-input"
              type="text"
              placeholder="Enter name"
              value={friendName}
              onChange={e => setFriendName(e.target.value)}
              maxLength={40}
            />

            <div className="field-label">Friend's Birthday</div>
            <div className="date-selects">
              <select
                className="date-select"
                value={friendDay}
                onChange={e => setFriendDay(parseInt(e.target.value))}
              >
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select
                className="date-select month-select"
                value={friendMonth}
                onChange={e => setFriendMonth(e.target.value)}
              >
                {monthNames.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select
                className="date-select"
                value={friendYear}
                onChange={e => setFriendYear(parseInt(e.target.value))}
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <button className="btn-check" onClick={handleCheck}>
            Check Compatibility
            <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
      ) : (
        <div className="compat-results">
          <div className="signs-row">
            <div className="sign-block">
              <div className="result-symbol">{result.symbol1}</div>
              <div className="result-sign">{userZodiac}</div>
              <div className="result-owner">{name}</div>
            </div>
            <div className="overall-circle">
              <div className="overall-pct">{result.overall}%</div>
              <div className="overall-label">Match</div>
            </div>
            <div className="sign-block">
              <div className="result-symbol">{result.symbol2}</div>
              <div className="result-sign">{result.friendZodiac}</div>
              <div className="result-owner">{result.friendDisplayName}</div>
            </div>
          </div>

          <div className="scores-card">
            <ScoreBar label="Love" score={result.love} color="rgba(220, 80, 120, 0.7)" />
            <ScoreBar label="Friendship" score={result.friendship} color="rgba(61, 144, 147, 0.8)" />
            <ScoreBar label="Work" score={result.work} color="rgba(130, 90, 200, 0.7)" />
          </div>

          <div className="desc-card">
            <div className="card-heading">About This Pairing</div>
            <p className="desc-text">{result.description}</p>
          </div>

          <div className="tip-card">
            <div className="card-heading">✦ Tip</div>
            <p className="tip-text">{result.tip}</p>
          </div>

          <button className="btn-check btn-check-again" onClick={() => setResult(null)}>
            Check Another
          </button>
        </div>
      )}
    </div>
  );
}

function ScoreBar({ label, score, color }) {
  return (
    <div className="score-row">
      <div className="score-label">{label}</div>
      <div className="score-bar-wrap">
        <div className="score-bar-fill" style={{ width: `${score}%`, background: color }} />
      </div>
      <div className="score-pct">{score}%</div>
    </div>
  );
}
