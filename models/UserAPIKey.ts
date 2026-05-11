import mongoose from "mongoose"

const UserAPIKeySchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },

    provider: {
      type: String,
      required: true,
    },

    encrypted_api_key: {
      type: String,
      required: true,
    },

    api_key_preview: {
      type: String,
      required: true,
    },

    model: {
      type: String,
      default: "llama-3.3-70b-versatile",
    },

    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

UserAPIKeySchema.index(
  {
    email: 1,
    provider: 1,
  },
  {
    unique: true,
  }
)

export default
  mongoose.models.UserAPIKey ||
  mongoose.model(
    "UserAPIKey",
    UserAPIKeySchema
  )
