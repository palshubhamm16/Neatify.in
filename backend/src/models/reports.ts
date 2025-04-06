import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" },
  campus: { type: String, required: true }, // Link reports to a specific campus
}, { timestamps: true });

export const Report = mongoose.model("Report", ReportSchema);
export default Report;