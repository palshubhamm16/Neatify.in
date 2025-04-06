import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/admin"; // adjust path if needed

dotenv.config();

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("❌ MONGODB_URI not found in .env file");
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    const email = "shubmusic16@gmail.com";
    const campus = "IIT Delhi"; // ✅ ADD YOUR CAMPUS HERE

    const existingAdmin = await Admin.findOne({ email, campus });
    if (existingAdmin) {
      console.warn(`⚠️ Admin already exists: ${email} at ${campus}`);
    } else {
      await Admin.create({ email, campus });
      console.log(`✅ Inserted admin: ${email} at ${campus}`);
    }
  } catch (err) {
    console.error("❌ Failed to insert admin:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

run();
