import { useSearchParams } from 'react-router-dom';
import { useFadeNavigate } from '../lib/useFadeNavigate.js';
import './Question.css';

export default function Question() {
  const fadeNavigate = useFadeNavigate();
  const [params] = useSearchParams();

  const bdayQ = `name=${encodeURIComponent(params.get('name') || '')}&day=${params.get('day') || ''}&month=${encodeURIComponent(params.get('month') || '')}&year=${params.get('year') || ''}`;

  function handleBodyClick() {
    fadeNavigate(`/focus?${bdayQ}`);
  }

  function handleSkip(e) {
    e.stopPropagation();
    fadeNavigate(`/home?${bdayQ}`);
  }

  return (
    <div className="page question-page" onClick={handleBodyClick}>
      <div className="question-text">
        <h1>Question</h1>
        <div className="progress-bar">
          <div className="progress-dot"></div>
        </div>
        <button className="btn-skip" onClick={handleSkip}>Skip</button>
      </div>
    </div>
  );
}
