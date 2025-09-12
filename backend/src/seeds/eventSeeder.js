import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../db.js";
import Event from "../models/Event.js";
import User from "../models/User.js";

dotenv.config();
await connectDB();

const seedData = async () => {
  try {
    // Clean DB
    await Event.deleteMany();
    await User.deleteMany();

    // Create a dummy organizer
    const organizer = await User.create({
      name: "Admin Organizer",
      email: "admin@events.com",
      password: "123456", // will be hashed in real flow, here it's raw
      role: "admin",
    });

    // Events
    const events = [
      {
        title: "Summer Music Festival",
        description: "Live bands and artists performing all day.",
        date: new Date("2025-07-15"),
        location: "Stockholm",
        organizer: organizer._id,
        category: "music",
        status: "approved",
      },
      {
        title: "Kids Science Fair",
        description: "Fun and educational experiments for kids.",
        date: new Date("2025-09-10"),
        location: "Gothenburg",
        organizer: organizer._id,
        category: "kids",
        status: "approved",
      },
      {
        title: "City Marathon",
        description: "Annual marathon through the city center.",
        date: new Date("2025-10-01"),
        location: "Malmö",
        organizer: organizer._id,
        category: "sport",
        status: "approved",
      },
      {
        title: "Cultural Food Expo",
        description: "Explore cuisines from around the world.",
        date: new Date("2025-08-25"),
        location: "Uppsala",
        organizer: organizer._id,
        category: "culture",
        status: "approved",
      },
      {
        title: "Indie Rock Night",
        description: "Local indie rock bands performing live.",
        date: new Date("2025-11-05"),
        location: "Stockholm",
        organizer: organizer._id,
        category: "music",
        status: "pending",
      },
    ];

    await Event.insertMany(events);

    console.log("✅ Seeded users and events!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
