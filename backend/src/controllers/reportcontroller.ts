// src/controllers/reportcontroller.ts
import { AuthRequest } from "../types";
import { Response } from "express";
import Report from "../models/reports";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import Admin from "../models/admin";


// --- SUBMIT REPORT ---
// --- SUBMIT REPORT ---
export const submitReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { description, campus, status, category, area } = req.body;
    const file = req.file;

    if (!req.user) {
      res.status(401).json({ error: "User not authenticated." });
      return;
    }

    const userId = req.user.sub;

    if (!file || !description || !campus) {
      res.status(400).json({ error: "Missing required fields." });
      return;
    }

    // Parse coordinates from body
    const latitude = parseFloat(req.body.latitude);
    const longitude = parseFloat(req.body.longitude);
    const coords =
      !isNaN(latitude) && !isNaN(longitude) ? [longitude, latitude] : undefined;

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "reports" },
      async (error, result) => {
        if (error || !result) {
          console.error("Cloudinary upload error:", error);
          res.status(500).json({ error: "Image upload failed." });
          return;
        }

        const newReport = new Report({
          userId,
          imageUrl: result.secure_url,
          description,
          campus,
          status: status || "pending",
          ...(category && { category }),
          ...(coords && { coordinates: coords }),
          ...(area && { area }),
        });

        await newReport.save();
        res.status(201).json({ message: "Report submitted successfully." });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  } catch (err) {
    console.error("Error submitting report:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};



// --- GET REPORTS BY LOCATION (AND CATEGORY) FOR LOGGED IN ADMIN ---
export const getReportsByAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated." });
      return;
    }

    const { location, category, coordinates, area } = req.body;

    if (!location) {
      res.status(400).json({ error: "Location is required." });
      return;
    }

    const filter: Record<string, any> = {
      campus: location,
    };

    if (category) {
      filter.category = category;
    }

    if (area) {
      filter.area = area;
    }

    if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
      filter.coordinates = coordinates;
    }

    const reports = await Report.find(filter).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (err) {
    console.error("❌ Error fetching reports:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};


// --- UPDATE REPORT STATUS ---
export const updateReportStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Report.findByIdAndUpdate(id, { status }, { new: true });

    if (!updated) {
      res.status(404).json({ error: "Report not found." });
      return;
    }

    res.status(200).json({ message: "Status updated.", report: updated });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// --- UPDATE REPORT STATUS (PATCH) ---
// This will be triggered by the three-dot button
export const patchUpdateReportStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;  // Report ID from the URL params
    const { status } = req.body;  // New status ("ongoing", "completed", etc.)

    // Validate status input
    const validStatuses = ["pending", "ongoing", "completed"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: "Invalid status provided." });
      return;
    }

    // Find and update the report's status
    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { status },
      { new: true }  // Return the updated report
    );

    if (!updatedReport) {
      res.status(404).json({ error: "Report not found." });
      return;
    }

    // Respond with the updated report
    res.status(200).json({ message: "Status updated successfully.", report: updatedReport });
  } catch (err) {
    console.error("Error updating report status:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};



// --- GET USER REPORT HISTORY BASED ON USER ID ---
export const getUserReportsHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated." });
      return;
    }

    const userId = req.user.sub; // Extract user ID from the request's user object

    // Build the filter object to fetch reports for the current user
    const filter: Record<string, any> = { userId };

    // If a status is provided in the query parameters, filter by that as well
    const { status } = req.query;
    if (status) {
      filter.status = status; // Filter reports by status (optional)
    }

    // Fetch the reports based on the filter, sorted by creation date (most recent first)
    const reports = await Report.find(filter).sort({ createdAt: -1 });

    if (reports.length === 0) {
      res.status(404).json({ message: "No reports found for this user." });
      return;
    }

    res.status(200).json(reports);
  } catch (err) {
    console.error("❌ Error fetching user reports:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
