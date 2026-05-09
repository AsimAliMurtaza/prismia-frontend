import mongoose, { Schema } from "mongoose"

const JobSchema = new Schema(
  {
    jd_id: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    source_file: {
      type: String,
    },

    required_skills: [
      {
        type: String,
      },
    ],

    min_experience_years: {
      type: Number,
      default: 0,
    },

    education_requirement: {
      type: String,
    },

    jd_embedding: [
      {
        type: Number,
      },
    ],

    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
)

export default mongoose.models.Job ||
  mongoose.model("Job", JobSchema)