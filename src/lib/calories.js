// Calorie planning using the Mifflin-St Jeor equation.
//   BMR (male)   = 10*kg + 6.25*cm - 5*age + 5
//   BMR (female) = 10*kg + 6.25*cm - 5*age - 161
//   TDEE = BMR * activityFactor
// The daily target applies a deficit/surplus based on the user's goal, and the
// macro split is seeded by body type.

export const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extra: 1.9,
}

export const ACTIVITY_LABELS = {
  sedentary: 'Sedentary (little/no exercise)',
  light: 'Light (1–3 days/week)',
  moderate: 'Moderate (3–5 days/week)',
  very: 'Very active (6–7 days/week)',
  extra: 'Extra active (physical job / 2x/day)',
}

export const GOAL_ADJUSTMENTS = {
  lose: -500, // ~0.5 kg / week deficit
  maintain: 0,
  gain: 300,
}

export const GOAL_LABELS = {
  lose: 'Lose fat',
  maintain: 'Maintain',
  gain: 'Build muscle',
}

// Macro split as fractions of total calories, keyed by body type.
// Protein & carbs = 4 kcal/g, fat = 9 kcal/g.
export const BODY_TYPES = {
  ectomorph: {
    label: 'Ectomorph',
    note: 'Naturally lean and fast metabolism — tolerate more carbs to fuel training and recovery.',
    split: { protein: 0.25, carbs: 0.55, fat: 0.2 },
  },
  mesomorph: {
    label: 'Mesomorph',
    note: 'Athletic build that gains muscle readily — a balanced split works well.',
    split: { protein: 0.3, carbs: 0.4, fat: 0.3 },
  },
  endomorph: {
    label: 'Endomorph',
    note: 'Gains weight easily — favour higher protein and lower carbs to manage fat gain.',
    split: { protein: 0.35, carbs: 0.3, fat: 0.35 },
  },
}

export function calcBMR({ sex, weightKg, heightCm, age }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return sex === 'female' ? base - 161 : base + 5
}

export function calcTDEE(bmr, activityLevel) {
  return bmr * (ACTIVITY_FACTORS[activityLevel] ?? 1.2)
}

export function calcMacros(targetCalories, bodyType) {
  const split = (BODY_TYPES[bodyType] ?? BODY_TYPES.mesomorph).split
  return {
    protein: Math.round((targetCalories * split.protein) / 4),
    carbs: Math.round((targetCalories * split.carbs) / 4),
    fat: Math.round((targetCalories * split.fat) / 9),
  }
}

// Full plan derived from a profile. All intermediate numbers are returned so the
// UI can show transparent math.
export function calcCaloriePlan(profile) {
  const bmr = calcBMR(profile)
  const tdee = calcTDEE(bmr, profile.activityLevel)
  const target = tdee + (GOAL_ADJUSTMENTS[profile.goal] ?? 0)
  const macros = calcMacros(target, profile.bodyType)
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    target: Math.round(target),
    adjustment: GOAL_ADJUSTMENTS[profile.goal] ?? 0,
    macros,
    bodyTypeNote: (BODY_TYPES[profile.bodyType] ?? BODY_TYPES.mesomorph).note,
  }
}
