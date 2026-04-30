import { useEffect, useRef, useState } from 'react';
import { useFadeNavigate } from '../lib/useFadeNavigate.js';
import { saveEmail } from '../lib/email.js';
import './Login.css';

export default function Login() {
  const fadeNavigate = useFadeNavigate();
  const [emailValue, setEmailValue] = useState('');
  const [showLoading, setShowLoading] = useState(true);
  const [loadingHidden, setLoadingHidden] = useState(false);

  useEffect(() => {
    if (!showLoading) return;
    const dismiss = () => setLoadingHidden(true);
    document.addEventListener('keydown', dismiss);
    document.addEventListener('click', dismiss);
    return () => {
      document.removeEventListener('keydown', dismiss);
      document.removeEventListener('click', dismiss);
    };
  }, [showLoading]);

  function handleLoadingTransitionEnd() {
    if (loadingHidden) setShowLoading(false);
  }

  function handleSignIn(e) {
    e.preventDefault();
    if (emailValue.trim()) saveEmail(emailValue.trim());
    fadeNavigate('/name');
  }

  return (
    <div className="page login-page">
      {showLoading && (
        <div
          id="loading"
          className={loadingHidden ? 'hidden' : ''}
          onTransitionEnd={handleLoadingTransitionEnd}
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

          <div style={{ textAlign: 'center' }}>
            <h1>Welcome Back</h1>
          </div>

          <form onSubmit={handleSignIn}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" placeholder="••••••••" required />
            </div>

            <div className="forgot">
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit">Sign In</button>
          </form>

          <div className="divider"><span>or</span></div>

          <p className="signup">Don't have an account? <a href="#">Sign up</a></p>
        </div>
      </div>

      <p className="disclaimer">
        HORA is intended for entertainment purposes only. Predictions, tarot readings, and astrological content
        provided by this app do not constitute professional advice of any kind. Results are generated for
        recreational use and should not be relied upon for making life decisions. By continuing, you agree
        that HORA holds no liability for any actions taken based on its content.
      </p>
    </div>
  );
}
