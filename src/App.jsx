import { useState } from 'react';
import RaceSection from './components/RaceSection.jsx';
import Showroom from './components/Showroom.jsx';
import Garage from './components/Garage.jsx';
import AuthScreen from './components/AuthScreen.jsx';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
  const [car, setCar] = useState(0);
  const [user, setUser] = useState(() => sessionStorage.getItem('apex-lap-demo-user') || '');
  const [userName, setUserName] = useState(() => sessionStorage.getItem('apex-lap-demo-name') || '');
  const toggleTheme = () => {
    const r = document.documentElement, dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    r.dataset.theme = dark ? 'light' : 'dark';
  };
  const view = i => { setCar(i); document.getElementById('showroom').scrollIntoView({ behavior: 'smooth' }); };
  const signIn = (email, name = '') => {
    sessionStorage.setItem('apex-lap-demo-user', email);
    if (name) {
      sessionStorage.setItem('apex-lap-demo-name', name);
    } else {
      sessionStorage.removeItem('apex-lap-demo-name');
    }
    setUser(email);
    setUserName(name);
  };
  const signOut = () => {
    sessionStorage.removeItem('apex-lap-demo-user');
    sessionStorage.removeItem('apex-lap-demo-name');
    setUser('');
    setUserName('');
  };

  if (!user) return <AuthScreen onSignIn={signIn} />;

  return (
    <div className="wrap">
      <header>
        <a className="brand" href="#dashboard"><i />Apex Lap</a>
        <nav><a href="#dashboard">Dashboard</a><a href="#race">Race</a><a href="#showroom">Showroom</a><a href="#garage">Garage</a>
          <button className="icon" onClick={toggleTheme} aria-label="Switch light or dark theme">◐</button></nav>
        <div className="account">
          <span className="account-name">{userName || user}</span>
          <button className="signout" onClick={signOut}>Sign out</button>
        </div>
      </header>
      <main id="top">
        <Dashboard email={user} name={userName} />
        <section className="race-home" aria-labelledby="race-heading">
          <h2 className="big" id="race-heading">Six cars. Six laps. Pit stops decide it.</h2>
          <p className="lede">Start the race, switch on rain, and tap a driver to follow their speed trace and tyre wear. Then inspect the cars in 3D.</p>
        </section>
        <RaceSection />
        <Showroom index={car} setIndex={setCar} />
        <Garage onView={view} />
      </main>
      <footer>Built with React, Vite and Three.js. All cars and drivers are invented. Demo authentication is not secure and does not protect real data.</footer>
    </div>
  );
}
