import express from "express";
import Event from "../models/Event.js";

const router = express.Router();

// Get all events (with optional query filtering)
router.get("/", async (req, res) => {
  try {
    const { status, category } = req.query;

    // Build a filter object dynamically
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const events = await Event.find(filter);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Event.distinct("category");
    res.json({ categories }); // returns { categories: ["sport", "music", "kids"] }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get one event
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



export default router;
