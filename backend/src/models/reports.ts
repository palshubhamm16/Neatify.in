import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    campus: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "ongoing", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
