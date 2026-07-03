import { useMemo, useState } from 'react'
import { useApp } from '../state/AppContext.jsx'
import { EXERCISES, exerciseName } from '../data/exercises.js'
import { todayISO } from '../lib/metrics.js'

export default function WorkoutLog() {
  const { activePlan, addWorkout, workouts, deleteWorkout } = useApp()

  const [date, setDate] = useState(todayISO())
  const [entries, setEntries] = useState([])

  const startFromPlan = () => {
    if (!activePlan) return
    setEntries(
      activePlan.exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        sets: Array.from({ length: ex.targetSets }, () => ({ reps: ex.targetReps, weight: 0 })),
      })),
    )
  }

  const addEntry = () => {
    setEntries((prev) => [...prev, { exerciseId: EXERCISES[0].id, sets: [{ reps: 10, weight: 0 }] }])
  }

  const updateEntry = (idx, patch) => {
    setEntries((prev) => prev.map((e, i) => (i === idx ? { ...e, ...patch } : e)))
  }

  const removeEntry = (idx) => {
    setEntries((prev) => prev.filter((_, i) => i !== idx))
  }

  const addSet = (idx) => {
    setEntries((prev) =>
      prev.map((e, i) => {
        if (i !== idx) return e
        const last = e.sets[e.sets.length - 1] ?? { reps: 10, weight: 0 }
        return { ...e, sets: [...e.sets, { ...last }] }
      }),
    )
  }

  const updateSet = (idx, setIdx, patch) => {
    setEntries((prev) =>
      prev.map((e, i) => {
        if (i !== idx) return e
        return { ...e, sets: e.sets.map((s, j) => (j === setIdx ? { ...s, ...patch } : s)) }
      }),
    )
  }

  const removeSet = (idx, setIdx) => {
    setEntries((prev) =>
      prev.map((e, i) => (i === idx ? { ...e, sets: e.sets.filter((_, j) => j !== setIdx) } : e)),
    )
  }

  const canSave = entries.length > 0 && entries.every((e) => e.sets.length > 0)

  const saveSession = () => {
    if (!canSave) return
    addWorkout({
      date,
      planId: activePlan?.id ?? null,
      entries: entries.map((e) => ({
        exerciseId: e.exerciseId,
        sets: e.sets.map((s) => ({ reps: Number(s.reps) || 0, weight: Number(s.weight) || 0 })),
      })),
    })
    setEntries([])
  }

  const recent = useMemo(
    () => [...workouts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8),
    [workouts],
  )

  return (
    <div className="page">
      <header className="page-head">
        <h1>Log Workout</h1>
        <p className="muted">Record the exercises, sets, reps and weight for a training session.</p>
      </header>

      <section className="card">
        <div className="log-toolbar">
          <label className="field inline">
            <span>Date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          {activePlan && (
            <button className="btn ghost" onClick={startFromPlan}>
              Prefill from “{activePlan.name}”
            </button>
          )}
          <button className="btn" onClick={addEntry}>+ Add exercise</button>
        </div>

        {entries.length === 0 ? (
          <div className="empty">
            No exercises added. {activePlan ? 'Prefill from your active plan or ' : ''}add one to begin.
          </div>
        ) : (
          <div className="entry-list">
            {entries.map((entry, idx) => (
              <div key={idx} className="entry">
                <div className="entry-head">
                  <select
                    value={entry.exerciseId}
                    onChange={(e) => updateEntry(idx, { exerciseId: e.target.value })}
                  >
                    {EXERCISES.map((ex) => (
                      <option key={ex.id} value={ex.id}>{ex.name}</option>
                    ))}
                  </select>
                  <button className="icon-btn" onClick={() => removeEntry(idx)} aria-label="Remove exercise">✕</button>
                </div>

                <div className="set-head">
                  <span>Set</span>
                  <span>Reps</span>
                  <span>Weight (kg)</span>
                  <span></span>
                </div>
                {entry.sets.map((set, setIdx) => (
                  <div key={setIdx} className="set-row">
                    <span className="set-num">{setIdx + 1}</span>
                    <input
                      type="number"
                      min="0"
                      value={set.reps}
                      onChange={(e) => updateSet(idx, setIdx, { reps: e.target.value })}
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={set.weight}
                      onChange={(e) => updateSet(idx, setIdx, { weight: e.target.value })}
                    />
                    <button className="icon-btn" onClick={() => removeSet(idx, setIdx)} aria-label="Remove set">✕</button>
                  </div>
                ))}
                <button className="btn ghost small" onClick={() => addSet(idx)}>+ Add set</button>
              </div>
            ))}
          </div>
        )}

        <div className="log-footer">
          <button className="btn primary" disabled={!canSave} onClick={saveSession}>
            Save session
          </button>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">Recent sessions</h2>
        {recent.length === 0 ? (
          <p className="muted small">No sessions logged yet.</p>
        ) : (
          <ul className="session-list">
            {recent.map((w) => (
              <li key={w.id} className="session-row">
                <div>
                  <div className="session-date">{formatDate(w.date)}</div>
                  <div className="session-summary muted small">
                    {w.entries.map((e) => exerciseName(e.exerciseId)).join(', ')}
                  </div>
                </div>
                <div className="session-meta">
                  <span className="pill">{totalSets(w)} sets</span>
                  <button className="btn danger-ghost small" onClick={() => deleteWorkout(w.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function totalSets(workout) {
  return workout.entries.reduce((sum, e) => sum + e.sets.length, 0)
}

function formatDate(iso) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
