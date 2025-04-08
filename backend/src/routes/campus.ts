// routes/campus.ts
import express from "express";
import Admin from "../models/admin";

const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    const campuses = await Admin.find({ type: "campus" }).distinct("location");
    res.json(campuses.map(name => ({ name })));
  } catch (error) {
    console.error("Error fetching campus list", error);
    res.status(500).json({ message: "Error fetching campuses" });
  }
});

export default router;
