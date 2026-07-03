import { NavLink, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import WorkoutLog from './pages/WorkoutLog.jsx'
import WorkoutPlans from './pages/WorkoutPlans.jsx'
import Progress from './pages/Progress.jsx'
import CaloriePlan from './pages/CaloriePlan.jsx'

const NAV = [
  { to: '/', label: 'Dashboard', end: true, icon: '📊' },
  { to: '/log', label: 'Log Workout', icon: '🏋️' },
  { to: '/plans', label: 'Plans', icon: '📋' },
  { to: '/progress', label: 'Progress', icon: '📈' },
  { to: '/calories', label: 'Calorie Plan', icon: '🔥' },
]

export default function App() {
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
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/log" element={<WorkoutLog />} />
          <Route path="/plans" element={<WorkoutPlans />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/calories" element={<CaloriePlan />} />
        </Routes>
      </main>
    </div>
  )
}
