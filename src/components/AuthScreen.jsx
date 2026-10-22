import { useState } from 'react';

export default function AuthScreen({ onSignIn }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const submit = event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email')).trim().toLowerCase();
    const name = String(form.get('name') || '').trim();
    if (isSignUp && !name) {
      setError('Please enter your name.');
      return;
    }
    if (isSignUp && form.get('password') !== form.get('confirm-password')) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    onSignIn(email, isSignUp ? name : '');
  };

  return (
    <main className="auth-screen">
      <section className="auth-panel" aria-labelledby="auth-title">
        <a className="brand" href="#top"><i />Apex Lap</a>
        <div className="auth-copy">
          <p className="eyebrow">RACE CONTROL · DRIVER PORTAL</p>
          <h1>Every lap<br />starts here.</h1>
          <p>Keep your eyes on the track. Your race simulator, timing tower and car collection are waiting.</p>
        </div>
        <div className="auth-panel-foot"><span>APEX LAP</span><span>01 — 06</span></div>
      </section>
      <section className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          <p className="eyebrow">WELCOME TO THE GRID</p>
          <h2 id="auth-title">{isSignUp ? 'Create account' : 'Sign in'}</h2>
          <p className="auth-intro">{isSignUp ? 'Create an account to get on the grid.' : 'Sign in to open your racing dashboard.'}</p>
          {isSignUp && (
            <>
              <label htmlFor="auth-name">Full name</label>
              <input id="auth-name" name="name" type="text" autoComplete="name" maxLength="100" placeholder="Your name" required />
            </>
          )}
          <label htmlFor="auth-email">Email address</label>
          <input id="auth-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
          <label htmlFor="auth-password">Password</label>
          <div className="password-field">
            <input id="auth-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={isSignUp ? 'new-password' : 'current-password'} minLength="6" placeholder="At least 6 characters" required />
            <button type="button" className="password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(value => !value)}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {isSignUp && (
            <>
              <label htmlFor="auth-confirm-password">Confirm password</label>
              <input id="auth-confirm-password" name="confirm-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength="6" placeholder="Enter your password again" required />
            </>
          )}
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="btn auth-submit" type="submit">{isSignUp ? 'Create account' : 'Enter the paddock'} <span aria-hidden="true">↗</span></button>
          <p className="auth-mode-toggle">
            {isSignUp ? 'Already have an account?' : 'New to Apex Lap?'}{' '}
            <button type="button" onClick={() => { setIsSignUp(value => !value); setError(''); }}>
              {isSignUp ? 'Sign in' : 'Create an account'}
            </button>
          </p>
          <p className="demo-notice"><strong>Frontend demo</strong><br />This demo does not verify credentials or create secure accounts. Passwords are not stored; any valid email and password can sign in.</p>
        </form>
        <p className="auth-legal">Demo sign-in only saves your email in this browser tab.</p>
      </section>
    </main>
  );
}
