// Built-in exercise catalog. Each exercise has a stable id used to reference it
// from plans and logged workouts. Users log against these.
export const EXERCISES = [
  { id: 'bench-press', name: 'Bench Press', muscle: 'Chest' },
  { id: 'incline-db-press', name: 'Incline Dumbbell Press', muscle: 'Chest' },
  { id: 'push-up', name: 'Push-Up', muscle: 'Chest' },
  { id: 'squat', name: 'Back Squat', muscle: 'Legs' },
  { id: 'front-squat', name: 'Front Squat', muscle: 'Legs' },
  { id: 'leg-press', name: 'Leg Press', muscle: 'Legs' },
  { id: 'lunge', name: 'Walking Lunge', muscle: 'Legs' },
  { id: 'deadlift', name: 'Deadlift', muscle: 'Back' },
  { id: 'barbell-row', name: 'Barbell Row', muscle: 'Back' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', muscle: 'Back' },
  { id: 'pull-up', name: 'Pull-Up', muscle: 'Back' },
  { id: 'overhead-press', name: 'Overhead Press', muscle: 'Shoulders' },
  { id: 'lateral-raise', name: 'Lateral Raise', muscle: 'Shoulders' },
  { id: 'bicep-curl', name: 'Bicep Curl', muscle: 'Arms' },
  { id: 'tricep-pushdown', name: 'Tricep Pushdown', muscle: 'Arms' },
  { id: 'plank', name: 'Plank', muscle: 'Core' },
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', muscle: 'Core' },
]

const BY_ID = Object.fromEntries(EXERCISES.map((e) => [e.id, e]))

export function getExercise(id) {
  return BY_ID[id]
}

export function exerciseName(id) {
  return BY_ID[id]?.name ?? id
}
