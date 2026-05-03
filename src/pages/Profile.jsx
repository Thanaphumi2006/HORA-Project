import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFadeNavigate } from '../lib/useFadeNavigate.js';
import { getCurrentUser, getHistory, authSignOut, updateDisplayName, deleteAccount } from '../lib/auth.js';
import './Profile.css';

const FOCUS_EMOJI = { love: '💖', work: '💼', health: '🌿', social: '🌟' };

function DailyRecord({ rec }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="prof-record daily" onClick={() => setOpen(o => !o)}>
      <div className="prof-record-header">
        <span className="rec-type-badge daily">Daily</span>
        <span className="rec-focus">{FOCUS_EMOJI[rec.focus] || '✦'} {rec.focusLabel}</span>
        <span className="rec-zodiac">{rec.zodiac}</span>
        <span className="rec-date">{rec.date}</span>
        <span className="rec-chevron">{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div className="prof-record-body">
          {rec.predictions.map((p, i) => (
            <p key={i} className="rec-prediction-line">{p}</p>
          ))}
          {rec.luckyColors && rec.luckyColors.length > 0 && (
            <div className="rec-colors">
              <div className="rec-colors-label">Lucky Colors · Life Path {rec.lpn}</div>
              {rec.luckyColors.map((c, i) => (
                <div key={i} className="rec-color-row">
                  <span className="rec-color-dot" style={{ background: c.color }}></span>
                  <span className="rec-color-name">{c.name}</span>
                  <span className="rec-color-meaning">{c.meaning}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TarotRecord({ rec }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="prof-record tarot" onClick={() => setOpen(o => !o)}>
      <div className="prof-record-header">
        <span className="rec-type-badge tarot">Tarot</span>
        <span className="rec-focus">🃏 {rec.cards?.length || 0} Cards</span>
        <span className="rec-zodiac">{rec.zodiac}</span>
        <span className="rec-date">{rec.date}</span>
        <span className="rec-chevron">{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div className="prof-record-body">
          {rec.rulingCard && (
            <div className="rec-ruling">
              <span className="rec-ruling-label">Ruling Card</span>
              <span className="rec-ruling-name">{rec.rulingCard.name}</span>
              <p className="rec-ruling-text">{rec.rulingCard.up}</p>
            </div>
          )}
          {rec.cards?.map((card, i) => (
            <div key={i} className="rec-card-item">
              <div className="rec-card-name">Card {i + 1} · {card.name}</div>
              <div className="rec-card-keywords">{card.keywords}</div>
              <div className="rec-card-meaning">{card.up}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Profile() {
  const fadeNavigate = useFadeNavigate();
  const [params] = useSearchParams();
  const bdayQ = `name=${encodeURIComponent(params.get('name') || '')}&day=${params.get('day') || ''}&month=${encodeURIComponent(params.get('month') || '')}&year=${params.get('year') || ''}`;

  const user = getCurrentUser();
  const history = user ? getHistory(user.email) : [];

  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || '');
  const [renameSaved, setRenameSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleRename() {
    const trimmed = newName.trim();
    if (!trimmed || !user) return;
    updateDisplayName(user.email, trimmed);
    setRenaming(false);
    setRenameSaved(true);
    setTimeout(() => setRenameSaved(false), 2000);
  }

  const dailyCount = history.filter(r => r.type === 'daily').length;
  const tarotCount = history.filter(r => r.type === 'tarot').length;

  const zodiacCounts = history.reduce((acc, r) => {
    if (r.zodiac) acc[r.zodiac] = (acc[r.zodiac] || 0) + 1;
    return acc;
  }, {});
  const topZodiac = Object.entries(zodiacCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  function handleBack(e) {
    e.preventDefault();
    fadeNavigate(`/home?${bdayQ}`);
  }

  function handleSignOut(e) {
    e.preventDefault();
    authSignOut();
    fadeNavigate('/');
  }

  function handleDeleteAccount() {
    deleteAccount(user.email);
    fadeNavigate('/');
  }

  if (!user) {
    return (
      <div className="page profile-page">
        <div className="prof-empty">
          <p>You are not signed in.</p>
          <button onClick={() => fadeNavigate('/')}>Go to Login</button>
        </div>
      </div>
    );
  }

  const initial = (user.displayName || user.email || '?')[0].toUpperCase();

  return (
    <div className="page profile-page">
      <div className="prof-header">
        <a className="btn-back" href="#/" onClick={handleBack}>
          <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
        </a>
        <span className="prof-title">My Profile</span>
        <button className="prof-signout" onClick={handleSignOut}>Sign Out</button>
      </div>

      <div className="prof-identity">
        <div className="prof-avatar">{initial}</div>
        <div className="prof-info">
          {renaming ? (
            <div className="prof-rename-row">
              <input
                className="prof-rename-input"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setRenaming(false); }}
                autoFocus
                maxLength={40}
              />
              <button className="prof-rename-save" onClick={handleRename}>Save</button>
              <button className="prof-rename-cancel" onClick={() => setRenaming(false)}>✕</button>
            </div>
          ) : (
            <div className="prof-name-row">
              <div className="prof-name">{user.displayName || '(no name)'}</div>
              <button className="prof-rename-btn" onClick={() => { setNewName(user.displayName || ''); setRenaming(true); }}>
                Rename
              </button>
            </div>
          )}
          {renameSaved && <div className="prof-rename-ok">Name updated ✓</div>}
          <div className="prof-email">{user.email}</div>
        </div>
      </div>

      <div className="prof-stats">
        <div className="prof-stat">
          <div className="prof-stat-value">{dailyCount}</div>
          <div className="prof-stat-label">Daily Readings</div>
        </div>
        <div className="prof-stat">
          <div className="prof-stat-value">{tarotCount}</div>
          <div className="prof-stat-label">Tarot Readings</div>
        </div>
        <div className="prof-stat">
          <div className="prof-stat-value">{topZodiac}</div>
          <div className="prof-stat-label">Top Sign</div>
        </div>
      </div>

      <div className="prof-section-title">Prediction History</div>

      {history.length === 0 ? (
        <div className="prof-no-history">
          No readings yet — go get your first prediction!
        </div>
      ) : (
        <div className="prof-history">
          {history.map(rec =>
            rec.type === 'daily'
              ? <DailyRecord key={rec.id} rec={rec} />
              : <TarotRecord key={rec.id} rec={rec} />
          )}
        </div>
      )}

      <div className="prof-danger-zone">
        {!confirmDelete ? (
          <button className="btn-delete-account" onClick={() => setConfirmDelete(true)}>
            Delete Account
          </button>
        ) : (
          <div className="prof-delete-confirm">
            <p className="prof-delete-warning">This will permanently delete your account and all reading history. This cannot be undone.</p>
            <div className="prof-delete-actions">
              <button className="btn-delete-confirm" onClick={handleDeleteAccount}>Yes, Delete</button>
              <button className="btn-delete-cancel" onClick={() => setConfirmDelete(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
