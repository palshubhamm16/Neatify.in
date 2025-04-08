import express from "express";
import Admin from "../models/admin"; // adjust path if needed

const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    const campuses = await Admin.distinct("campus"); // Get unique campus values from admins
    res.json(campuses.map(name => ({ name }))); // Shape it like [{ name: "Campus A" }]
  } catch (error) {
    console.error("Error fetching campus list", error);
    res.status(500).json({ message: "Error fetching campuses" });
  }
});

export default router;
