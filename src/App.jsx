import { useState } from 'react';
import RaceSection from './components/RaceSection.jsx';
import Showroom from './components/Showroom.jsx';
import Garage from './components/Garage.jsx';

export default function App() {
  const [car, setCar] = useState(0);
  const toggleTheme = () => {
    const r = document.documentElement, dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    r.dataset.theme = dark ? 'light' : 'dark';
  };
  const view = i => { setCar(i); document.getElementById('showroom').scrollIntoView({ behavior: 'smooth' }); };
  return (
    <div className="wrap">
      <header>
        <a className="brand" href="#top"><i />Apex Lap</a>
        <nav><a href="#race">Race</a><a href="#showroom">Showroom</a><a href="#garage">Garage</a>
          <button className="icon" onClick={toggleTheme} aria-label="Switch light or dark theme">◐</button></nav>
      </header>
      <main id="top">
        <h1>Six cars. Six laps. Pit stops decide it.</h1>
        <p className="lede">Start the race, switch on rain, and tap a driver to follow their speed trace and tyre wear. Then inspect the cars in 3D.</p>
        <RaceSection />
        <Showroom index={car} setIndex={setCar} />
        <Garage onView={view} />
      </main>
      <footer>Built with React, Vite and Three.js. All cars and drivers are invented.</footer>
    </div>
  );
}
