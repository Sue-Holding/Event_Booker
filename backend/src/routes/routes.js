import express from "express";

const router = express.Router();

// Test route
router.get("/", (req, res) => {
  res.send("Event Booking API is running!");
});

export default router;
