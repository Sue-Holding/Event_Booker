import express from "express";
import Event from "../models/Event.js";
import User from "../models/User.js";
import multer from "multer";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { sendEmail } from "../utils/mailer.js";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    },
});



const upload = multer({ storage });

// post new event - organiser only - POST http://localhost:5050/organiser/events
router.post(
    "/events", 
    upload.single("image"),
    protect, 
    authorize("organiser", "admin"),
    async (req, res) => {
  try {
    const { title, description, date, time, location, category } = req.body;

    if (!title || !date || !location) {
        return res
            .status(400)
            .json({ message: "Title, date and location are required!" });
    }

    const newEvent = new Event({
        title,
        description,
        date,
        time,
        location,
        category,
        organizer: req.user.id,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// get events made by that organiser - GET http://localhost:5050/organiser/events
router.get(
  "/events",
  protect,
  authorize("organiser", "admin"),
  async (req, res) => {
    try {
      const { status } = req.query;
      let filter = { organizer: req.user.id };
      if (status) filter.status = status;

      const events = await Event.find(filter).sort({ date: 1 }); // optional: sort by date
      res.json(events);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// amend existing event PUT http://localhost:5050/organiser/events/:eventId
router.put(
  "/events/:eventId",
  upload.single("image"),
  protect,
  authorize("organiser", "admin"),
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const { organiserComment, ...updates } = req.body;

      delete updates.adminComments; // prevent overwriting the thread manually

      const event = await Event.findById(eventId);
      if (!event)
        return res.status(404).json({ message: "Event not found" });

      if (event.organizer.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this event" });
      }

      // replace image
      if (req.file) {
        event.imageUrl = `/uploads/${req.file.filename}`;
      }

      // push organiser reply if provided
      if (organiserComment) {
        event.adminComments.push({
          userRole: "organiser",
          text: organiserComment,
          createdAt: new Date(),
        });
      }

      // update fields
      Object.assign(event, updates);

      // whenever organiser updates, reset status to pending
      event.status = "pending";

      await event.save();

      res.json({ message: "Event updated and submitted for review", event });
    } catch (err) {
      console.error("Organiser PUT /events/:eventId error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// soft delete / cancel an event DELETE http://localhost:5050/organiser/events/:eventId
router.delete(
    "/events/:eventId", 
    protect, 
    authorize("organiser", "admin"),
    async (req, res) => {
  try {
    const { eventId } = req.params;
    const cancelReason = req.body.cancelReason || "Event was cancelled by the organiser";

    // find event
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // check only organiser who created event can delete it
    if (event.organizer.toString() !== req.user.id) {
        return res
            .status(403)
            .json({ message: "Not authorized to delete this event" });
    }

    // soft delete "cancelled" status and reason
    event.status = "cancelled";
    event.cancelReason = req.body.cancelReason || "Event was cancelled by the organiser";
    await event.save();

    // Notify all attendees
    const attendees = await User.find({ "bookedEvents.event": event._id });

    for (const attendee of attendees) {
    await sendEmail(
        attendee.email,
        `Event Cancelled: ${event.title}`,
        `
        <h3>We're sorry!</h3>
        <p>The event <strong>${event.title}</strong> has been cancelled.</p>
        <p>Reason: ${event.cancelReason}</p>
        <p>You can check other events on Eventure.</p>
        `
    );
    }

    // notify admin
    const admins = await User.find({ role: "admin" });
      for (const admin of admins) {
        await sendEmail(
          admin.email,
          `Event Cancelled by Organiser: ${event.title}`,
          `
            <h3>Attention Admin</h3>
            <p>The organiser <strong>${req.user.name}</strong> has cancelled the event: <strong>${event.title}</strong>.</p>
            <p>Reason: ${event.cancelReason}</p>
            <p>Event ID: ${event._id}</p>
            <p>Please review it on the admin dashboard.</p>
          `
        );
      }

    res.json({ message: "Event cancelled successfully", event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;