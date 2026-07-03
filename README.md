# Workout Tracker

A single-page fitness app to log workouts, track sets & reps, watch your progress
over time, and get a calorie/deficit plan tailored to your body type. All data is
stored locally in your browser — no account, no backend, works offline.

## Features

- **Dashboard** — snapshot of workouts this week, streak, daily calorie target,
  bodyweight, your active plan, and a volume trend.
- **Log Workout** — record exercises with sets, reps and weight; prefill from your
  active plan; review and delete recent sessions.
- **Plans** — build reusable workout templates with target sets/reps and mark one
  as active.
- **Progress** — line charts for training volume, estimated 1-rep max (Epley) per
  exercise, and bodyweight over time.
- **Calorie Plan** — BMR via the Mifflin-St Jeor equation → TDEE (activity level)
  → daily target (goal), with a macro split seeded by your body type.

## Tech

- React 18 + Vite
- react-router-dom for navigation
- Recharts for charts
- Data persisted to browser `localStorage` (namespaced under `wt.`)

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (typically http://localhost:5173).

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## How it works

- `src/lib/storage.js` + `src/state/AppContext.jsx` — the persistence layer:
  React Context loads each data slice from `localStorage` on mount and writes it
  back on change.
- `src/lib/calories.js` — Mifflin-St Jeor BMR, TDEE, deficit and macro math.
- `src/lib/metrics.js` — derives progress metrics (volume, 1RM, streak) from
  logged workouts.
- `src/data/exercises.js` — the built-in exercise catalog.

To reset all data, clear this site's data in your browser (or run
`localStorage.clear()` in the console).
