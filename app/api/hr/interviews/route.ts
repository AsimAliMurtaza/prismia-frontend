import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import mongoose from "mongoose"

export async function GET() {
  try {
    await dbConnect()
    const db = mongoose.connection.db!

    const interviews = await db.collection("interviews").find({}).toArray()
    const candidates = await db.collection("candidates").find({}).toArray()
    const jobs = await db.collection("jobs").find({}).toArray()

    const candidateMap = Object.fromEntries(
      candidates.map(c => [c._id.toString(), c])
    )
    const jobMap = Object.fromEntries(
      jobs.map(j => [j._id.toString(), j])
    )

    const result = interviews.map(interview => {
      const candidate = candidateMap[interview.candidate_id?.toString()]
      const job = jobMap[interview.job_id?.toString()]

      return {
        id: interview._id.toString(),
        candidate_name: candidate
          ? `${candidate.first_name} ${candidate.last_name}`.trim()
          : "Unknown",
        candidate_email: candidate?.email || "",
        job_title: job?.title || "",
        meet_link: interview.meet_link || "",
        scheduled_at: interview.scheduled_at?.toISOString() || "",
        status: interview.status || "scheduled",
        interviewer_email: interview.interviewer_email || "",
        notes: interview.notes || "",
      }
    })

    return NextResponse.json({ interviews: result, count: result.length })
  } catch (error) {
    console.error("GET /interviews error:", error)
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 })
  }
}