import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import mongoose from "mongoose"
import { ObjectId } from "mongodb"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const db = mongoose.connection.db!

    const feedback = await db.collection("interview_feedback").findOne({
      interview_id: new ObjectId(params.id)
    })

    if (!feedback) {
      return NextResponse.json(null, { status: 404 })
    }

    return NextResponse.json({
      id: feedback._id.toString(),
      interview_id: feedback.interview_id?.toString(),
      candidate_id: feedback.candidate_id?.toString(),
      technical_score: feedback.technical_score,
      communication_score: feedback.communication_score,
      cultural_fit_score: feedback.cultural_fit_score,
      strengths: feedback.strengths,
      weaknesses: feedback.weaknesses,
      decision: feedback.decision,
      reasoning: feedback.reasoning,
      submitted_at: feedback.submitted_at?.toISOString() || "",
    })
  } catch (error) {
    console.error("GET /interviews/[id]/feedback error:", error)
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()

    // Forward to FastAPI backend for business logic
    const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000"
    const res = await fetch(`${BACKEND_URL}/interviews/${params.id}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("POST /interviews/[id]/feedback error:", error)
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 })
  }
}