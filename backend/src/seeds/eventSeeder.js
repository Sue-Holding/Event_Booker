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
    // await User.deleteMany();

    // Create a dummy organizer
    let organizer = await User.findOne({ email: "admin@events.com" });
    if (!organizer) {
      organizer = await User.create({
        name: "Admin Organizer",
        email: "admin@events.com",
        password: "123456", // raw for seed
        role: "admin",
      });
    }

    // Events
    const events = [
      {
        title: "Summer Music Festival",
        description: "Live bands and artists performing all day.",
        date: new Date("2025-07-15"),
        time: "14:00",
        price: 500,
        location: "Stockholm",
        organizer: organizer._id,
        category: "music",
        status: "approved",
      },
      {
        title: "Kids Science Fair",
        description: "Fun and educational experiments for kids.",
        date: new Date("2025-09-10"),
        time: "10:00",
        price: 100,
        location: "Gothenburg",
        organizer: organizer._id,
        category: "kids",
        status: "approved",
      },
      {
        title: "City Marathon",
        description: "Annual marathon through the city center.",
        date: new Date("2025-10-01"),
        time: "08:00",
        price: 0, // free
        location: "Malmö",
        organizer: organizer._id,
        category: "sport",
        status: "approved",
      },
      {
        title: "Cultural Food Expo",
        description: "Explore cuisines from around the world.",
        date: new Date("2025-08-25"),
        time: "12:00",
        price: 250,
        location: "Uppsala",
        organizer: organizer._id,
        category: "culture",
        status: "approved",
      },
      {
        title: "Indie Rock Night",
        description: "Local indie rock bands performing live.",
        date: new Date("2025-11-05"),
        time: "19:00",
        price: 400,
        location: "Stockholm",
        organizer: organizer._id,
        category: "music",
        status: "pending",
      },
      {
    title: "Autumn Art Workshop",
    description: "Hands-on painting and sculpting workshops.",
    date: new Date("2025-09-20"),
    time: "11:00",
    price: 300,
    location: "Stockholm",
    organizer: organizer._id,
    category: "art",
    status: "approved",
  },
  {
    title: "Jazz Evening",
    description: "Relaxing jazz music with local artists.",
    date: new Date("2025-08-30"),
    time: "18:00",
    price: 200,
    location: "Gothenburg",
    organizer: organizer._id,
    category: "music",
    status: "approved",
  },
  {
    title: "Kids Adventure Camp",
    description: "Outdoor activities and team games for kids.",
    date: new Date("2025-07-25"),
    time: "09:00",
    price: 500,
    location: "Malmö",
    organizer: organizer._id,
    category: "kids",
    status: "approved",
  },
  {
    title: "Tech Conference 2025",
    description: "Latest tech talks and networking sessions.",
    date: new Date("2025-10-15"),
    time: "09:30",
    price: 1500,
    location: "Stockholm",
    organizer: organizer._id,
    category: "technology",
    status: "approved",
  },
  {
    title: "Wine Tasting Night",
    description: "Sample wines from local vineyards.",
    date: new Date("2025-11-10"),
    time: "20:00",
    price: 600,
    location: "Uppsala",
    organizer: organizer._id,
    category: "food & drink",
    status: "pending",
  },
  {
    title: "Yoga in the Park",
    description: "Morning yoga session for all levels.",
    date: new Date("2025-08-05"),
    time: "07:30",
    price: 0,
    location: "Stockholm",
    organizer: organizer._id,
    category: "health",
    status: "approved",
  },
  {
    title: "Photography Walk",
    description: "Guided walk to capture city landscapes.",
    date: new Date("2025-09-12"),
    time: "15:00",
    price: 150,
    location: "Gothenburg",
    organizer: organizer._id,
    category: "art",
    status: "approved",
  },
  {
    title: "Autumn Marathon Training",
    description: "Weekly sessions to prepare for the city marathon.",
    date: new Date("2025-09-18"),
    time: "08:00",
    price: 200,
    location: "Malmö",
    organizer: organizer._id,
    category: "sport",
    status: "approved",
  },
  {
    title: "Cultural Dance Night",
    description: "Experience dances from different cultures.",
    date: new Date("2025-10-22"),
    time: "19:30",
    price: 350,
    location: "Uppsala",
    organizer: organizer._id,
    category: "culture",
    status: "approved",
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
