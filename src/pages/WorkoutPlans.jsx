import { useState } from 'react'
import { useApp } from '../state/AppContext.jsx'
import { EXERCISES, exerciseName } from '../data/exercises.js'

export default function WorkoutPlans() {
  const { plans, addPlan, updatePlan, deletePlan, setActivePlan } = useApp()
  const [name, setName] = useState('')

  const createPlan = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    const id = addPlan({ name: trimmed })
    setName('')
    // Make the first plan active by default.
    if (plans.length === 0) setActivePlan(id)
  }

  return (
    <div className="page">
      <header className="page-head">
        <h1>Workout Plans</h1>
        <p className="muted">Build reusable templates with target sets and reps. Mark one as active to log against it.</p>
      </header>

      <form className="card inline-form" onSubmit={createPlan}>
        <input
          type="text"
          placeholder="New plan name (e.g. Push Day)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className="btn primary">Create plan</button>
      </form>

      {plans.length === 0 ? (
        <div className="empty">No plans yet. Create your first one above.</div>
      ) : (
        <div className="plan-list">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onUpdate={updatePlan}
              onDelete={deletePlan}
              onActivate={setActivePlan}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function PlanCard({ plan, onUpdate, onDelete, onActivate }) {
  const [exerciseId, setExerciseId] = useState(EXERCISES[0].id)
  const [sets, setSets] = useState(3)
  const [reps, setReps] = useState(10)

  const addExercise = (e) => {
    e.preventDefault()
    onUpdate(plan.id, {
      exercises: [
        ...plan.exercises,
        { exerciseId, targetSets: Number(sets), targetReps: Number(reps) },
      ],
    })
  }

  const removeExercise = (idx) => {
    onUpdate(plan.id, { exercises: plan.exercises.filter((_, i) => i !== idx) })
  }

  return (
    <section className={'card plan-card' + (plan.active ? ' active' : '')}>
      <div className="plan-card-head">
        <h2 className="card-title">
          {plan.name}
          {plan.active && <span className="badge">Active</span>}
        </h2>
        <div className="plan-actions">
          {!plan.active && (
            <button className="btn ghost" onClick={() => onActivate(plan.id)}>Set active</button>
          )}
          <button className="btn danger-ghost" onClick={() => onDelete(plan.id)}>Delete</button>
        </div>
      </div>

      {plan.exercises.length === 0 ? (
        <p className="muted small">No exercises yet.</p>
      ) : (
        <ul className="ex-list">
          {plan.exercises.map((ex, idx) => (
            <li key={idx} className="ex-row">
              <span className="ex-name">{exerciseName(ex.exerciseId)}</span>
              <span className="ex-target">{ex.targetSets} × {ex.targetReps}</span>
              <button className="icon-btn" onClick={() => removeExercise(idx)} aria-label="Remove">✕</button>
            </li>
          ))}
        </ul>
      )}

      <form className="ex-add" onSubmit={addExercise}>
        <select value={exerciseId} onChange={(e) => setExerciseId(e.target.value)}>
          {EXERCISES.map((ex) => (
            <option key={ex.id} value={ex.id}>{ex.name}</option>
          ))}
        </select>
        <input type="number" min="1" max="20" value={sets} onChange={(e) => setSets(e.target.value)} aria-label="Sets" />
        <span className="times">×</span>
        <input type="number" min="1" max="100" value={reps} onChange={(e) => setReps(e.target.value)} aria-label="Reps" />
        <button type="submit" className="btn">Add</button>
      </form>
    </section>
  )
}
