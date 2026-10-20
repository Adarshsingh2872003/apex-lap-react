import { at, slow, L } from './track.js';
import { DRIVERS } from './data.js';
export const LAPS = 6, K = 1.3, kmh = v => v * 520;
// g = speed factor, w = tyre wear per lap
const TY = { S: { g: 1.04, w: .16 }, M: { g: 1, w: .1 }, H: { g: .965, w: .06 } };

export const createRace = () => ({
  t: 0, best: null, done: false, rain: false,
  cars: DRIVERS.map((d, i) => ({ ...d, s: -i * .07, li: -1, ls: 0, best: null, fin: null, ph: i * 1.7, wear: 0, pit: 0, stops: 0, v: 0, hist: [], acc: 0 })),
});

export function step(r, dt) {
  r.t += dt;
  for (const d of r.cars) {
    const ty = TY[d.tyre];
    if (d.pit > 0) {                       // stationary in the pit box
      d.pit -= dt; d.v = 0;
      if (d.pit <= 0) { d.tyre = d.next; d.wear = 0; d.stops++; }
    } else {
      const base = d.sp * K * slow[at(d.s).i] * (1 + .05 * Math.sin(r.t * .6 + d.ph));
      d.v = base * ty.g * (1 - .3 * d.wear) * (r.rain ? .86 : 1) * (d.fin != null ? .55 : 1);
      d.s += d.v * dt;
      if (d.fin == null) {
        d.wear = Math.min(1, d.wear + ty.w * (r.rain ? 1.25 : 1) * dt / 13);
        const li = Math.floor(d.s / L);
        if (li > d.li) {
          if (d.li >= 0) {
            const lt = r.t - d.ls;
            if (d.best == null || lt < d.best) d.best = lt;
            if (!r.best || lt < r.best.t) r.best = { t: lt, c: d.c };
          }
          d.ls = r.t; d.li = li;
          if (li >= LAPS) d.fin = r.t;
          else if (li > 0 && d.wear > .5 && LAPS - li >= 2) {   // pit strategy
            d.pit = 2.6; d.next = d.tyre === 'S' ? 'M' : d.tyre === 'M' ? 'H' : 'M'; d.s = li * L;
          }
        }
      }
    }
    d.acc += dt;
    if (d.acc > .1) { d.acc = 0; d.hist.push(Math.round(kmh(d.v))); if (d.hist.length > 150) d.hist.shift(); }
  }
  if (!r.done && r.cars.every(d => d.fin != null)) r.done = true;
}
export const rank = r => [...r.cars].sort((a, b) =>
  a.fin != null && b.fin != null ? a.fin - b.fin : a.fin != null ? -1 : b.fin != null ? 1 : b.s - a.s);
