import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";

const app = express();

// ✅ Debug logs to confirm Clerk env vars are loaded
console.log("CLERK_PUBLISHABLE_KEY:", process.env.CLERK_PUBLISHABLE_KEY);
console.log("CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY);

// 🔐 Check for required Clerk environment variables
if (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
  console.error("❌ Missing Clerk environment variables. Please check your .env file.");
  process.exit(1);
}

// 🔧 Middleware
app.use(cors());
app.use(express.json());

// 🔌 Routes
app.use("/api/auth", authRoutes);

// 🌱 MongoDB connection
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ MONGODB_URI is not defined in .env");
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// 🚀 Server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
