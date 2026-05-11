const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export async function chatWithAgent(
  endpoint: string,
  sessionId: string,
  message: string
): Promise<string> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, message }),
  })

  if (!response.ok) throw new Error(`API error: ${response.status}`)

  const data = await response.json()
  return data.response
}