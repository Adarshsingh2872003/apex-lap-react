import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { setupScene, buildCar } from '../lib/models.js';
import { CARS, SWATCHES } from '../lib/data.js';

export default function Showroom({ index, setIndex }) {
  const box = useRef(), api = useRef({}), c = CARS[index];
  const [color, setColor] = useState(c.c);

  useEffect(() => {
    const el = box.current; let R;
    try { R = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { el.append('The 3D showroom needs WebGL, which is unavailable here.'); return; }
    R.setPixelRatio(Math.min(2, devicePixelRatio || 1)); R.outputEncoding = THREE.sRGBEncoding; R.toneMapping = THREE.ACESFilmicToneMapping;
    R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap; el.appendChild(R.domElement);
    const { sc, cam, ringM } = setupScene(R);
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let model, paint, wheels = [], az = .9, elv = .26, auto = !calm, vis = true, drag = null, idle, raf, lt = 0;
    api.current.show = car => {
      if (model) { sc.remove(model); model.traverse(o => o.geometry && o.geometry.dispose()); }
      const b = buildCar(car); model = b.group; paint = b.paint; wheels = b.wheels; sc.add(model); ringM.color.set(car.c);
    };
    api.current.paint = hex => { if (paint) { paint.color.set(hex); ringM.color.set(hex); } };
    const cvs = R.domElement;
    const down = e => { drag = [e.clientX, e.clientY]; auto = false; cvs.setPointerCapture(e.pointerId); };
    const move = e => {
      if (!drag) return; az -= (e.clientX - drag[0]) * .008;
      if (e.pointerType === 'mouse') elv = Math.max(.05, Math.min(.8, elv + (e.clientY - drag[1]) * .004));
      drag = [e.clientX, e.clientY];
    };
    const up = () => { drag = null; clearTimeout(idle); if (!calm) idle = setTimeout(() => auto = true, 3500); };
    cvs.addEventListener('pointerdown', down); cvs.addEventListener('pointermove', move); cvs.addEventListener('pointerup', up); cvs.addEventListener('pointercancel', up);
    const ro = new ResizeObserver(() => { const w = el.clientWidth, h = el.clientHeight; if (!w) return; R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }); ro.observe(el);
    const io = new IntersectionObserver(e => vis = e[0].isIntersecting); io.observe(el);
    const frame = ts => {
      const dt = Math.min(.05, (ts - lt) / 1000 || 0); lt = ts;
      if (vis && model) {
        if (auto) az += dt * .3;
        if (!calm) wheels.forEach(w => w.sp.rotation.z -= w.side * dt * 4);
        const d = 7.6 * (cam.aspect < 1.2 ? 1.35 : 1);
        cam.position.set(Math.sin(az) * Math.cos(elv) * d, .55 + Math.sin(elv) * d, Math.cos(az) * Math.cos(elv) * d); cam.lookAt(0, .55, 0); R.render(sc, cam);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); clearTimeout(idle); ro.disconnect(); io.disconnect(); R.dispose(); cvs.remove(); api.current = {}; };
  }, []);

  useEffect(() => { api.current.show?.(CARS[index]); setColor(CARS[index].c); }, [index]);
  useEffect(() => { api.current.paint?.(color); }, [color]);

  return (
    <section id="showroom">
      <h2 className="big">Showroom</h2>
      <p className="lede" style={{ margin: 0 }}>Every car is built live in 3D with glass, clear-coat paint and spinning wheels. Drag to turn it, then pick a paint colour.</p>
      <div className="sr">
        <div className="gl" ref={box}><small>Drag to rotate</small></div>
        <div className="side">
          <h3>{c.n}</h3><p>{c.cl} class</p>
          <div className="st">
            <div><strong>{c.top}</strong>km/h top speed</div><div><strong>{c.acc.toFixed(1)}s</strong>0–100 km/h</div>
            <div><strong>{c.hp}</strong>horsepower</div><div><strong>{Math.round(c.hp / c.kg * 1000)}</strong>hp per tonne</div>
          </div>
          <div className="sw" role="group" aria-label="Paint colour">
            {SWATCHES.map(x => <button key={x} style={{ '--c': x }} aria-label={'Paint ' + x} aria-pressed={color === x} onClick={() => setColor(x)} />)}
          </div>
          <div className="pick">{CARS.map((k, i) => <button key={k.n} className="chip" aria-pressed={i === index} onClick={() => setIndex(i)}>{k.n}</button>)}</div>
        </div>
      </div>
    </section>
  );
}
