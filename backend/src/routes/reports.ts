import express from "express";
import Report from "../models/reports";

const router = express.Router();

// Submit a Report
router.post("/", async (req, res) => {
  try {
    const { userId, imageUrl, location, description } = req.body;
    const report = await Report.create({ userId, imageUrl, location, description });

    res.status(201).json({ message: "Report submitted", report });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get All Reports for Admin
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find().populate("userId", "name email");
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
