import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only admins should see this route - dashboard page to be made
router.get("/dashboard", protect, authorize("admin"), (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.name}!` });
});

export default router;