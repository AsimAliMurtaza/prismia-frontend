import mongoose, { Schema, Types } from "mongoose"

const ResumeSchema = new Schema(
  {
    candidate_id: {
      type: Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    raw_text: {
      type: String,
    },

    file_name: {
      type: String,
      required: true,
    },

    file_source: {
      type: String,
      enum: ["upload", "email", "linkedin"],
      default: "upload",
    },

    parsed_data: {
      skills: [
        {
          type: String,
        },
      ],

      total_experience_years: {
        type: Number,
        default: 0,
      },

      education: {
        type: String,
      },
    },

    resume_embedding: [
      {
        type: Number,
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: false,
    },
  }
)

export default mongoose.models.Resume ||
  mongoose.model("Resume", ResumeSchema)