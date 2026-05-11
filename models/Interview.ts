// models/Interview.js

import mongoose from "mongoose"

const InterviewSchema = new mongoose.Schema(
  {
    candidate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    job_title: {
      type: String,
      required: true,
      trim: true,
    },

    scheduled_at: {
      type: Date,
      required: true,
    },

    meet_link: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "pending"],
      default: "scheduled",
    },

    
    interviewer_email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    email_pending: {
      type: Boolean,
      default: true,
    },

    email_sent: {
      type: Boolean,
      default: false,
    },

    email_processing: {
      type: Boolean,
      default: false,
    },

    email_sent_at: {
      type: Date,
      default: null,
    },

    slot_index: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
)

export default mongoose.models.Interview ||
  mongoose.model("Interview", InterviewSchema)