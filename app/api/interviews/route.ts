import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Interview from "@/models/Interview"
import Candidate from "@/models/Candidate"

export async function GET() {
  try {
    await dbConnect()

    const interviews = await Interview.find({})
      .sort({ scheduled_at: 1 })
      .lean()

    const formattedInterviews = await Promise.all(
      interviews.map(async (interview) => {
        let candidateName = "Unknown Candidate"
        let candidateEmail = ""

        if (interview.candidate_id) {
          const candidate = await Candidate.findById(interview.candidate_id).lean()
          if (candidate) {
            // your model uses full_name not first_name + last_name
            candidateName = candidate.full_name || "Unknown Candidate"
            candidateEmail = candidate.email || ""
          }
        }

        return {
          id: interview._id.toString(),
          candidate_id: interview.candidate_id?.toString(),
          candidate_name: candidateName,
          candidate_email: candidateEmail,
          job_title: interview.job_title || "",
          scheduled_at: interview.scheduled_at,
          meet_link: interview.meet_link || "",
          status: interview.status || "scheduled",
          interviewer_email: interview.interviewer_email || "",
          slot_index: interview.slot_index || 0,
          email_sent: interview.email_sent || false,
          email_pending: interview.email_pending || false,
        }
      })
    )

    return NextResponse.json({
      interviews: formattedInterviews,
      count: formattedInterviews.length
    })

  } catch (error) {
    console.error("Fetch interviews error:", error)
    return NextResponse.json(
      { error: "Failed to fetch interviews" },
      { status: 500 }
    )
  }
}