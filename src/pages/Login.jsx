import { useState } from 'react';
import { useFadeNavigate } from '../lib/useFadeNavigate.js';
import { authSignIn, authSignUp } from '../lib/auth.js';
import './Login.css';

function buildHomeUrl(profile) {
  const { displayName, day, month, year, focus } = profile;
  return `/home?name=${encodeURIComponent(displayName)}&day=${day}&month=${encodeURIComponent(month)}&year=${year}&focus=${focus || 'love'}`;
}

export default function Login() {
  const fadeNavigate = useFadeNavigate();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [showLoading, setShowLoading] = useState(true);
  const [loadingHidden, setLoadingHidden] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function dismissLoading() { setLoadingHidden(true); }
  function handleLoadingEnd() { if (loadingHidden) setShowLoading(false); }

  function switchMode(m) {
    setMode(m);
    setError('');
    setEmail('');
    setPassword('');
    setConfirm('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (mode === 'signup' && password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      let result;
      if (mode === 'signup') {
        result = await authSignUp(email, password);
      } else {
        result = await authSignIn(email, password);
      }
      // If user already has a complete profile, skip setup and go to home
      const p = result.profile;
      if (p && p.displayName && p.day && p.month && p.year) {
        fadeNavigate(buildHomeUrl(p));
      } else {
        fadeNavigate('/name');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page login-page" onClick={showLoading ? dismissLoading : undefined}>
      {showLoading && (
        <div
          id="loading"
          className={loadingHidden ? 'hidden' : ''}
          onTransitionEnd={handleLoadingEnd}
        >
          <div className="splash-brand">
            <span className="splash-hora">HORA</span>
          </div>
          <div className="splash-bottom">
            <span className="splash-tagline">Predicting ur Destiny</span>
            <div className="comet-orbit"></div>
          </div>
          <p className="splash-hint">Press any key or click to continue</p>
        </div>
      )}

      <div id="login">
        <div className="card">
          <div className="logo">
            <img src={`${import.meta.env.BASE_URL}Image/Newlogo.png`} alt="HORA Logo" />
          </div>

          <div className="auth-tabs">
            <button
              className={`auth-tab${mode === 'signin' ? ' active' : ''}`}
              onClick={() => switchMode('signin')}
              type="button"
            >
              Sign In
            </button>
            <button
              className={`auth-tab${mode === 'signup' ? ' active' : ''}`}
              onClick={() => switchMode('signup')}
              type="button"
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {mode === 'signup' && (
              <div className="field">
                <label htmlFor="confirm">Confirm Password</label>
                <input
                  id="confirm"
                  type="password"
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>
            )}

            {mode === 'signin' && (
              <div className="forgot">
                <a href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a>
              </div>
            )}

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" disabled={loading}>
              {loading ? 'Please wait…' : (mode === 'signup' ? 'Create Account' : 'Sign In')}
            </button>
          </form>
        </div>
      </div>

      <p className="disclaimer">
        HORA is for entertainment only. Predictions do not constitute professional advice.
        By continuing you agree that HORA holds no liability for actions taken based on its content.
      </p>
    </div>
  );
}
