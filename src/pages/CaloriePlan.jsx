import { useApp } from '../state/AppContext.jsx'
import {
  ACTIVITY_LABELS,
  BODY_TYPES,
  GOAL_LABELS,
  calcCaloriePlan,
} from '../lib/calories.js'

export default function CaloriePlan() {
  const { profile, updateProfile } = useApp()
  const plan = calcCaloriePlan(profile)

  const num = (key) => (e) => updateProfile({ [key]: Number(e.target.value) })
  const str = (key) => (e) => updateProfile({ [key]: e.target.value })

  return (
    <div className="page">
      <header className="page-head">
        <h1>Calorie Plan</h1>
        <p className="muted">
          Your daily calorie and macro targets, calculated with the Mifflin-St Jeor equation and tuned to your body type.
        </p>
      </header>

      <div className="two-col">
        <section className="card">
          <h2 className="card-title">Your profile</h2>
          <div className="form-grid">
            <label className="field">
              <span>Name</span>
              <input type="text" value={profile.name} onChange={str('name')} placeholder="Optional" />
            </label>

            <label className="field">
              <span>Sex</span>
              <select value={profile.sex} onChange={str('sex')}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>

            <label className="field">
              <span>Age (years)</span>
              <input type="number" min="10" max="100" value={profile.age} onChange={num('age')} />
            </label>

            <label className="field">
              <span>Height (cm)</span>
              <input type="number" min="120" max="230" value={profile.heightCm} onChange={num('heightCm')} />
            </label>

            <label className="field">
              <span>Weight (kg)</span>
              <input type="number" min="30" max="250" value={profile.weightKg} onChange={num('weightKg')} />
            </label>

            <label className="field">
              <span>Activity level</span>
              <select value={profile.activityLevel} onChange={str('activityLevel')}>
                {Object.entries(ACTIVITY_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>{label}</option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Body type</span>
              <select value={profile.bodyType} onChange={str('bodyType')}>
                {Object.entries(BODY_TYPES).map(([k, { label }]) => (
                  <option key={k} value={k}>{label}</option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Goal</span>
              <select value={profile.goal} onChange={str('goal')}>
                {Object.entries(GOAL_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>{label}</option>
                ))}
              </select>
            </label>
          </div>
          <p className="hint">Changes save automatically.</p>
        </section>

        <section className="card plan-result">
          <h2 className="card-title">Your daily plan</h2>

          <div className="target-hero">
            <div className="target-value">{plan.target.toLocaleString()}</div>
            <div className="target-label">kcal / day</div>
          </div>

          <div className="calc-row">
            <div className="calc-item">
              <span className="calc-num">{plan.bmr.toLocaleString()}</span>
              <span className="calc-cap">BMR</span>
            </div>
            <span className="calc-op">×</span>
            <div className="calc-item">
              <span className="calc-num">{ACTIVITY_LABELS[profile.activityLevel].split(' ')[0]}</span>
              <span className="calc-cap">Activity</span>
            </div>
            <span className="calc-op">=</span>
            <div className="calc-item">
              <span className="calc-num">{plan.tdee.toLocaleString()}</span>
              <span className="calc-cap">TDEE</span>
            </div>
            <span className="calc-op">{plan.adjustment >= 0 ? '+' : '−'}</span>
            <div className="calc-item">
              <span className="calc-num">{Math.abs(plan.adjustment)}</span>
              <span className="calc-cap">{GOAL_LABELS[profile.goal]}</span>
            </div>
          </div>

          <h3 className="macro-heading">Macros</h3>
          <div className="macro-grid">
            <Macro color="var(--c1)" label="Protein" grams={plan.macros.protein} />
            <Macro color="var(--c2)" label="Carbs" grams={plan.macros.carbs} />
            <Macro color="var(--c3)" label="Fat" grams={plan.macros.fat} />
          </div>

          <p className="body-note">{plan.bodyTypeNote}</p>
        </section>
      </div>
    </div>
  )
}

function Macro({ color, label, grams }) {
  return (
    <div className="macro">
      <span className="macro-dot" style={{ background: color }} aria-hidden />
      <span className="macro-grams">{grams} g</span>
      <span className="macro-label">{label}</span>
    </div>
  )
}
