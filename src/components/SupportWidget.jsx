export default function SupportWidget() {
  const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID
  if (!agentId) return null
  return <elevenlabs-convai agent-id={agentId} />
}
