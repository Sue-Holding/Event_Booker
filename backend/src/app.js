import express from "express";
import cors from "cors";
import path, { join } from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import organiserRoutes from "./routes/organiserRoutes.js";

const app = express();

app.use(cors({
    origin: [
      "http://localhost:3000",  //frontend local
      "http://localhost:5050", // pwa backend testing
      "https://eventure-events.netlify.app" //frontend server
    ],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.send("✅ Eventure backend is running!");
// });

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/event", eventRoutes);
app.use("/users", userRoutes);
app.use("/organiser", organiserRoutes);
app.use("/uploads", express.static("uploads"));

// react build files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("Serving frontend build from:", path.join(__dirname, "../../frontend/build"));


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/build")));

  // app.get("/*", (req, res) => {
  //   res.sendFile(path.join(__dirname, "../../frontend/build", "index.html"));
  // });
  app.all(/.*/, (req, res) => {
    res.sendFile(join(__dirname, "../../frontend/build", "index.html"));
  });
}

export default app;