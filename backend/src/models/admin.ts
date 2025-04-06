import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  campus: { type: String, required: true }, // ✅ campus is required
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
