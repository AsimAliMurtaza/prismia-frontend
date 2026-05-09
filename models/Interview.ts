import mongoose, { Schema, Types } from "mongoose"

const InterviewSchema = new Schema(
  {
    candidate_id: {
      type: Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    job_id: {
      type: Types.ObjectId,
      ref: "Job",
      required: true,
    },

    job_title: {
      type: String,
      required: true,
    },

    meet_link: {
      type: String,
      required: true,
    },

    scheduled_at: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "scheduled",
        "completed",
        "cancelled",
        "rescheduled",
        "no-show",
      ],
      default: "scheduled",
    },

    interviewer_email: {
      type: String,
      required: true,
    },

    notes: {
      type: String,
      default: "",
    },

    email_sent: {
      type: Boolean,
      default: false,
    },

    email_sent_at: {
      type: Date,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
)

/* =========================
   INDEXES
========================= */

InterviewSchema.index({ candidate_id: 1 })

InterviewSchema.index({ job_id: 1 })

InterviewSchema.index({ scheduled_at: 1 })

InterviewSchema.index({ status: 1 })

InterviewSchema.index({ interviewer_email: 1 })

InterviewSchema.index({ created_at: -1 })

export default mongoose.models.Interview ||
  mongoose.model("Interview", InterviewSchema)