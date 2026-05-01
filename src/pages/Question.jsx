import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFadeNavigate } from '../lib/useFadeNavigate.js';
import { deck } from '../lib/tarot.js';
import './Question.css';

const TOPICS = [
  {
    id: 'love',
    label: 'Love & Relationships',
    icon: '💖',
    questions: [
      'Will I find love soon?',
      'Is this relationship right for me?',
      'What does my partner truly feel about me?',
      'Is reconciliation possible with someone from my past?',
    ],
    upLead: 'In matters of the heart, the cards smile on you.',
    revLead: 'Love is asking you to look inward before reaching outward.',
  },
  {
    id: 'career',
    label: 'Career & Work',
    icon: '💼',
    questions: [
      'Will I succeed in my current job?',
      'Should I change my career path?',
      'What lies ahead in my professional life?',
      'Is now the right time to start something new?',
    ],
    upLead: 'In your career, momentum is on your side.',
    revLead: 'Your work life calls for patience and a quiet recalibration.',
  },
  {
    id: 'money',
    label: 'Money & Finances',
    icon: '🪙',
    questions: [
      'Will my finances improve soon?',
      'Is this a good time to invest?',
      'Will the money I am waiting for arrive?',
      'How can I attract more abundance?',
    ],
    upLead: 'Around your finances, opportunity and flow are gathering.',
    revLead: 'Your finances are asking for caution, clarity, and a fresh plan.',
  },
  {
    id: 'growth',
    label: 'Self & Growth',
    icon: '🌱',
    questions: [
      'What do I need to focus on right now?',
      'What is blocking my growth?',
      'What lesson is the universe trying to teach me?',
      'Am I on the right path?',
    ],
    upLead: 'On your inner path, a quiet truth is rising to meet you.',
    revLead: 'Your soul is gently pointing to something you have been avoiding.',
  },
  {
    id: 'decision',
    label: 'A Decision',
    icon: '🔮',
    questions: [
      'Should I take this opportunity?',
      'Should I stay or move on?',
      'What outcome will my choice bring?',
      'Is this the right moment to act?',
    ],
    upLead: 'Concerning your choice, the path forward is becoming clear.',
    revLead: 'Concerning your choice, the cards urge you to pause and gather more truth.',
  },
];

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

function buildPrediction(topic, card, orientation) {
  const lead = orientation === 'upright' ? topic.upLead : topic.revLead;
  const meaning = orientation === 'upright' ? card.up : card.rev;
  const orientText = orientation === 'reversed' ? ' reversed' : '';
  return `${lead} The ${card.name} appears${orientText} — ${meaning}`;
}

export default function Question() {
  const fadeNavigate = useFadeNavigate();
  const [params] = useSearchParams();

  const [topic, setTopic] = useState(null);
  const [question, setQuestion] = useState('');
  const [card, setCard] = useState(null);
  const [orientation, setOrientation] = useState('upright');
  const [revealed, setRevealed] = useState(false);

  const focus = params.get('focus') || '';
  const fromHome = Boolean(focus);
  const bdayQ = `name=${encodeURIComponent(params.get('name') || '')}&day=${params.get('day') || ''}&month=${encodeURIComponent(params.get('month') || '')}&year=${params.get('year') || ''}`;

  const step = card ? 2 : (topic ? 1 : 0);

  function handlePickQuestion(q) {
    setQuestion(q);
    const drawn = deck[Math.floor(Math.random() * deck.length)];
    const reversed = Math.random() < 0.3;
    setCard(drawn);
    setOrientation(reversed ? 'reversed' : 'upright');
    requestAnimationFrame(() => setRevealed(true));
  }

  function handleBackToTopics() {
    setTopic(null);
    setQuestion('');
  }

  function handleContinue() {
    if (fromHome) {
      fadeNavigate(`/home?${bdayQ}&focus=${focus}`);
    } else {
      fadeNavigate(`/focus?${bdayQ}`);
    }
  }

  function handleSkip() {
    if (fromHome) {
      fadeNavigate(`/home?${bdayQ}&focus=${focus}`);
    } else {
      fadeNavigate(`/home?${bdayQ}`);
    }
  }

  return (
    <div className="page question-page">
      <div className="question-text">
        {fromHome && (
          <button className="btn-skip q-back-home" onClick={handleSkip}>← Back</button>
        )}
        <h1>Question</h1>
        <div className="progress-bar">
          <div className={`progress-dot step-${step}`}></div>
        </div>

        {!topic && !card && (
          <div className="q-topics">
            <p className="q-prompt">Choose what you want guidance on.</p>
            <div className="q-topic-grid">
              {TOPICS.map((t) => (
                <button
                  key={t.id}
                  className="q-topic-card"
                  onClick={() => setTopic(t)}
                >
                  <span className="q-topic-icon">{t.icon}</span>
                  <span className="q-topic-label">{t.label}</span>
                </button>
              ))}
            </div>
            <button className="btn-skip" onClick={handleSkip}>Skip</button>
          </div>
        )}

        {topic && !card && (
          <div className="q-questions">
            <p className="q-prompt">
              <span className="q-topic-tag">{topic.icon} {topic.label}</span>
            </p>
            <p className="q-sub">Pick the question that calls to you.</p>
            <div className="q-question-list">
              {topic.questions.map((q) => (
                <button
                  key={q}
                  className="q-question-btn"
                  onClick={() => handlePickQuestion(q)}
                >
                  {q}
                </button>
              ))}
            </div>
            <button className="btn-skip" onClick={handleBackToTopics}>← Back</button>
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
              <div className="q-meaning-label">{orientation === 'reversed' ? 'Reversed' : 'Upright'} · Prediction</div>
              <div className="q-meaning-text">
                {buildPrediction(topic, card, orientation)}
              </div>
            </div>

            <button className="btn-continue" onClick={handleContinue}>
              {fromHome ? 'Done' : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
