import express from "express";
import User from "../models/User.js";
// import authenticate from "../middleware/authenticate.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get current user profile (including favourites)
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add event to favourites
router.post("/favorites/:eventId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const eventId = req.params.eventId;

    if (user.favorites.includes(eventId)) {
      return res.status(400).json({ message: "Event already in favourites" });
    }

    user.favorites.push(eventId);
    await user.save();

    res.json({ message: "Added to favourites", favorites: user.favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove event from favourites
router.delete("/favorites/:eventId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const eventId = req.params.eventId;
    user.favorites = user.favorites.filter(fav => fav.toString() !== eventId);

    await user.save();

    res.json({ message: "Removed from favourites", favorites: user.favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// test user routes
router.get("/test", (req, res) => {
  res.json({ message: "User routes working" });
});

export default router;
