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

## Sign-in and sign-up
The app opens on a demo sign-in screen. Use **Create an account** to open the sign-up form, where a valid email address and matching passwords of at least 6 characters start a demo session. The app saves only the email in `sessionStorage` for the current browser tab; it does not verify credentials, retain account records, or store passwords. Sign-in likewise accepts any valid email and password.

This is a frontend-only demonstration, not production authentication. Do not use it to protect real accounts or data. Connect a trusted authentication provider or backend before deploying with protected content.

## Structure
- src/lib/engine.js: race simulation (tyres, wear, pit stops, rain)
- src/lib/track.js: circuit spline and position lookup
- src/lib/models.js: procedural 3D cars and studio lighting
- src/lib/data.js: drivers, cars, paint colours
- src/components/: AuthScreen, Dashboard, RaceSection, Showroom, Garage
- src/styles.css: theme tokens and layout (light and dark)

Keyboard in the race: P pause, R restart, 1 to 3 speed, W rain.
