import express from "express";
import cloudinary from "../utils/cloudinary";
import multer from "multer";
import { Readable } from "stream";

const router = express.Router();

// Setup multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/image", upload.single("image"), (req, res) => {
  (async () => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);

      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "neatify" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary error:", error);
            return res.status(500).json({ message: "Upload failed" });
          }
          res.status(200).json({ imageUrl: result?.secure_url });
        }
      );

      bufferStream.pipe(uploadStream);
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ message: "Something went wrong" });
    }
  })();
});

export default router;

