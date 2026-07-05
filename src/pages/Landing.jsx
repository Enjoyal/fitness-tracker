import { Link } from 'react-router-dom'
import './landing.css'

// Simple stroke icons, module-scoped so they aren't recreated on every render.
function BarbellIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M2 12h4M18 12h4M6 8v8M18 8v8M9 12h6" strokeLinecap="round" />
      <path d="M4 9v6M20 9v6" strokeLinecap="round" />
    </svg>
  )
}
function PulseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M2 12h4l2 6 4-14 2 8h8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function BodyweightIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="4.5" r="2" />
      <path d="M12 7v6M7 9l5-2 5 2M8 21l4-8 4 8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M5 19c8 0 13-5 13-13-8 0-13 5-13 13Z" strokeLinejoin="round" />
      <path d="M6 18c3-4 6-7 11-11" strokeLinecap="round" />
    </svg>
  )
}
function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M8 6h12M8 12h12M8 18h12M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" />
    </svg>
  )
}
function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3h6v1M8 11h8M8 15h5" strokeLinecap="round" />
    </svg>
  )
}
function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 20V10M11 20V4M18 20v-7" strokeLinecap="round" />
      <path d="M3 20h18" strokeLinecap="round" />
    </svg>
  )
}
function FlameIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 3c1 3-3 4-3 8a3 3 0 0 0 6 0c1 0 2 1 2 3a5 5 0 0 1-10 0c0-5 4-6 5-11Z" strokeLinejoin="round" />
    </svg>
  )
}

const CATEGORIES = [
  {
    icon: BarbellIcon,
    title: 'Strength training',
    body: 'Barbell, dumbbell or machine — log every set with the weight and reps you actually moved.',
  },
  {
    icon: PulseIcon,
    title: 'Cardio & conditioning',
    body: 'Intervals, rows, rides — track sessions alongside your lifts in the same log.',
  },
  {
    icon: BodyweightIcon,
    title: 'Calisthenics',
    body: 'Bodyweight work counts too: reps are reps, and they still feed your volume totals.',
  },
  {
    icon: LeafIcon,
    title: 'Mobility & recovery',
    body: 'Log the easy days as deliberately as the heavy ones — your streak does not care why you showed up.',
  },
]

const FEATURES = [
  {
    icon: ListIcon,
    title: 'Workout log',
    body: 'Record exercises, sets, reps and weight per session, organized by date — nothing to configure first.',
  },
  {
    icon: ClipboardIcon,
    title: 'Workout plans',
    body: 'Build reusable routines with target sets and reps, then mark one active for quick logging.',
  },
  {
    icon: ChartIcon,
    title: 'Progress tracking',
    body: 'Training volume, Epley-estimated 1RM per exercise, weekly counts, and your current streak — all derived from what you logged.',
  },
  {
    icon: FlameIcon,
    title: 'Calorie plan',
    body: 'Mifflin-St Jeor BMR, activity-adjusted TDEE, a goal-based daily target, and a macro split seeded by body type.',
  },
]

const TESTIMONIALS = [
  {
    quote: 'I stopped guessing my working weights once I could see the 1RM trend instead of just one number from last week.',
    name: 'Priya R.',
    tag: 'Squat +18 kg / 6 months',
  },
  {
    quote: 'No sign-up screen, no sync spinner. I open the tab, log three sets, close the tab.',
    name: 'Marcus T.',
    tag: 'Daily lifter',
  },
  {
    quote: 'The calorie target actually moved when I switched my goal from lose to maintain — small thing, but it meant I trusted the number.',
    name: 'Sofia D.',
    tag: 'Recomposition phase',
  },
]

export default function Landing() {
  return (
    <div className="landing">
      <header className="l-nav">
        <div className="l-nav-inner">
          <a className="l-brand" href="#top">
            <span className="l-brand-mark" aria-hidden>⊙</span>
            Workout Tracker
          </a>
          <nav className="l-nav-links">
            <a href="#categories">Categories</a>
            <a href="#features">Features</a>
            <a href="#testimonials">Testimonials</a>
          </nav>
          <Link className="l-btn primary small" to="/app">Open tracker</Link>
        </div>
      </header>

      <main>
        <section className="l-hero" id="top">
          <div className="l-hero-copy">
            <p className="l-eyebrow">No account. No cloud. Just reps.</p>
            <h1 className="l-h1">Lift heavy.<br />Log honest.</h1>
            <p className="l-hero-sub">
              A straightforward workout tracker that estimates your one-rep max with the
              Epley formula, plans daily calories with Mifflin-St Jeor, and keeps every set
              stored right in your browser — no account, no server, no sync delay.
            </p>
            <div className="l-hero-cta">
              <Link to="/app" className="l-btn primary">Start logging</Link>
              <a href="#features" className="l-btn ghost">See what it tracks</a>
            </div>
            <dl className="l-readout">
              <div>
                <dt>1RM formula</dt>
                <dd>weight × (1 + reps ÷ 30)</dd>
              </div>
              <div>
                <dt>Storage</dt>
                <dd>this browser, only</dd>
              </div>
              <div>
                <dt>Streak logic</dt>
                <dd>consecutive days trained</dd>
              </div>
            </dl>
          </div>

          <div className="l-hero-art" aria-hidden="true">
            <div className="l-plates">
              <span className="l-bar" />
              <span className="l-plate l-p5" />
              <span className="l-plate l-p4" />
              <span className="l-plate l-p3" />
              <span className="l-plate l-p2" />
              <span className="l-plate l-p1"><em>45</em></span>
            </div>
          </div>
        </section>

        <section className="l-section" id="categories">
          <p className="l-eyebrow">Training categories</p>
          <h2 className="l-h2">Whatever you're training for, it fits in the log.</h2>
          <div className="l-cat-grid">
            {CATEGORIES.map(({ icon: Icon, title, body }) => (
              <div className="l-cat-card" key={title}>
                <span className="l-cat-icon"><Icon /></span>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="l-section l-section-alt" id="features">
          <p className="l-eyebrow">What you get</p>
          <h2 className="l-h2">Four tools, one dataset.</h2>
          <div className="l-feat-grid">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div className="l-feat-card" key={title}>
                <span className="l-feat-icon"><Icon /></span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="l-section" id="testimonials">
          <p className="l-eyebrow">From the floor</p>
          <h2 className="l-h2">Lifters keep a log for a reason.</h2>
          <div className="l-testi-grid">
            {TESTIMONIALS.map(({ quote, name, tag }) => (
              <figure className="l-testi-card" key={name}>
                <blockquote>&ldquo;{quote}&rdquo;</blockquote>
                <figcaption>
                  <span className="l-testi-name">{name}</span>
                  <span className="l-testi-tag">{tag}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="l-cta-band">
          <h2 className="l-h2">Your next set is waiting.</h2>
          <p>Open the tracker and log it — your data stays exactly where you left it.</p>
          <Link to="/app" className="l-btn primary large">Open the tracker</Link>
        </section>
      </main>

      <footer className="l-footer">
        <span>Workout Tracker — built for the browser you're already in.</span>
      </footer>
    </div>
  )
}
