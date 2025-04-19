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

    const admins = [
      {
        email: "offical.saurabh.singh24@gmail.com",
        type: "campus",
        location: "Bennett University",
      },
      {
        email: "ctfasce@gmail.com",
        type: "campus",
        location: "Sharda University",
      },
      {
        email: "palshubhamm1616@gmail.com",
        type: "municipality",
        location: "TechZone II",
      },
    ];

    for (const admin of admins) {
      const existing = await Admin.findOne({ email: admin.email, location: admin.location });
      if (existing) {
        console.warn(`⚠️ Admin already exists: ${admin.email} at ${admin.location}`);
      } else {
        await Admin.create(admin);
        console.log(`✅ Inserted admin: ${admin.email} at ${admin.location}`);
      }
    }
  } catch (err) {
    console.error("❌ Failed to insert admins:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

run();
