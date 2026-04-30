import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFadeNavigate } from '../lib/useFadeNavigate.js';
import { deck } from '../lib/tarot.js';
import './Question.css';

function suitFallback(type) {
  if (type === 'Wands') return '🔥';
  if (type === 'Cups') return '💧';
  if (type === 'Swords') return '💨';
  if (type === 'Pentacles') return '🌱';
  return '✦';
}

function CardImage({ card }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="q-card-fallback">
        <span>{suitFallback(card.type)}</span>
      </div>
    );
  }
  return <img className="q-card-img" src={card.img} alt={card.name} onError={() => setFailed(true)} />;
}

export default function Question() {
  const fadeNavigate = useFadeNavigate();
  const [params] = useSearchParams();

  const [question, setQuestion] = useState('');
  const [card, setCard] = useState(null);
  const [orientation, setOrientation] = useState('upright');
  const [revealed, setRevealed] = useState(false);

  const bdayQ = `name=${encodeURIComponent(params.get('name') || '')}&day=${params.get('day') || ''}&month=${encodeURIComponent(params.get('month') || '')}&year=${params.get('year') || ''}`;

  function handleAsk() {
    if (!question.trim()) return;
    const drawn = deck[Math.floor(Math.random() * deck.length)];
    const reversed = Math.random() < 0.3;
    setCard(drawn);
    setOrientation(reversed ? 'reversed' : 'upright');
    requestAnimationFrame(() => setRevealed(true));
  }

  function handleContinue() {
    fadeNavigate(`/focus?${bdayQ}`);
  }

  function handleSkip() {
    fadeNavigate(`/home?${bdayQ}`);
  }

  return (
    <div className="page question-page">
      <div className="question-text">
        <h1>Question</h1>
        <div className="progress-bar">
          <div className={`progress-dot${card ? ' done' : ''}`}></div>
        </div>

        {!card && (
          <div className="q-ask">
            <input
              className="q-input"
              type="text"
              placeholder="Ask the cards..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAsk(); }}
              maxLength={140}
              autoFocus
            />
            <button
              className={`btn-ask${question.trim() ? ' visible' : ''}`}
              onClick={handleAsk}
              disabled={!question.trim()}
            >
              Draw a Card
            </button>
            <button className="btn-skip" onClick={handleSkip}>Skip</button>
          </div>
        )}

        {card && (
          <div className="q-reveal">
            <div className="q-question-echo">"{question}"</div>

            <div className={`q-card-wrap${revealed ? ' revealed' : ''}${orientation === 'reversed' ? ' reversed' : ''}`}>
              <div className="q-card-inner">
                <div className="q-card-back">
                  <div className="q-card-back-inner">
                    <span className="q-card-back-star">✦</span>
                    <span className="q-card-back-text">Hora</span>
                  </div>
                </div>
                <div className="q-card-face">
                  <CardImage card={card} />
                  <div className="q-card-name">{card.name}</div>
                </div>
              </div>
            </div>

            <div className="q-meaning">
              <div className="q-meaning-label">{orientation === 'reversed' ? 'Reversed' : 'Upright'}</div>
              <div className="q-meaning-text">
                {orientation === 'reversed' ? card.rev : card.up}
              </div>
            </div>

            <button className="btn-continue" onClick={handleContinue}>Continue</button>
          </div>
        )}
      </div>
    </div>
  );
}
