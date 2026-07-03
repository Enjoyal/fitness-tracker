import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useApp } from '../state/AppContext.jsx'
import { exerciseName } from '../data/exercises.js'
import {
  loggedExerciseIds,
  oneRepMaxSeries,
  todayISO,
  volumeSeries,
} from '../lib/metrics.js'

export default function Progress() {
  const { workouts, weightLog, logWeight } = useApp()

  const volume = useMemo(() => volumeSeries(workouts), [workouts])
  const exerciseIds = useMemo(() => loggedExerciseIds(workouts), [workouts])
  const [selected, setSelected] = useState('')
  const activeExercise = selected || exerciseIds[0] || ''
  const oneRM = useMemo(
    () => (activeExercise ? oneRepMaxSeries(workouts, activeExercise) : []),
    [workouts, activeExercise],
  )

  const bodyweight = useMemo(
    () => weightLog.map((e) => ({ date: e.date, weightKg: e.weightKg })),
    [weightLog],
  )

  const [wDate, setWDate] = useState(todayISO())
  const [wVal, setWVal] = useState('')
  const submitWeight = (e) => {
    e.preventDefault()
    const kg = Number(wVal)
    if (kg > 0) {
      logWeight(wDate, kg)
      setWVal('')
    }
  }

  return (
    <div className="page">
      <header className="page-head">
        <h1>Progress</h1>
        <p className="muted">Track how your training volume, strength and bodyweight change over time.</p>
      </header>

      <section className="card">
        <h2 className="card-title">Total volume per session</h2>
        <p className="muted small">Sets × reps × weight, summed across each workout.</p>
        <ChartFrame data={volume} empty="Log a workout to see your volume trend.">
          <LineChart data={volume} margin={CHART_MARGIN}>
            {commonAxes('volume', 'kg')}
            <Line type="monotone" dataKey="volume" stroke="var(--c1)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ChartFrame>
      </section>

      <section className="card">
        <div className="card-title-row">
          <h2 className="card-title">Estimated 1-rep max</h2>
          {exerciseIds.length > 0 && (
            <select value={activeExercise} onChange={(e) => setSelected(e.target.value)}>
              {exerciseIds.map((id) => (
                <option key={id} value={id}>{exerciseName(id)}</option>
              ))}
            </select>
          )}
        </div>
        <p className="muted small">Epley estimate from your best set each session.</p>
        <ChartFrame data={oneRM} empty="Log weighted sets to estimate your 1-rep max.">
          <LineChart data={oneRM} margin={CHART_MARGIN}>
            {commonAxes('oneRM', 'kg')}
            <Line type="monotone" dataKey="oneRM" stroke="var(--c2)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ChartFrame>
      </section>

      <section className="card">
        <h2 className="card-title">Bodyweight</h2>
        <form className="inline-form tight" onSubmit={submitWeight}>
          <input type="date" value={wDate} onChange={(e) => setWDate(e.target.value)} />
          <input
            type="number"
            step="0.1"
            min="0"
            placeholder="Weight (kg)"
            value={wVal}
            onChange={(e) => setWVal(e.target.value)}
          />
          <button type="submit" className="btn">Log weight</button>
        </form>
        <ChartFrame data={bodyweight} empty="Log your bodyweight to see the trend.">
          <LineChart data={bodyweight} margin={CHART_MARGIN}>
            {commonAxes('weightKg', 'kg')}
            <Line type="monotone" dataKey="weightKg" stroke="var(--c5)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ChartFrame>
      </section>
    </div>
  )
}

const CHART_MARGIN = { top: 8, right: 16, bottom: 4, left: 0 }

function commonAxes(dataKey, unit) {
  return (
    <>
      <CartesianGrid stroke="var(--grid)" vertical={false} />
      <XAxis
        dataKey="date"
        tickFormatter={shortDate}
        stroke="var(--muted)"
        tick={{ fontSize: 12, fill: 'var(--muted)' }}
        tickLine={false}
        axisLine={{ stroke: 'var(--axis)' }}
      />
      <YAxis
        stroke="var(--muted)"
        tick={{ fontSize: 12, fill: 'var(--muted)' }}
        tickLine={false}
        axisLine={false}
        width={44}
      />
      <Tooltip
        contentStyle={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          color: 'var(--text-primary)',
          fontSize: 13,
        }}
        labelFormatter={shortDate}
        formatter={(v) => [`${v} ${unit}`, null]}
      />
    </>
  )
}

function ChartFrame({ data, empty, children }) {
  if (!data || data.length === 0) {
    return <div className="empty chart-empty">{empty}</div>
  }
  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={260}>
        {children}
      </ResponsiveContainer>
    </div>
  )
}

function shortDate(iso) {
  if (!iso || typeof iso !== 'string') return iso
  const [, m, d] = iso.split('-')
  return `${d}/${m}`
}
