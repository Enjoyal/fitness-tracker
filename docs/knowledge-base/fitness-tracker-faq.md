# Fitness Tracker — Support FAQ

This document is a knowledge base source for the Fitness Tracker customer
support agent. It answers common questions accurately based on how the app
actually works.

## General

### Q: What is Fitness Tracker?
A: Fitness Tracker is a free, browser-based workout and calorie planning app.
It lets you log workouts, follow structured workout plans, track your
progress over time, and calculate a personalized daily calorie and macro
target. There's no account system, no cloud sync, and no backend server —
everything runs entirely in your browser.

### Q: Do I need to create an account or sign in?
A: No. There are no accounts and no sign-in. You just open the app and start
using it — your data is tied to your browser, not to an account.

### Q: Is there a mobile app or a way to use it across multiple devices?
A: No. Fitness Tracker is a browser-only web app with no cross-device sync.
If you use it in one browser on your laptop and another browser or device,
they won't share data.

## Data & Privacy

### Q: Where is my data stored? Is it safe?
A: All your data (profile, workouts, workout plans, and weight log) is stored
locally in your browser's `localStorage` — nothing is sent to a server. This
means it's private to your device and browser, but it also means there's no
backup or account recovery.

### Q: Will I lose my data if I clear my browser cache or site data?
A: Yes. Since everything is stored in `localStorage`, clearing your browser's
cache/site data, using a different browser, or switching devices will not
show your existing data — it's effectively lost from that browser's storage.
There is currently no export/import or backup feature.

### Q: I opened the app on a different browser and my workouts are gone — is that a bug?
A: No, that's expected behavior. Data lives only in the specific browser
where it was created (localStorage is per-browser, per-device). It's not a
bug or data loss on our end — nothing was ever synced anywhere else.

## Calorie Planning

### Q: How is my daily calorie target calculated?
A: Fitness Tracker uses the Mifflin-St Jeor equation to estimate your Basal
Metabolic Rate (BMR) from your weight, height, age, and sex:
- Male: `BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5`
- Female: `BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age − 161`

Your BMR is then multiplied by an activity factor to get your Total Daily
Energy Expenditure (TDEE):
- Sedentary (little/no exercise): ×1.2
- Light (1–3 days/week): ×1.375
- Moderate (3–5 days/week): ×1.55
- Very active (6–7 days/week): ×1.725
- Extra active (physical job / training twice a day): ×1.9

Finally, a goal-based adjustment is applied to TDEE to get your daily
calorie target:
- Lose fat: −500 kcal/day (roughly a 0.5 kg/week deficit)
- Maintain: no change
- Build muscle: +300 kcal/day

### Q: How is my macro split (protein/carbs/fat) decided?
A: Your macro split is based on the body type you select in your profile:
- **Ectomorph** (naturally lean, fast metabolism): 25% protein, 55% carbs,
  20% fat — more carbs to fuel training and recovery.
- **Mesomorph** (athletic build, gains muscle readily): 30% protein, 40%
  carbs, 30% fat — a balanced split.
- **Endomorph** (gains weight easily): 35% protein, 30% carbs, 35% fat —
  higher protein and lower carbs to help manage fat gain.

Each macro's percentage of your daily calorie target is converted to grams
using standard energy values: protein and carbs are 4 kcal per gram, fat is
9 kcal per gram.

### Q: Is this calorie/macro plan medical or nutritional advice?
A: No. The calorie and macro numbers are general estimates based on a
well-known formula (Mifflin-St Jeor) and simple rules of thumb — they are not
personalized medical, nutritional, or health advice. For medical conditions,
specific dietary needs, or personalized guidance, please consult a qualified
healthcare professional or registered dietitian.

## Workouts & Progress

### Q: How do I log a workout?
A: Go to the "Log Workout" section from the sidebar. You can add exercises
and record the sets you performed, including reps and weight for each set.

### Q: How do I create or follow a workout plan?
A: Go to the "Plans" section from the sidebar to create a structured workout
plan made up of exercises you want to follow on a regular basis.

### Q: How is my estimated one-rep max (1RM) calculated?
A: Fitness Tracker uses the Epley formula to estimate your one-rep max from
any logged set: `estimated 1RM = weight × (1 + reps / 30)`. For each exercise
in a session, the app takes the best (highest) estimated 1RM across all sets
logged for that exercise.

### Q: How is my training volume tracked?
A: Training volume for a workout is the sum of (reps × weight) across every
set in every exercise you logged for that session. The "Progress" section
charts this volume over time, along with your estimated 1RM trends per
exercise.

### Q: How is my current workout streak calculated?
A: Your streak counts the number of consecutive calendar days (ending today)
on which you logged at least one workout. If you haven't logged a workout
yet today, the streak still counts up through yesterday rather than
resetting immediately.

### Q: How is my "workouts this week" count calculated?
A: This counts workouts logged within the current ISO week, which runs
Monday through Sunday — not a rolling 7-day window.

### Q: Can I go back and edit or delete a past workout or plan?
A: This document does not have specific information about editing/deleting
workflows. Please check the app directly, or contact support if you need
help with this.

## Support

### Q: Who do I contact if my question isn't answered here?
A: If this FAQ and the assistant's knowledge don't cover your question,
please reach out through [insert contact channel/email here] and we'll help
you directly.
