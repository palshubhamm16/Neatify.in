// src/routes/reports.ts
import express from "express";
import multer from "multer";
import { authenticateUser } from "../middlewares/authMiddleware";
import {
  submitReport,
  getReportsByCampus,
  updateReportStatus,
} from "../controllers/reportcontroller";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", authenticateUser, upload.single("image"), submitReport);
router.get("/:campus", authenticateUser, getReportsByCampus);
router.patch("/:id", authenticateUser, updateReportStatus);

export default router;
