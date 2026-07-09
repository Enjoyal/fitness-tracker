#!/usr/bin/env node
// Read-only diagnostic: fetches the current agent config from ElevenLabs and
// prints the fields that determine whether the knowledge base is actually
// wired up (knowledge_base list + RAG settings), so we can see what's
// actually configured vs. what we intended.
//
// Usage:
//   ELEVENLABS_API_KEY=xxx node scripts/check-elevenlabs-agent.mjs [agentId]
//
// If agentId is omitted, reads it from .env (VITE_ELEVENLABS_AGENT_ID) or
// the cached .elevenlabs-agent-id file.

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

const API_KEY = process.env.ELEVENLABS_API_KEY
if (!API_KEY) {
  console.error('Error: ELEVENLABS_API_KEY environment variable is not set.')
  process.exit(1)
}

async function resolveAgentId() {
  const fromArg = process.argv[2]
  if (fromArg) return fromArg

  try {
    const env = await readFile(path.join(ROOT, '.env'), 'utf8')
    const match = env.match(/^VITE_ELEVENLABS_AGENT_ID=(.+)$/m)
    if (match) return match[1].trim()
  } catch {}

  try {
    const cached = await readFile(path.join(ROOT, '.elevenlabs-agent-id'), 'utf8')
    if (cached.trim()) return cached.trim()
  } catch {}

  console.error('No agent id found. Pass it as an argument, or set it in .env / .elevenlabs-agent-id.')
  process.exit(1)
}

async function main() {
  const agentId = await resolveAgentId()
  console.log(`Fetching config for agent: ${agentId}\n`)

  const res = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}`, {
    headers: { 'xi-api-key': API_KEY },
  })
  const body = await res.json().catch(() => ({}))

  if (!res.ok) {
    console.error(`Fetch failed: HTTP ${res.status}`)
    console.error(JSON.stringify(body, null, 2))
    process.exit(1)
  }

  const prompt = body?.conversation_config?.agent?.prompt ?? {}
  console.log('name:', body.name)
  console.log('knowledge_base:', JSON.stringify(prompt.knowledge_base ?? 'MISSING/empty', null, 2))
  console.log('rag:', JSON.stringify(prompt.rag ?? 'MISSING (RAG likely not configured)', null, 2))
  console.log('platform_settings.auth:', JSON.stringify(body?.platform_settings?.auth ?? null, null, 2))
  console.log('\nFull agent JSON (for reference):')
  console.log(JSON.stringify(body, null, 2))
}

main()
