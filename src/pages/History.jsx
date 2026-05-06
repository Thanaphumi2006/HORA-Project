import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFadeNavigate } from '../lib/useFadeNavigate.js';
import { getCurrentUser, getHistory, deleteRecord, addNoteToRecord } from '../lib/auth.js';
import './History.css';

const FOCUS_EMOJI = { love: '💖', work: '💼', health: '🌿', social: '🌟' };

function NoteEditor({ rec, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(rec.note || '');
  const [savedFlash, setSavedFlash] = useState(false);

  function handleSave(e) {
    e.stopPropagation();
    onSave(draft);
    setEditing(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  }

  if (!editing && !rec.note) {
    return (
      <button
        className="hist-note-add"
        onClick={(e) => { e.stopPropagation(); setEditing(true); }}
      >
        + Add a journal note
      </button>
    );
  }

  if (!editing) {
    return (
      <div className="hist-note-display" onClick={(e) => e.stopPropagation()}>
        <div className="hist-note-label">Your note</div>
        <p className="hist-note-text">{rec.note}</p>
        <div className="hist-note-actions">
          <button
            className="hist-note-btn"
            onClick={(e) => { e.stopPropagation(); setDraft(rec.note); setEditing(true); }}
          >Edit</button>
          <button
            className="hist-note-btn ghost"
            onClick={(e) => { e.stopPropagation(); onSave(''); }}
          >Remove</button>
        </div>
        {savedFlash && <span className="hist-note-saved">Saved ✓</span>}
      </div>
    );
  }

  return (
    <div className="hist-note-edit" onClick={(e) => e.stopPropagation()}>
      <div className="hist-note-label">Your note</div>
      <textarea
        className="hist-note-input"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        placeholder="How did this reading land for you?"
        rows={3}
        maxLength={400}
        autoFocus
      />
      <div className="hist-note-actions">
        <button className="hist-note-btn primary" onClick={handleSave}>Save Note</button>
        <button
          className="hist-note-btn ghost"
          onClick={(e) => { e.stopPropagation(); setEditing(false); setDraft(rec.note || ''); }}
        >Cancel</button>
      </div>
    </div>
  );
}

function DailyBody({ rec }) {
  return (
    <>
      {rec.predictions?.map((p, i) => (
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
    </>
  );
}

function TarotBody({ rec }) {
  return (
    <>
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
    </>
  );
}

function AskBody({ rec }) {
  return (
    <>
      <div className="rec-question">"{rec.question}"</div>
      <div className="rec-card-item">
        <div className="rec-card-name">{rec.card?.name} · {rec.orientation}</div>
        <div className="rec-card-keywords">{rec.card?.keywords}</div>
        <div className="rec-card-meaning">{rec.prediction}</div>
      </div>
    </>
  );
}

function Record({ rec, onDelete, onSaveNote }) {
  const [open, setOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const headLabel = rec.type === 'daily'
    ? `${FOCUS_EMOJI[rec.focus] || '✦'} ${rec.focusLabel || rec.focus}`
    : rec.type === 'tarot'
      ? `🃏 ${rec.cards?.length || 0} Cards`
      : `${rec.topicIcon || '🔮'} ${rec.topicLabel || 'Question'}`;

  function handleDelete(e) {
    e.stopPropagation();
    if (!confirmDel) {
      setConfirmDel(true);
      setTimeout(() => setConfirmDel(false), 3000);
      return;
    }
    onDelete(rec.id);
  }

  return (
    <div className={`hist-record ${rec.type}`} onClick={() => setOpen(o => !o)}>
      <div className="hist-record-header">
        <span className={`rec-type-badge ${rec.type}`}>{rec.type}</span>
        <span className="rec-focus">{headLabel}</span>
        <span className="rec-zodiac">{rec.zodiac}</span>
        <span className="rec-date">{rec.date}</span>
        <button
          className={`rec-delete${confirmDel ? ' confirm' : ''}`}
          onClick={handleDelete}
          title={confirmDel ? 'Tap again to confirm' : 'Delete reading'}
        >
          {confirmDel ? '✓' : '×'}
        </button>
        <span className="rec-chevron">{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div className="hist-record-body">
          {rec.type === 'daily' && <DailyBody rec={rec} />}
          {rec.type === 'tarot' && <TarotBody rec={rec} />}
          {rec.type === 'ask' && <AskBody rec={rec} />}
          <NoteEditor rec={rec} onSave={(note) => onSaveNote(rec.id, note)} />
        </div>
      )}
    </div>
  );
}

export default function History() {
  const fadeNavigate = useFadeNavigate();
  const [params] = useSearchParams();
  const [filter, setFilter] = useState('all');
  const [version, setVersion] = useState(0);

  const user = getCurrentUser();
  const history = useMemo(() => (user ? getHistory(user.email) : []), [user, version]);

  const counts = useMemo(() => ({
    all: history.length,
    daily: history.filter(r => r.type === 'daily').length,
    tarot: history.filter(r => r.type === 'tarot').length,
    ask: history.filter(r => r.type === 'ask').length,
  }), [history]);

  const filtered = filter === 'all' ? history : history.filter(r => r.type === filter);

  const bdayQ = `name=${encodeURIComponent(params.get('name') || '')}&day=${params.get('day') || ''}&month=${encodeURIComponent(params.get('month') || 'January')}&year=${params.get('year') || ''}`;

  function handleBack(e) {
    e.preventDefault();
    fadeNavigate(`/home?${bdayQ}&focus=${params.get('focus') || 'love'}`);
  }

  function handleDelete(id) {
    if (!user) return;
    deleteRecord(user.email, id);
    setVersion(v => v + 1);
  }

  function handleSaveNote(id, note) {
    if (!user) return;
    addNoteToRecord(user.email, id, note);
    setVersion(v => v + 1);
  }

  if (!user) {
    return (
      <div className="page history-page">
        <div className="hist-empty">
          <p>You are not signed in.</p>
          <button onClick={() => fadeNavigate('/')}>Go to Login</button>
        </div>
      </div>
    );
  }

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'daily', label: 'Daily' },
    { id: 'tarot', label: 'Tarot' },
    { id: 'ask', label: 'Ask' },
  ];

  return (
    <div className="page history-page">
      <div className="hist-header">
        <a className="btn-back" href="#/" onClick={handleBack}>
          <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
        </a>
        <span className="hist-title">Reading Journal</span>
        <span className="hist-count">{counts.all}</span>
      </div>

      <p className="hist-sub">Your past readings — tap any entry to expand and add a journal note.</p>

      <div className="hist-filters">
        {filters.map(f => (
          <button
            key={f.id}
            className={`hist-filter${filter === f.id ? ' active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label} <span className="hist-filter-count">{counts[f.id]}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="hist-no-records">
          {history.length === 0
            ? 'No readings yet — go get your first prediction!'
            : `No ${filter} readings yet.`}
        </div>
      ) : (
        <div className="hist-list">
          {filtered.map(rec => (
            <Record
              key={rec.id}
              rec={rec}
              onDelete={handleDelete}
              onSaveNote={handleSaveNote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
