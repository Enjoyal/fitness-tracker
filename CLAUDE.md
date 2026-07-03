# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # install dependencies
npm run dev         # start Vite dev server (default http://localhost:5173)
npm run build       # production build to dist/
npm run preview     # serve the production build locally
```

There is no test suite, linter, or type checker configured in this project.

## Architecture

Single-page React app (React 18 + Vite, no backend, no server-side state). All
data lives in the browser's `localStorage`; there is no API layer.

- **State**: `src/state/AppContext.jsx` is the single source of truth. One
  `AppProvider` holds four slices — `profile`, `plans`, `workouts`,
  `weightLog` — each loaded from storage on mount and written back via a
  `useEffect` whenever it changes. Pages consume this via the `useApp()` hook
  rather than local component state, so any new persisted data should be added
  as a new slice here (plus a matching key in `storage.js`), not as ad-hoc
  `localStorage` calls in components.
- **Persistence**: `src/lib/storage.js` centralizes all `localStorage` access.
  Keys are namespaced under the `wt.` prefix and JSON-encoded; `read()` falls
  back to a per-key default (see `DEFAULTS`/`DEFAULT_PROFILE`) if the key is
  missing or corrupt. Always read/write through `KEYS`, `read()`, and
  `write()` — don't touch `localStorage` directly elsewhere.
- **Domain logic lives in `src/lib/`, not in components**:
  - `calories.js` — Mifflin-St Jeor BMR → TDEE (activity factor) → daily
    target (goal-based deficit/surplus) → macro split (seeded by body type).
    Pure functions; `calcCaloriePlan(profile)` is the main entry point and
    returns every intermediate number for transparent display.
  - `metrics.js` — derives progress data from raw `workouts`: training
    volume, Epley-estimated 1RM per exercise, weekly workout count, and
    current streak (consecutive-day logic anchored on `todayISO()`).
- **Routing**: `App.jsx` defines the sidebar nav and route table
  (`react-router-dom`) mapping directly to the five pages in `src/pages/`
  (Dashboard, WorkoutLog, WorkoutPlans, Progress, CaloriePlan). Charts use
  Recharts, fed by the derived series from `metrics.js`.
- **Exercise catalog**: `src/data/exercises.js` is a static, built-in list
  looked up via `getExercise(id)`; workouts/plans reference exercises by id,
  not by embedding exercise data.

### Data shape conventions

- Dates are ISO date strings (`YYYY-MM-DD`), compared with `localeCompare`/
  string equality rather than `Date` objects where possible.
- Workouts have `entries[]`, each with an `exerciseId` and `sets[]` of
  `{ reps, weight }`.
- IDs are generated with `newId()` in `storage.js` (timestamp + random, not a
  UUID lib).
