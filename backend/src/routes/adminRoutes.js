import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Event from "../models/Event.js";

const router = express.Router();

// Only admins should see this route - dashboard page to be made
// router.get("/dashboard", protect, authorize("admin"), (req, res) => {
//   res.json({ message: `Welcome Admin ${req.user.name}!` });
// });


// USER SETINGS ROUTES
// fetch all users on all role - admin only - GET http://localhost:5050/admin/users
router.get(
    "/users", 
    protect, 
    authorize("admin"),
    async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// create a new user on all role - admin only - POST http://localhost:5050/admin/users
router.post(
    "/users", 
    protect, 
    authorize("admin"),
    async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    if (!name || !email || !role || !password)
      return res.status(400).json({ message: "All fields are required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, role, password });
    res.status(201).json({ message: "User created", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// approve organiser registration request
router.patch(
  "/approve-organiser/:id",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      console.log("PATCH /approve-organiser id:", req.params.id);

      const user = await User.findById(req.params.id);
      if (!user) return res.status(400).json({ message: "User not found" });

        user.role = "organiser";
        user.status = "approved";
        await user.save();

        res.status(200).json({ message: `${user.name} is now an Event Organiser!` });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// reject organiser registration request
router.patch(
  "/reject-organiser/:id",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      console.log("PATCH /reject-organiser id:", req.params.id);

      const user = await User.findById(req.params.id);
      if (!user) return res.status(400).json({ message: "User not found" });

      // Mark user as rejected
      user.status = "rejected";
      await user.save();

      res.status(200).json({ message: `${user.name}'s organiser request has been rejected.` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }
);

// update user setting on all role - admin only - PUT http://localhost:5050/admin/users/:id
router.put(
    "/users/:id", 
    protect, 
    authorize("admin"),
    async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();
    res.json({ message: "User updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// delete a user on all role - admin only - DELETE http://localhost:5050/admin/users/:id
router.delete(
    "/users/:id", 
    protect, 
    authorize("admin"),
    async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// EVENT STATS
// fetch event stats - admin only - GET http://localhost:5050/admin/events
router.get(
    "/events", 
    protect, 
    authorize("admin"),
    async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    // let query = {};
    // if (status) query.status = status; 

    const events = await Event.find(query)
      .populate("organizer", "name email")
      .lean();

      // fetch all users to count bookings
    const users = await User.find().select("bookedEvents").lean();

    const bookingsPerEvent = {};
    events.forEach(event => bookingsPerEvent[event._id] = 0);

    // Count bookings per event
      users.forEach(user => {
        if (Array.isArray(user.bookedEvents)) {
          user.bookedEvents.forEach(booking => {
            const eventId = booking.event?.toString();
            if (bookingsPerEvent[eventId] !== undefined) {
              bookingsPerEvent[eventId]++;
            }
          });
        }
      });

    // count events per organizer
    const eventsPerOrganiser = {};
    events.forEach(event => {
      const orgId = event.organizer?._id.toString();
      if (orgId) {
        eventsPerOrganiser[orgId] = (eventsPerOrganiser[orgId] || 0) + 1;
      }
    });

    const organiserNames = {};
    events.forEach(event => {
      if (event.organizer?._id) {
        organiserNames[event.organizer._id] = event.organizer.name;
      }
    });

    // Attach booking count to each event object
      const eventsWithStats = events.map(event => ({
        ...event,
        totalBookings: bookingsPerEvent[event._id.toString()] || 0,
      }));

        // calculate stats
      const stats = {
        totalEvents: events.length,
        freeEvents: events.filter((e) => e.price === 0).length,
        approved: events.filter((e) => e.status === "approved").length,
        pending: events.filter((e) => e.status === "pending").length,
        rejected: events.filter((e) => e.status === "rejected").length,
        cancelled: events.filter((e) => e.status === "cancelled").length,
        bookingsPerEvent,
        eventsPerOrganiser, 
      };
      
    res.json({ events: eventsWithStats, stats });
  } catch (err) {
    console.error("GET /admin/events error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// EVENT APPROVAL
// approve or deny new events - admin only - POST http://localhost:5050/admin/events/:id/approve
router.post(
    "/events/:id/approve", 
    protect, 
    authorize("admin"),
    async (req, res) => {
  try {
    const { action, comment } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // switch case for admin to chose action
    switch (action) {
        case "approve":
          event.status = "approved";
          break;

        case "needs-update":
          event.status = "needs-update";
          if (comment) {
            event.adminComments.push({
              userRole: "admin",
              text: comment,
            });
          }
          break;

        case "reject":
          event.status = "rejected";
          if (comment) {
            event.adminComments.push({
              userRole: "admin",
              text: comment,
            })
          }
          break;

        default:
          return res.status(400).json({ message: "Invalid action" });
      }

    await event.save();

    res.json({ 
      message: `Event ${action}`, 
      event,
     });
  } catch (err) {
    console.error("Admin POST /events/:id/approve error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



export default router;