export interface Interview {
  id: string
  candidate_id: string
  candidate_name: string
  candidate_email: string
  job_title: string
  meet_link: string
  scheduled_at: string
  status: string
  interviewer_email: string
  email_sent: boolean
}

export interface Feedback {
  id: string
  technical_score: number
  communication_score: number
  cultural_fit_score: number
  strengths: string
  weaknesses: string
  decision: string
  reasoning: string
  submitted_at: string
}

export async function fetchInterviews(): Promise<Interview[]> {
  const res = await fetch("/api/hr/interviews", { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch interviews")
  const data = await res.json()
  return data.interviews
}

export async function fetchInterviewFeedback(interviewId: string): Promise<Feedback | null> {
  const res = await fetch(`/api/hr/interviews/${interviewId}/feedback`, {
    cache: "no-store"
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error("Failed to fetch feedback")
  return res.json()
}

export async function suggestDecision(
  interviewId: string,
  technicalScore: number,
  communicationScore: number,
  culturalFitScore: number,
  strengths: string,
  weaknesses: string
) {
  const res = await fetch(`/api/hr/interviews/${interviewId}/suggest-decision`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      technical_score: technicalScore,
      communication_score: communicationScore,
      cultural_fit_score: culturalFitScore,
      strengths,
      weaknesses,
    }),
  })
  if (!res.ok) throw new Error("Failed to get suggestion")
  return res.json()
}

export async function submitFeedback(
  interviewId: string,
  technicalScore: number,
  communicationScore: number,
  culturalFitScore: number,
  strengths: string,
  weaknesses: string,
  decision: string,
  reasoning: string
) {
  const res = await fetch(`/api/hr/interviews/${interviewId}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      technical_score: technicalScore,
      communication_score: communicationScore,
      cultural_fit_score: culturalFitScore,
      strengths,
      weaknesses,
      decision,
      reasoning,
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || "Failed to submit feedback")
  }
  return res.json()
}