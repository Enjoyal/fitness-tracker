// Centralized localStorage access. Every key is namespaced under `wt.` and
// stored as JSON. read() falls back to the provided default when the key is
// missing or the stored value is corrupt.

const PREFIX = 'wt.'

export const KEYS = {
  profile: 'profile',
  plans: 'plans',
  workouts: 'workouts',
  weightLog: 'weightLog',
}

export const DEFAULT_PROFILE = {
  name: '',
  sex: 'male', // 'male' | 'female'
  age: 30,
  heightCm: 175,
  weightKg: 75,
  activityLevel: 'moderate', // sedentary | light | moderate | very | extra
  bodyType: 'mesomorph', // ectomorph | mesomorph | endomorph
  goal: 'lose', // lose | maintain | gain
}

const DEFAULTS = {
  [KEYS.profile]: DEFAULT_PROFILE,
  [KEYS.plans]: [],
  [KEYS.workouts]: [],
  [KEYS.weightLog]: [],
}

export function read(key) {
  const fallback = DEFAULTS[key]
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw == null) return structuredCloneSafe(fallback)
    const parsed = JSON.parse(raw)
    return parsed ?? structuredCloneSafe(fallback)
  } catch {
    return structuredCloneSafe(fallback)
  }
}

export function write(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch (err) {
    // Storage full or unavailable (e.g. private mode) — fail quietly.
    console.warn('Failed to persist', key, err)
  }
}

// Simple id generator that does not rely on Date.now/Math.random being blocked
// at runtime (this runs in the browser, not the workflow sandbox).
export function newId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  )
}

function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value))
}
