import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  location: { type: String, required: true }, // campus or municipality name
  type: { type: String, enum: ["campus", "municipality"], required: true },
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
