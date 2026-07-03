// Progress metrics derived from logged workouts. All functions are pure so they
// can be memoized in components.
import { getExercise } from '../data/exercises.js'

export function todayISO() {
  const d = new Date()
  const tz = d.getTimezoneOffset() * 60000
  return new Date(d - tz).toISOString().slice(0, 10)
}

// Epley estimated 1-rep max for a single set.
export function estimated1RM(weight, reps) {
  if (weight <= 0 || reps <= 0) return 0
  return weight * (1 + reps / 30)
}

export function setVolume(set) {
  return (Number(set.reps) || 0) * (Number(set.weight) || 0)
}

export function workoutVolume(workout) {
  return workout.entries.reduce(
    (sum, e) => sum + e.sets.reduce((s, set) => s + setVolume(set), 0),
    0,
  )
}

// [{ date, volume }] ordered by date — one point per logged session.
export function volumeSeries(workouts) {
  return [...workouts]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((w) => ({ date: w.date, volume: Math.round(workoutVolume(w)) }))
}

// Best estimated 1RM for a given exercise per session date.
export function oneRepMaxSeries(workouts, exerciseId) {
  return [...workouts]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((w) => {
      const entry = w.entries.find((e) => e.exerciseId === exerciseId)
      if (!entry) return null
      const best = Math.max(0, ...entry.sets.map((s) => estimated1RM(Number(s.weight), Number(s.reps))))
      return best > 0 ? { date: w.date, oneRM: Math.round(best) } : null
    })
    .filter(Boolean)
}

// Distinct exercise ids that appear in any logged workout.
export function loggedExerciseIds(workouts) {
  const ids = new Set()
  workouts.forEach((w) => w.entries.forEach((e) => ids.add(e.exerciseId)))
  return [...ids].filter((id) => getExercise(id))
}

// Count of workouts within the current ISO week (Mon–Sun).
export function workoutsThisWeek(workouts) {
  const now = new Date()
  const day = (now.getDay() + 6) % 7 // 0 = Monday
  const monday = new Date(now)
  monday.setDate(now.getDate() - day)
  monday.setHours(0, 0, 0, 0)
  return workouts.filter((w) => new Date(w.date + 'T00:00:00') >= monday).length
}

// Longest run of consecutive calendar days with at least one workout, ending today.
export function currentStreak(workouts) {
  const dates = new Set(workouts.map((w) => w.date))
  let streak = 0
  const cursor = new Date()
  // If nothing logged today, streak can still count up to yesterday.
  if (!dates.has(todayISO())) cursor.setDate(cursor.getDate() - 1)
  for (;;) {
    const iso = cursor.toISOString().slice(0, 10)
    if (!dates.has(iso)) break
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}
