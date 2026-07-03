import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { KEYS, newId, read, write } from '../lib/storage.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [profile, setProfile] = useState(() => read(KEYS.profile))
  const [plans, setPlans] = useState(() => read(KEYS.plans))
  const [workouts, setWorkouts] = useState(() => read(KEYS.workouts))
  const [weightLog, setWeightLog] = useState(() => read(KEYS.weightLog))

  // Persist each slice whenever it changes.
  useEffect(() => write(KEYS.profile, profile), [profile])
  useEffect(() => write(KEYS.plans, plans), [plans])
  useEffect(() => write(KEYS.workouts, workouts), [workouts])
  useEffect(() => write(KEYS.weightLog, weightLog), [weightLog])

  // --- Profile ---
  const updateProfile = useCallback((patch) => {
    setProfile((prev) => ({ ...prev, ...patch }))
  }, [])

  // --- Plans ---
  const addPlan = useCallback((plan) => {
    const withId = { id: newId(), active: false, exercises: [], ...plan }
    setPlans((prev) => [...prev, withId])
    return withId.id
  }, [])

  const updatePlan = useCallback((id, patch) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }, [])

  const deletePlan = useCallback((id) => {
    setPlans((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const setActivePlan = useCallback((id) => {
    setPlans((prev) => prev.map((p) => ({ ...p, active: p.id === id })))
  }, [])

  // --- Workouts ---
  const addWorkout = useCallback((workout) => {
    const withId = { id: newId(), ...workout }
    setWorkouts((prev) => [...prev, withId])
    return withId.id
  }, [])

  const deleteWorkout = useCallback((id) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id))
  }, [])

  // --- Bodyweight log ---
  const logWeight = useCallback((date, weightKg) => {
    setWeightLog((prev) => {
      const rest = prev.filter((e) => e.date !== date)
      return [...rest, { date, weightKg }].sort((a, b) => a.date.localeCompare(b.date))
    })
    // Keep the profile's current weight in sync with the newest entry.
    setProfile((prev) => ({ ...prev, weightKg }))
  }, [])

  const activePlan = useMemo(() => plans.find((p) => p.active) ?? null, [plans])

  const value = useMemo(
    () => ({
      profile,
      plans,
      workouts,
      weightLog,
      activePlan,
      updateProfile,
      addPlan,
      updatePlan,
      deletePlan,
      setActivePlan,
      addWorkout,
      deleteWorkout,
      logWeight,
    }),
    [
      profile,
      plans,
      workouts,
      weightLog,
      activePlan,
      updateProfile,
      addPlan,
      updatePlan,
      deletePlan,
      setActivePlan,
      addWorkout,
      deleteWorkout,
      logWeight,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
