import { useState } from 'react';

export default function AuthScreen({ onSignIn }) {
  const [showPassword, setShowPassword] = useState(false);

  const submit = event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email')).trim().toLowerCase();
    onSignIn(email);
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
          <h2 id="auth-title">Sign in</h2>
          <p className="auth-intro">Sign in to open your racing dashboard.</p>
          <label htmlFor="auth-email">Email address</label>
          <input id="auth-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
          <label htmlFor="auth-password">Password</label>
          <div className="password-field">
            <input id="auth-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" minLength="6" placeholder="At least 6 characters" required />
            <button type="button" className="password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(value => !value)}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <button className="btn auth-submit" type="submit">Enter the paddock <span aria-hidden="true">↗</span></button>
          <p className="demo-notice"><strong>Demo sign-in</strong><br />Use any valid email and a password with at least 6 characters. This frontend demo does not verify credentials or create a secure account.</p>
        </form>
        <p className="auth-legal">No password is stored. Demo sign-in only saves your email in this browser tab.</p>
      </section>
    </main>
  );
}
