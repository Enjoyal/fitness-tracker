import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ResponsiveContainer, Line, LineChart, Tooltip } from 'recharts'
import { useApp } from '../state/AppContext.jsx'
import { calcCaloriePlan } from '../lib/calories.js'
import { exerciseName } from '../data/exercises.js'
import { currentStreak, volumeSeries, workoutsThisWeek } from '../lib/metrics.js'

export default function Dashboard() {
  const { profile, workouts, weightLog, activePlan } = useApp()

  const plan = calcCaloriePlan(profile)
  const thisWeek = useMemo(() => workoutsThisWeek(workouts), [workouts])
  const streak = useMemo(() => currentStreak(workouts), [workouts])
  const volume = useMemo(() => volumeSeries(workouts).slice(-10), [workouts])
  const latestWeight = weightLog.length ? weightLog[weightLog.length - 1].weightKg : profile.weightKg

  const greeting = profile.name ? `Welcome back, ${profile.name}` : 'Welcome back'

  return (
    <div className="page">
      <header className="page-head">
        <h1>{greeting} 👋</h1>
        <p className="muted">Here's a snapshot of your training and nutrition plan.</p>
      </header>

      <div className="stat-row">
        <StatTile label="Workouts this week" value={thisWeek} suffix="sessions" />
        <StatTile label="Current streak" value={streak} suffix={streak === 1 ? 'day' : 'days'} />
        <StatTile label="Daily target" value={plan.target.toLocaleString()} suffix="kcal" accent />
        <StatTile label="Bodyweight" value={latestWeight} suffix="kg" />
      </div>

      <div className="two-col">
        <section className="card">
          <div className="card-title-row">
            <h2 className="card-title">Active plan</h2>
            <Link to="/plans" className="link">Manage →</Link>
          </div>
          {activePlan ? (
            <>
              <div className="active-plan-name">{activePlan.name}</div>
              {activePlan.exercises.length === 0 ? (
                <p className="muted small">No exercises in this plan yet.</p>
              ) : (
                <ul className="ex-list compact">
                  {activePlan.exercises.map((ex, i) => (
                    <li key={i} className="ex-row">
                      <span className="ex-name">{exerciseName(ex.exerciseId)}</span>
                      <span className="ex-target">{ex.targetSets} × {ex.targetReps}</span>
                    </li>
                  ))}
                </ul>
              )}
              <Link to="/log" className="btn primary block">Log a workout</Link>
            </>
          ) : (
            <div className="empty">
              No active plan. <Link to="/plans" className="link">Create one</Link> to get started.
            </div>
          )}
        </section>

        <section className="card">
          <div className="card-title-row">
            <h2 className="card-title">Nutrition plan</h2>
            <Link to="/calories" className="link">Adjust →</Link>
          </div>
          <div className="cal-summary">
            <div className="cal-big">{plan.target.toLocaleString()}<span> kcal/day</span></div>
            <div className="cal-sub muted small">
              BMR {plan.bmr.toLocaleString()} · TDEE {plan.tdee.toLocaleString()}
            </div>
          </div>
          <div className="macro-grid">
            <MiniMacro color="var(--c1)" label="Protein" grams={plan.macros.protein} />
            <MiniMacro color="var(--c2)" label="Carbs" grams={plan.macros.carbs} />
            <MiniMacro color="var(--c3)" label="Fat" grams={plan.macros.fat} />
          </div>
        </section>
      </div>

      <section className="card">
        <div className="card-title-row">
          <h2 className="card-title">Volume trend</h2>
          <Link to="/progress" className="link">View progress →</Link>
        </div>
        {volume.length === 0 ? (
          <div className="empty chart-empty">Log workouts to build your trend.</div>
        ) : (
          <div className="spark-wrap">
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={volume} margin={{ top: 6, right: 6, bottom: 6, left: 6 }}>
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface-1)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    color: 'var(--text-primary)',
                    fontSize: 13,
                  }}
                  formatter={(v) => [`${v} kg`, 'Volume']}
                  labelFormatter={() => ''}
                />
                <Line type="monotone" dataKey="volume" stroke="var(--c1)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </div>
  )
}

function StatTile({ label, value, suffix, accent }) {
  return (
    <div className={'stat-tile' + (accent ? ' accent' : '')}>
      <div className="stat-value">{value}<span className="stat-suffix"> {suffix}</span></div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

function MiniMacro({ color, label, grams }) {
  return (
    <div className="macro">
      <span className="macro-dot" style={{ background: color }} aria-hidden />
      <span className="macro-grams">{grams} g</span>
      <span className="macro-label">{label}</span>
    </div>
  )
}
