import { useEffect, useReducer, useRef, useState } from 'react';
import { P, at } from '../lib/track.js';
import { createRace, step, rank, LAPS, kmh } from '../lib/engine.js';

const NAME = { S: 'Soft', M: 'Medium', H: 'Hard' };

function draw(ctx, cv, r, k, drops) {
  const d = Math.min(2, devicePixelRatio || 1), W = cv.width / d, H = cv.height / d;
  if (!W) return;
  const st = getComputedStyle(document.documentElement), g = n => st.getPropertyValue(n).trim();
  ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, W, H); ctx.lineJoin = 'round';
  const path = () => { ctx.beginPath(); P.forEach((p, i) => ctx[i ? 'lineTo' : 'moveTo'](p[0] * W, p[1] * H)); ctx.closePath(); }, dd = W * .012;
  path(); ctx.lineWidth = W * .05; ctx.setLineDash([dd, dd]); ctx.strokeStyle = g('--kerbA'); ctx.stroke();
  ctx.lineDashOffset = dd; ctx.strokeStyle = g('--kerbB'); ctx.stroke(); ctx.setLineDash([]); ctx.lineDashOffset = 0;
  path(); ctx.lineWidth = W * .04; ctx.strokeStyle = g('--asphalt'); ctx.stroke();
  path(); ctx.lineWidth = 1.5; ctx.setLineDash([W * .01, W * .014]); ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.stroke(); ctx.setLineDash([]);
  const p0 = P[0], p1 = P[1], a = Math.atan2((p1[1] - p0[1]) * H, (p1[0] - p0[0]) * W) + Math.PI / 2, hw = W * .022;
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.beginPath();
  ctx.moveTo(p0[0] * W - Math.cos(a) * hw, p0[1] * H - Math.sin(a) * hw); ctx.lineTo(p0[0] * W + Math.cos(a) * hw, p0[1] * H + Math.sin(a) * hw); ctx.stroke();
  const lead = rank(r)[0];
  [...r.cars].reverse().forEach(c => {
    const q = at(c.s), x = q.x * W, y = q.y * H, a0 = P[q.i], a1 = P[(q.i + 1) % P.length], u = W * .0042;
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.atan2((a1[1] - a0[1]) * H, (a1[0] - a0[0]) * W));
    ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.fillRect(-4 * u, -1.3 * u, 8.4 * u, 4 * u);
    ctx.fillStyle = '#0b0f14'; [[-3.7, 1.1], [-3.7, -2.1], [1.5, 1], [1.5, -2]].forEach(t => ctx.fillRect(t[0] * u, t[1] * u, 1.7 * u, u));
    ctx.fillStyle = '#10161d'; ctx.fillRect(-4.6 * u, -2.3 * u, .8 * u, 4.6 * u); ctx.fillRect(3.7 * u, -2.5 * u, .9 * u, 5 * u);
    ctx.beginPath(); ctx.moveTo(4.2 * u, 0);
    [[2.6, .55], [1.2, 1.15], [-1, 1.35], [-3.8, .7], [-3.8, -.7], [-1, -1.35], [1.2, -1.15], [2.6, -.55]].forEach(p => ctx.lineTo(p[0] * u, p[1] * u));
    ctx.closePath(); ctx.fillStyle = c.col; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(-3.6 * u, -.18 * u, 7 * u, .36 * u);
    ctx.fillStyle = '#0b0f14'; ctx.beginPath(); ctx.ellipse(-.3 * u, 0, 1.1 * u, .6 * u, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-.4 * u, 0, .42 * u, 0, 7); ctx.fill();
    ctx.restore();
    if (k.sel === c.c) { ctx.beginPath(); ctx.arc(x, y, W * .03, 0, 7); ctx.lineWidth = 2.5; ctx.strokeStyle = g('--ink'); ctx.stroke(); }
    if (c.pit > 0) { ctx.beginPath(); ctx.arc(x, y, W * .02, 0, 7); ctx.lineWidth = 2; ctx.strokeStyle = '#ffb400'; ctx.stroke(); }
  });
  const f = r.cars.find(c => c.c === k.sel) || lead, fq = at(f.s);
  ctx.font = `800 ${Math.max(12, W * .022)}px "Barlow Condensed",sans-serif`; ctx.textAlign = 'center';
  const lx = fq.x * W, ly = fq.y * H - W * .026; ctx.lineWidth = 4; ctx.strokeStyle = g('--field'); ctx.strokeText(f.c, lx, ly); ctx.fillStyle = g('--ink'); ctx.fillText(f.c, lx, ly);
  if (k.rain) {
    ctx.fillStyle = 'rgba(8,20,40,.22)'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(190,220,255,.55)'; ctx.lineWidth = 1; ctx.beginPath();
    drops.forEach(p => { p[1] = (p[1] + .02 * p[2]) % 1; ctx.moveTo(p[0] * W, p[1] * H); ctx.lineTo(p[0] * W - 4, p[1] * H + 11); }); ctx.stroke();
  }
}

