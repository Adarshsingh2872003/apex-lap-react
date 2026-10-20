import { useState } from 'react';
import { CARS } from '../lib/data.js';
const CLS = ['All', 'Hypercar', 'GT', 'Open-wheel'], pw = c => c.hp / c.kg * 1000;

export default function Garage({ onView }) {
  const [cls, setCls] = useState('All'), [k, setK] = useState('top');
  const list = CARS.filter(c => cls === 'All' || c.cl === cls)
    .sort((a, b) => k === 'acc' ? a.acc - b.acc : k === 'pw' ? pw(b) - pw(a) : b[k] - a[k]);
  return (
    <section id="garage">
      <h2 className="big">The garage</h2>
      <p className="lede" style={{ margin: 0 }}>Eight fictional machines across three classes. Filter by class or sort by the number you care about.</p>
      <div className="tools">
        {CLS.map(c => <button key={c} className="chip" aria-pressed={cls === c} onClick={() => setCls(c)}>{c}</button>)}
        <select value={k} onChange={e => setK(e.target.value)} aria-label="Sort cars">
          <option value="top">Sort: top speed</option><option value="hp">Sort: power</option>
          <option value="acc">Sort: quickest 0–100</option><option value="pw">Sort: power per tonne</option>
        </select>
      </div>
      <div className="grid">
        {list.map(c => (
          <article className="card" key={c.n} style={{ '--c': c.c }}>
            <h3>{c.n}</h3><p>{c.cl}</p>
            <button className="chip" style={{ margin: '4px 0 12px' }} onClick={() => onView(CARS.indexOf(c))}>View in 3D</button>
            <div className="m"><span>Top speed</span><i><u style={{ width: c.top / 4 + '%' }} /></i><b>{c.top}</b></div>
            <div className="m"><span>Power</span><i><u style={{ width: c.hp / 11 + '%' }} /></i><b>{c.hp}</b></div>
            <div className="facts"><div><strong>{c.acc.toFixed(1)}s</strong>0–100 km/h</div><div><strong>{c.kg}</strong>kg</div><div><strong>{Math.round(pw(c))}</strong>hp per tonne</div></div>
          </article>
        ))}
      </div>
    </section>
  );
}
