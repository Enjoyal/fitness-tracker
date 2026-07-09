#!/usr/bin/env node
// One-time (re-runnable) setup script: creates or updates the ElevenLabs
// Conversational AI support agent for Fitness Tracker.
//
// Usage:
//   ELEVENLABS_API_KEY=xxx node scripts/setup-elevenlabs-agent.mjs
//   ELEVENLABS_API_KEY=xxx node scripts/setup-elevenlabs-agent.mjs --update
//
// The key is only ever read from the environment, never written anywhere.
// The resulting public agent_id is printed and cached locally so re-runs
// with --update patch the existing agent instead of creating a duplicate.

import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const AGENT_ID_FILE = path.join(__dirname, '..', '.elevenlabs-agent-id')

// Editable defaults — tweak before running, or change later in the
// ElevenLabs dashboard without rerunning this script.
const AGENT_NAME = 'Fitness Tracker Support Agent'
const LLM_MODEL = 'gemini-2.0-flash'
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM' // ElevenLabs default preset voice ("Rachel")
const FIRST_MESSAGE =
  "Hi! I'm here to help with Fitness Tracker — workout logging, plans, progress, or calorie planning. What can I help with?"

const SYSTEM_PROMPT = `You are the customer support assistant for Fitness Tracker, a free, browser-based
workout and calorie planning app. All user data (workouts, plans, progress, calorie
settings) is stored locally in the user's browser — there is no account system, no
cloud sync, and no backend server.

What the app does:
- Workout Logging: users log exercises with sets/reps/weight; the app estimates
  one-rep max (Epley formula) and tracks training volume over time.
- Workout Plans: users create and follow structured workout plans.
- Progress: charts of training volume, estimated 1RMs, weekly workout counts, and
  current streak.
- Calorie Plan: calculates BMR via the Mifflin-St Jeor equation, applies an activity
  factor for TDEE, then a goal-based deficit/surplus and a macro split based on body
  type — all computed locally from the user's profile inputs.

Your role:
- Answer questions about how to use these features, troubleshoot common issues
  (e.g., "my data disappeared" -> explain data is stored in browser localStorage
  and is lost if cache/site data is cleared, or if using a different browser/device),
  and explain how calculations work at a high level.
- Keep responses concise, friendly, and practical.
- Reference the knowledge base for detailed or app-specific answers once documents
  are available. If you don't have specific information and the knowledge base
  doesn't cover it, say so honestly rather than guessing, and suggest the user
  contact support.

Strict guardrails:
- Do NOT give medical, nutritional, or injury advice, diagnoses, or personalized
  training/dietary recommendations beyond explaining what the app's built-in
  calculators do. Redirect medical questions to a qualified professional.
- Do NOT make claims about data security, cloud backup, or account recovery — this
  app has no backend and no accounts; be accurate about that.
- Do NOT invent features that don't exist in the app.
- Stay within the scope of Fitness Tracker support. Politely decline unrelated requests.`

const API_KEY = process.env.ELEVENLABS_API_KEY
if (!API_KEY) {
  console.error('Error: ELEVENLABS_API_KEY environment variable is not set.')
  console.error('Usage: ELEVENLABS_API_KEY=xxx node scripts/setup-elevenlabs-agent.mjs')
  process.exit(1)
}

const shouldUpdate = process.argv.includes('--update')

const conversationConfig = {
  agent: {
    prompt: {
      prompt: SYSTEM_PROMPT,
      llm: LLM_MODEL,
    },
    first_message: FIRST_MESSAGE,
    language: 'en',
  },
  tts: {
    voice_id: VOICE_ID,
  },
}

// Disable auth so the embeddable widget can connect with just a public
// agent_id (this app has no backend to broker a signed URL). This means
// anyone with the agent_id can start a conversation and incur usage cost —
// set a domain allowlist below once you know your production origin.
const platformSettings = {
  auth: {
    enable_auth: false,
  },
  widget: {
    // TODO: once deployed, restrict to your real origin(s), e.g.:
    // allowlist: [{ hostname: 'localhost' }, { hostname: 'your-domain.com' }]
  },
}

async function readCachedAgentId() {
  try {
    const raw = await readFile(AGENT_ID_FILE, 'utf8')
    return raw.trim() || null
  } catch {
    return null
  }
}

async function createAgent() {
  const res = await fetch('https://api.elevenlabs.io/v1/convai/agents/create', {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: AGENT_NAME,
      conversation_config: conversationConfig,
      platform_settings: platformSettings,
    }),
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    console.error(`Agent creation failed: HTTP ${res.status}`)
    console.error(JSON.stringify(body, null, 2))
    process.exit(1)
  }
  return body.agent_id
}

async function updateAgent(agentId) {
  const res = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}`, {
    method: 'PATCH',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: AGENT_NAME,
      conversation_config: conversationConfig,
      platform_settings: platformSettings,
    }),
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    console.error(`Agent update failed: HTTP ${res.status}`)
    console.error(JSON.stringify(body, null, 2))
    process.exit(1)
  }
  return body.agent_id ?? agentId
}

async function main() {
  const cachedId = await readCachedAgentId()
  let agentId

  if (shouldUpdate) {
    if (!cachedId) {
      console.error('No cached agent_id found in .elevenlabs-agent-id — cannot --update. Run without --update first.')
      process.exit(1)
    }
    console.log(`Updating existing agent ${cachedId}...`)
    agentId = await updateAgent(cachedId)
  } else {
    if (cachedId) {
      console.warn(`Warning: an agent_id is already cached (${cachedId}). This will create a NEW agent.`)
      console.warn('Re-run with --update if you meant to update the existing agent instead.')
    }
    console.log('Creating agent...')
    agentId = await createAgent()
  }

  await writeFile(AGENT_ID_FILE, agentId + '\n', 'utf8')

  console.log('')
  console.log(`Agent ready: ${agentId}`)
  console.log('')
  console.log('Next steps:')
  console.log('  1. Add this to your .env file:')
  console.log(`     VITE_ELEVENLABS_AGENT_ID=${agentId}`)
  console.log('  2. Attach your knowledge base documents to this agent in the ElevenLabs dashboard.')
  console.log('  3. Once deployed, set platform_settings.widget.allowlist to your production domain')
  console.log('     and re-run this script with --update to restrict public access.')
}

main()