export default function RaceSection() {
  const cv = useRef(), race = useRef(null), ctl = useRef({});
  if (!race.current) race.current = createRace();
  const [, tick] = useReducer(x => x + 1, 0);
  const [run, setRun] = useState(false), [speed, setSpeed] = useState(1), [sel, setSel] = useState(null), [rain, setRain] = useState(false);
  ctl.current = { run, speed, sel, rain };

  const restart = () => { race.current = createRace(); setRun(false); tick(); };
  const go = () => { if (race.current.done) race.current = createRace(); setRun(x => !x); };

  useEffect(() => {
    const c = cv.current, ctx = c.getContext('2d');
    let raf, last = 0, acc = 0;
    const drops = Array.from({ length: 140 }, () => [Math.random(), Math.random(), .4 + Math.random()]);
    const fit = () => { const d = Math.min(2, devicePixelRatio || 1); c.width = c.clientWidth * d; c.height = c.clientHeight * d; };
    const ro = new ResizeObserver(fit); ro.observe(c);
    const frame = ts => {
      const dt = Math.min(.05, (ts - last) / 1000 || 0); last = ts;
      const k = ctl.current, r = race.current; r.rain = k.rain;
      if (k.run && !r.done) { step(r, dt * k.speed); acc += dt; if (acc > .08) { acc = 0; tick(); } }
      if (k.run && r.done) { setRun(false); tick(); }
      draw(ctx, c, r, k, drops); raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setRun(true);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  useEffect(() => {
    const h = e => {
      if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName) || e.metaKey || e.ctrlKey) return;
      const k = e.key.toLowerCase();
      if (k === 'p') go(); else if (k === 'r') restart(); else if (k === 'w') setRain(x => !x);
      else if (k >= '1' && k <= '3') setSpeed([1, 2, 4][+k - 1]);
    };
    addEventListener('keydown', h); return () => removeEventListener('keydown', h);
  }, []);

  const r = race.current, R = rank(r), lead = R[0], f = r.cars.find(d => d.c === sel) || lead;
  const gap = (d, i) => !i ? (d.fin != null ? 'Finished' : `Lap ${Math.min(LAPS, Math.max(1, d.li + 1))}/${LAPS}`)
    : d.fin != null && lead.fin != null ? '+' + (d.fin - lead.fin).toFixed(1) + 's'
    : r.t ? '+' + Math.max(0, (lead.s - d.s) / .37).toFixed(1) + 's' : '–';
  const status = r.done ? `${lead.n} wins in ${lead.fin.toFixed(1)} seconds.` : run ? `Lap ${Math.min(LAPS, Math.max(1, lead.li + 1))} of ${LAPS}${rain ? ', raining' : ''}.` : r.t ? 'Paused.' : 'Ready on the grid.';

  return (
    <div className="race" id="race">
      <div className="stage">
        <canvas ref={cv} aria-label="Top-down view of six cars racing around a circuit" />
        <div className="bar">
          <button className="btn" onClick={go}>{r.done ? 'Race again' : run ? 'Pause' : r.t ? 'Resume' : 'Start race'}</button>
          <button className="btn ghost" onClick={restart}>Restart</button>
          <button className="chip" aria-pressed={rain} onClick={() => setRain(x => !x)}>Rain</button>
          <div className="seg" role="group" aria-label="Simulation speed">
            {[1, 2, 4].map(x => <button key={x} aria-pressed={speed === x} onClick={() => setSpeed(x)}>{x}×</button>)}
          </div>
          <div className="status" aria-live="polite">{status}</div>
          <div className="status">Keys: P pause, R restart, 1 to 3 speed, W rain</div>
        </div>
      </div>
      <div className="col">
        <aside className="tower">
          <h2>Timing tower</h2>
          <ol className="rows">
            {r.cars.map(d => {
              const i = R.indexOf(d);
              return (
                <li key={d.c} style={{ position: 'absolute', left: 0, right: 0, top: 0, listStyle: 'none' }}>
                  <button type="button" className="row" aria-pressed={sel === d.c} style={{ transform: `translateY(${i * 54}px)` }} onClick={() => setSel(sel === d.c ? null : d.c)}>
                    <b>{i + 1}</b><div className="k" style={{ background: d.col }} />
                    <span>{d.n}<i className={'tyre t-' + d.tyre}>{d.tyre}</i>{d.pit > 0 && ' PIT'}</span><em>{gap(d, i)}</em>
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="fl">{r.best ? `Fastest lap: ${r.cars.find(d => d.c === r.best.c).n}, ${r.best.t.toFixed(2)}s` : 'Fastest lap: not set yet'}</p>
        </aside>
        <aside className="tele">
          <h2>{f.n} telemetry</h2>
          <div className="tv"><strong>{Math.round(kmh(f.v))}</strong> km/h</div>
          <svg className="spark" viewBox="0 0 150 44" preserveAspectRatio="none" aria-label="Speed trace">
            <polyline fill="none" stroke={f.col} strokeWidth="1.8" points={f.hist.map((v, i) => `${i},${44 - v / 300 * 42}`).join(' ')} />
          </svg>
          <div className="m"><span>Tyre wear</span><i style={{ '--c': f.col }}><u style={{ width: f.wear * 100 + '%' }} /></i><b>{Math.round(f.wear * 100)}%</b></div>
          <div className="facts">
            <div><strong>{NAME[f.tyre]}</strong>compound</div><div><strong>{f.stops}</strong>pit stops</div>
            <div><strong>{f.best ? f.best.toFixed(2) + 's' : '–'}</strong>best lap</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
