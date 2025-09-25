import express from "express";
import User from "../models/User.js";
import Event from "../models/Event.js";
import { protect } from "../middleware/authMiddleware.js";
import { nanoid } from "nanoid";
import nodemailer from "nodemailer";

const router = express.Router();

// Get current user profile (including favourites)
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("favorites")
      .populate("bookedEvents.event");
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

// Book an event
router.post("/bookings/:eventId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Prevent duplicate booking
    if (user.bookedEvents.some(b => b.event.toString() === event._id.toString())) {
      return res.status(400).json({ message: "Event already booked" });
    }

    // Generate a booking reference
    const bookingRef = nanoid(8).toUpperCase();

    // Add to user's booked events
    user.bookedEvents.push({ event: event._id, bookingRef });
    await user.save();

    // nodemailer test account
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // for dev 
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
      tls: {
        rejectUnauthorized: false, // ignore self-signed certs
      },
    });

    try {
  const info = await transporter.sendMail({
    from: `"Eventure" <no-reply@eventure.com>`,
    to: user.email,
    subject: `Booking Confirmation: ${event.title}`,
    html: `
      <h3>Booking Confirmed!</h3>
      <p>Event: ${event.title}</p>
      <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
      <p>Location: ${event.location}</p>
      <p>Booking Reference: <strong>${bookingRef}</strong></p>
      <p>Thank you for booking with Eventure!</p>
    `,
  });

  console.log("📧 Preview URL:", nodemailer.getTestMessageUrl(info));
} catch (mailErr) {
  console.error("❌ Email failed:", mailErr.message);
}

    res.json({ message: "Event booked!", bookingRef, event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Cancel a booked event
router.delete("/bookings/:bookingId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const bookingId = req.params.bookingId;

    // Remove the booking by its _id
    const initialLength = user.bookedEvents.length;
    user.bookedEvents = user.bookedEvents.filter(
      (b) => b._id.toString() !== bookingId
    );

    if (user.bookedEvents.length === initialLength) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await user.save();

    res.json({ message: "Booking canceled successfully", bookedEvents: user.bookedEvents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

// test user routes
// router.get("/test", (req, res) => {
//   res.json({ message: "User routes working" });
// });