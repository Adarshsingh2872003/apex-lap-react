# Apex Lap (React + Vite + Three.js)

Live race simulator with pit stops, tyre wear, rain and driver telemetry, plus a 3D car showroom and a filterable garage.

## Run
```
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the build
```
Needs Node.js 18 or newer.

## Structure
- src/lib/engine.js: race simulation (tyres, wear, pit stops, rain)
- src/lib/track.js: circuit spline and position lookup
- src/lib/models.js: procedural 3D cars and studio lighting
- src/lib/data.js: drivers, cars, paint colours
- src/components/: RaceSection, Showroom, Garage
- src/styles.css: theme tokens and layout (light and dark)

Keyboard in the race: P pause, R restart, 1 to 3 speed, W rain.
