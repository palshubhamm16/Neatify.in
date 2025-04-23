// models/reports.ts
import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    campus: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String },

    category: {
      type: String,
      enum: ["campus", "room", "helpdesk", "garbage"],
      default: "garbage",
      required: false,
    },

    status: {
      type: String,
      enum: ["pending", "ongoing", "completed"],
      default: "pending",
    },

    // ⛳ Simple coordinates field instead of geoJSON
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false,
    },

    // 🏢 For campus reports
    area: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
