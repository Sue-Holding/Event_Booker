import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../db.js";
import Event from "../models/Event.js";
import User from "../models/User.js";

dotenv.config();
await connectDB();

const seedData = async () => {
  try {
    await Event.deleteMany();

    let organizer = await User.findOne({ email: "admin@events.com" });
    if (!organizer) {
      organizer = await User.create({
        name: "Admin Organizer",
        email: "admin@events.com",
        password: "123456",
        role: "admin",
      });
    }

    const events = [
      {
        title: "Summer Music Festival",
        description:
          "Enjoy an unforgettable day with live bands, DJs, and street food in the heart of Stockholm.",
        date: new Date("2025-07-15"),
        time: "14:00",
        location: "Stockholm",
        price: 500,
        category: "music",
        status: "approved",
        organizer: organizer._id,
        imageUrl: "/uploads/music1.png",
      },
      {
        title: "Kids Science Fair",
        description:
          "Hands-on experiments and interactive learning zones for children of all ages.",
        date: new Date("2025-09-10"),
        time: "10:00",
        location: "Gothenburg",
        price: 100,
        category: "kids",
        status: "approved",
        organizer: organizer._id,
        imageUrl: "/uploads/kids1.png",
      },
      {
        title: "City Marathon",
        description:
          "Run through Malmö’s scenic streets with thousands of other runners. Includes a 5K fun run.",
        date: new Date("2025-10-01"),
        time: "08:00",
        location: "Malmö",
        price: 0,
        category: "sport",
        status: "approved",
        organizer: organizer._id,
        imageUrl: "/uploads/sport1.png",
      },
      {
        title: "Cultural Food Expo",
        description:
          "Discover flavors from around the world, live cooking demos, and tasting booths.",
        date: new Date("2025-08-25"),
        time: "12:00",
        location: "Uppsala",
        price: 250,
        category: "food & drink",
        status: "approved",
        organizer: organizer._id,
        imageUrl: "/uploads/food1.png",
      },
      {
        title: "Autumn Art Workshop",
        description:
          "Learn painting and sculpture techniques from local artists. Materials provided.",
        date: new Date("2025-09-20"),
        time: "11:00",
        location: "Stockholm",
        price: 300,
        category: "art",
        status: "approved",
        organizer: organizer._id,
        imageUrl: "/uploads/art1.png",
      },
      {
        title: "Jazz Evening",
        description:
          "Smooth jazz vibes with candlelight and great company in a cozy lounge atmosphere.",
        date: new Date("2025-08-30"),
        time: "18:00",
        location: "Gothenburg",
        price: 200,
        category: "music",
        status: "approved",
        organizer: organizer._id,
        imageUrl: "/uploads/music2.png",
      },
      {
        title: "Yoga in the Park",
        description:
          "Morning yoga for all levels under the open sky. Bring your mat and start your day right!",
        date: new Date("2025-08-05"),
        time: "07:30",
        location: "Stockholm",
        price: 0,
        category: "health",
        status: "approved",
        organizer: organizer._id,
        imageUrl: "/uploads/health1.png",
      },
      {
        title: "Photography Walk",
        description:
          "Explore Gothenburg through your lens. Learn pro tips from experienced photographers.",
        date: new Date("2025-09-12"),
        time: "15:00",
        location: "Gothenburg",
        price: 150,
        category: "art",
        status: "approved",
        organizer: organizer._id,
        imageUrl: "/uploads/art2.png",
      },
      {
        title: "Tech Conference 2025",
        description:
          "Keynotes, workshops, and networking with leaders from the global tech industry.",
        date: new Date("2025-10-15"),
        time: "09:30",
        location: "Stockholm",
        price: 1500,
        category: "technology",
        status: "approved",
        organizer: organizer._id,
        imageUrl: "/uploads/tech1.png",
      },
      {
        title: "Autumn Marathon Training",
        description:
          "Weekly sessions led by professional trainers to prep for the main marathon event.",
        date: new Date("2025-09-18"),
        time: "08:00",
        location: "Malmö",
        price: 200,
        category: "sport",
        status: "approved",
        organizer: organizer._id,
        imageUrl: "/uploads/sport2.png",
      },
      {
        title: "Cultural Dance Night",
        description:
          "Experience traditional dances and rhythms from around the world with live performances.",
        date: new Date("2025-10-22"),
        time: "19:30",
        location: "Uppsala",
        price: 350,
        category: "culture",
        status: "approved",
        organizer: organizer._id,
        imageUrl: "/uploads/culture1.png",
      },
      {
        title: "Open-Air Cinema",
        description:
          "Enjoy your favorite classic movies under the stars. Snacks and blankets provided.",
        date: new Date("2025-08-12"),
        time: "21:00",
        location: "Stockholm",
        price: 100,
        category: "film",
        status: "approved",
        organizer: organizer._id,
        imageUrl: "/uploads/film1.png",
      },
      {
        title: "Winter Coding Bootcamp",
        description:
          "An intensive weekend coding course for beginners. Bring your laptop and curiosity!",
        date: new Date("2025-12-05"),
        time: "10:00",
        location: "Stockholm",
        price: 400,
        category: "education",
        status: "approved",
        organizer: organizer._id,
        imageUrl: "/uploads/education1.png",
      },
      {
        title: "Midsummer Picnic",
        description:
          "Celebrate Swedish Midsummer with games, music, and food in the park.",
        date: new Date("2025-06-21"),
        time: "13:00",
        location: "Uppsala",
        price: 0,
        category: "culture",
        status: "approved",
        organizer: organizer._id,
        imageUrl: "/uploads/culture2.png",
      },
      {
        title: "Coding for Kids",
        description:
          "Fun and interactive introduction to programming for children ages 8–12.",
        date: new Date("2025-09-02"),
        time: "16:00",
        location: "Malmö",
        price: 150,
        category: "education",
        status: "approved",
        organizer: organizer._id,
        imageUrl: "/uploads/kids2.png",
      },
      {
        title: "Vegan Cooking Class",
        description:
          "Learn how to make delicious plant-based meals with local chefs.",
        date: new Date("2025-08-28"),
        time: "17:00",
        location: "Gothenburg",
        price: 350,
        category: "food & drink",
        status: "approved",
        organizer: organizer._id,
        imageUrl: "/uploads/food2.png",
      },
      {
        title: "Street Art Tour",
        description:
          "Guided walking tour showcasing the best murals and street art in Stockholm.",
        date: new Date("2025-07-10"),
        time: "14:00",
        location: "Stockholm",
        price: 120,
        category: "art",
        status: "approved",
        organizer: organizer._id,
        imageUrl: "/uploads/art3.png",
      },
      {
        title: "Family Fun Day",
        description:
          "Games, crafts, and entertainment for the whole family at the city park.",
        date: new Date("2025-08-18"),
        time: "10:00",
        location: "Uppsala",
        price: 50,
        category: "kids",
        status: "approved",
        organizer: organizer._id,
        imageUrl: "/uploads/kids3.png",
      },
      {
        title: "Startup Networking Night",
        description:
          "Meet fellow entrepreneurs, investors, and innovators over drinks and discussions.",
        date: new Date("2025-11-15"),
        time: "19:00",
        location: "Stockholm",
        price: 250,
        category: "business",
        status: "approved",
        organizer: organizer._id,
        imageUrl: "/uploads/business1.png",
      },
      {
        title: "Creative Writing Workshop",
        description:
          "Improve your storytelling skills and get feedback from published authors.",
        date: new Date("2025-09-25"),
        time: "18:00",
        location: "Gothenburg",
        price: 200,
        category: "education",
        status: "approved",
        organizer: organizer._id,
        imageUrl: "/uploads/education2.png",
      },
    ];

    // Duplicate some events with new dates to reach ~40
    const moreEvents = [];
    for (let i = 0; i < 20; i++) {
      const base = events[i % events.length];
      moreEvents.push({
        ...base,
        date: new Date(new Date(base.date).getTime() + i * 86400000 * 3), // new date every 3 days
        title: `${base.title} (Session ${i + 2})`,
      });
    }

    await Event.insertMany([...events, ...moreEvents]);

    console.log("✅ Seeded 40 approved events with local uploads!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();









// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import connectDB from "../db.js";
// import Event from "../models/Event.js";
// import User from "../models/User.js";

// dotenv.config();
// await connectDB();

// const seedData = async () => {
//   try {
//     // Clean DB
//     await Event.deleteMany();
//     // await User.deleteMany();

//     // Create a dummy organizer
//     let organizer = await User.findOne({ email: "admin@events.com" });
//     if (!organizer) {
//       organizer = await User.create({
//         name: "Admin Organizer",
//         email: "admin@events.com",
//         password: "123456", // raw for seed
//         role: "admin",
//       });
//     }

//     // Events
//     const events = [
//       {
//         title: "Summer Music Festival",
//         description: "Live bands and artists performing all day.",
//         date: new Date("2025-07-15"),
//         time: "14:00",
//         price: 500,
//         location: "Stockholm",
//         organizer: organizer._id,
//         category: "music",
//         status: "approved",
//       },
//       {
//         title: "Kids Science Fair",
//         description: "Fun and educational experiments for kids.",
//         date: new Date("2025-09-10"),
//         time: "10:00",
//         price: 100,
//         location: "Gothenburg",
//         organizer: organizer._id,
//         category: "kids",
//         status: "approved",
//       },
//       {
//         title: "City Marathon",
//         description: "Annual marathon through the city center.",
//         date: new Date("2025-10-01"),
//         time: "08:00",
//         price: 0, // free
//         location: "Malmö",
//         organizer: organizer._id,
//         category: "sport",
//         status: "approved",
//       },
//       {
//         title: "Cultural Food Expo",
//         description: "Explore cuisines from around the world.",
//         date: new Date("2025-08-25"),
//         time: "12:00",
//         price: 250,
//         location: "Uppsala",
//         organizer: organizer._id,
//         category: "culture",
//         status: "approved",
//       },
//       {
//         title: "Indie Rock Night",
//         description: "Local indie rock bands performing live.",
//         date: new Date("2025-11-05"),
//         time: "19:00",
//         price: 400,
//         location: "Stockholm",
//         organizer: organizer._id,
//         category: "music",
//         status: "pending",
//       },
//       {
//     title: "Autumn Art Workshop",
//     description: "Hands-on painting and sculpting workshops.",
//     date: new Date("2025-09-20"),
//     time: "11:00",
//     price: 300,
//     location: "Stockholm",
//     organizer: organizer._id,
//     category: "art",
//     status: "approved",
//   },
//   {
//     title: "Jazz Evening",
//     description: "Relaxing jazz music with local artists.",
//     date: new Date("2025-08-30"),
//     time: "18:00",
//     price: 200,
//     location: "Gothenburg",
//     organizer: organizer._id,
//     category: "music",
//     status: "approved",
//   },
//   {
//     title: "Kids Adventure Camp",
//     description: "Outdoor activities and team games for kids.",
//     date: new Date("2025-07-25"),
//     time: "09:00",
//     price: 500,
//     location: "Malmö",
//     organizer: organizer._id,
//     category: "kids",
//     status: "approved",
//   },
//   {
//     title: "Tech Conference 2025",
//     description: "Latest tech talks and networking sessions.",
//     date: new Date("2025-10-15"),
//     time: "09:30",
//     price: 1500,
//     location: "Stockholm",
//     organizer: organizer._id,
//     category: "technology",
//     status: "approved",
//   },
//   {
//     title: "Wine Tasting Night",
//     description: "Sample wines from local vineyards.",
//     date: new Date("2025-11-10"),
//     time: "20:00",
//     price: 600,
//     location: "Uppsala",
//     organizer: organizer._id,
//     category: "food & drink",
//     status: "pending",
//   },
//   {
//     title: "Yoga in the Park",
//     description: "Morning yoga session for all levels.",
//     date: new Date("2025-08-05"),
//     time: "07:30",
//     price: 0,
//     location: "Stockholm",
//     organizer: organizer._id,
//     category: "health",
//     status: "approved",
//   },
//   {
//     title: "Photography Walk",
//     description: "Guided walk to capture city landscapes.",
//     date: new Date("2025-09-12"),
//     time: "15:00",
//     price: 150,
//     location: "Gothenburg",
//     organizer: organizer._id,
//     category: "art",
//     status: "approved",
//   },
//   {
//     title: "Autumn Marathon Training",
//     description: "Weekly sessions to prepare for the city marathon.",
//     date: new Date("2025-09-18"),
//     time: "08:00",
//     price: 200,
//     location: "Malmö",
//     organizer: organizer._id,
//     category: "sport",
//     status: "approved",
//   },
//   {
//     title: "Cultural Dance Night",
//     description: "Experience dances from different cultures.",
//     date: new Date("2025-10-22"),
//     time: "19:30",
//     price: 350,
//     location: "Uppsala",
//     organizer: organizer._id,
//     category: "culture",
//     status: "approved",
//   },
//     ];

//     await Event.insertMany(events);

//     console.log("✅ Seeded users and events!");
//     process.exit();
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// };

// seedData();
