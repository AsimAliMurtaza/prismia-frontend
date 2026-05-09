import mongoose, { Schema, Types } from "mongoose"

const ScreeningSchema = new Schema(
  {
    job_id: {
      type: Types.ObjectId,
      ref: "Job",
      required: true,
    },

    candidate_id: {
      type: Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    resume_id: {
      type: Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    education_score: {
      type: Number,
      default: 0,
    },

    experience_score: {
      type: Number,
      default: 0,
    },

    skill_score: {
      type: Number,
      default: 0,
    },

    semantic_similarity_score: {
      type: Number,
      default: 0,
    },

    final_score: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "shortlisted",
        "interview",
        "accepted",
        "rejected",
      ],
      default: "pending",
    },

    evaluation_breakdown: {
      type: Schema.Types.Mixed,
    },

    llm_feedback: {
      type: String,
    },

    jd_embedding: [
      {
        type: Number,
      },
    ],

    resume_embedding: [
      {
        type: Number,
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
)

export default mongoose.models.Screening ||
  mongoose.model("Screening", ScreeningSchema)