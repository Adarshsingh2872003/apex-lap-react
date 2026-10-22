import { CARS, DRIVERS } from '../lib/data.js';
import { LAPS } from '../lib/engine.js';

const fastestCar = CARS.reduce((fastest, car) => car.top > fastest.top ? car : fastest, CARS[0]);

export default function Dashboard({ email }) {
  const name = email.split('@')[0];

  return (
    <section className="dashboard" id="dashboard" aria-labelledby="dashboard-title">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">YOUR RACE CONTROL</p>
          <h1 id="dashboard-title">Welcome back, {name}.</h1>
          <p className="lede">The grid is ready. Pick a session and make every lap count.</p>
        </div>
        <a className="btn dashboard-cta" href="#race">Start a race <span aria-hidden="true">↗</span></a>
      </div>
      <div className="dashboard-stats" aria-label="Simulator overview">
        <article className="dashboard-stat"><span>Drivers on the grid</span><strong>{DRIVERS.length}</strong><small>Ready to race</small></article>
        <article className="dashboard-stat"><span>Cars in the garage</span><strong>{CARS.length}</strong><small>Across {new Set(CARS.map(car => car.cl)).size} classes</small></article>
        <article className="dashboard-stat"><span>Race distance</span><strong>{LAPS}<i> laps</i></strong><small>Per race session</small></article>
        <article className="dashboard-stat dashboard-fastest" style={{ '--c': fastestCar.c }}>
          <span>Fastest machine</span><strong>{fastestCar.top}<i> km/h</i></strong><small>{fastestCar.n}</small>
        </article>
      </div>
      <div className="dashboard-lower">
        <article className="session-card">
          <div className="session-mark"><span /></div>
          <div><p className="eyebrow">NEXT UP</p><h2>Lights out when you are.</h2><p>Your six-driver race is set. Add rain, change simulation speed, and follow live telemetry from the timing tower.</p></div>
          <a href="#race" aria-label="Go to the race simulator">Open race control <span aria-hidden="true">→</span></a>
        </article>
        <article className="dashboard-shortcuts">
          <p className="eyebrow">EXPLORE APEX LAP</p>
          <a href="#showroom"><span><strong>01</strong><b>3D Showroom</b><small>Pick a car and its livery</small></span><span aria-hidden="true">↗</span></a>
          <a href="#garage"><span><strong>02</strong><b>The Garage</b><small>Compare specs across the grid</small></span><span aria-hidden="true">↗</span></a>
        </article>
      </div>
    </section>
  );
}
