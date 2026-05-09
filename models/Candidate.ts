import mongoose, { Schema } from "mongoose"

const CandidateSchema = new Schema(
  {
    full_name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
    },

    source: {
      type: String,
      enum: ["upload", "linkedin", "referral", "career_page"],
      default: "upload",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
)

export default mongoose.models.Candidate ||
  mongoose.model("Candidate", CandidateSchema)