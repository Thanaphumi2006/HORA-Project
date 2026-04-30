import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFadeNavigate } from '../lib/useFadeNavigate.js';
import { getCurrentUser, saveUserProfile } from '../lib/auth.js';
import './Focus.css';

const AREAS = [
  { id: 'love',   label: 'Love' },
  { id: 'work',   label: 'Work' },
  { id: 'health', label: 'Health' },
  { id: 'social', label: 'Social' },
];

export default function Focus() {
  const fadeNavigate = useFadeNavigate();
  const [params] = useSearchParams();
  const [selected, setSelected] = useState('love');
  const [touched, setTouched] = useState(false);

  const bdayQ = `name=${encodeURIComponent(params.get('name') || '')}&day=${params.get('day') || ''}&month=${encodeURIComponent(params.get('month') || '')}&year=${params.get('year') || ''}`;

  function pick(id) {
    setSelected(id);
    setTouched(true);
  }

  function handleContinue() {
    const user = getCurrentUser();
    if (user) saveUserProfile(user.email, { focus: selected });
    fadeNavigate(`/home?${bdayQ}&focus=${selected}`);
  }

  return (
    <div className="page focus-page">
      <h1>Focus area</h1>

      <div className="grid">
        {AREAS.map((a) => (
          <div
            key={a.id}
            className={`card${selected === a.id ? ' selected' : ''}`}
            onClick={() => pick(a.id)}
          >
            <span className="card-label">{a.label}</span>
          </div>
        ))}
      </div>

      <button className={`btn-continue${touched ? ' visible' : ''}`} onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
}
