import { lazy, Suspense } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import SupportWidget from './components/SupportWidget.jsx'

const Landing = lazy(() => import('./pages/Landing.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const WorkoutLog = lazy(() => import('./pages/WorkoutLog.jsx'))
const WorkoutPlans = lazy(() => import('./pages/WorkoutPlans.jsx'))
const Progress = lazy(() => import('./pages/Progress.jsx'))
const CaloriePlan = lazy(() => import('./pages/CaloriePlan.jsx'))

const NAV = [
  { to: '/app', label: 'Dashboard', end: true, icon: '📊' },
  { to: '/app/log', label: 'Log Workout', icon: '🏋️' },
  { to: '/app/plans', label: 'Plans', icon: '📋' },
  { to: '/app/progress', label: 'Progress', icon: '📈' },
  { to: '/app/calories', label: 'Calorie Plan', icon: '🔥' },
]

function AppShell() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">💪</span>
          <span className="brand-name">Workout Tracker</span>
        </div>
        <nav className="nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              <span className="nav-icon" aria-hidden>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="content">
        <Suspense fallback={null}>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="log" element={<WorkoutLog />} />
            <Route path="plans" element={<WorkoutPlans />} />
            <Route path="progress" element={<Progress />} />
            <Route path="calories" element={<CaloriePlan />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app/*" element={<AppShell />} />
        </Routes>
      </Suspense>
      <SupportWidget />
    </>
  )
}
