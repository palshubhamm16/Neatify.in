// src/routes/reports.ts
import express from "express";
import multer from "multer";
import { authenticateUser } from "../middlewares/authMiddleware";
import {
  submitReport,
  getReportsByAdmin,
  updateReportStatus,
  patchUpdateReportStatus,
  getUserReportsHistory
} from "../controllers/reportcontroller";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", authenticateUser, upload.single("image"), submitReport);
router.post("/fetch", authenticateUser, getReportsByAdmin); // 👈 this line must be here
router.patch("/:id/status", patchUpdateReportStatus);
router.get("/user/reports",authenticateUser, getUserReportsHistory);
router.patch("/:id", authenticateUser, updateReportStatus);

export default router;
