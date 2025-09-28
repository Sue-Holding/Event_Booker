import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(cors({
    origin: [
      "http://localhost:3000",  //frontend local
      "https://eventure-events.netlify.app" //frontend server
    ],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("✅ Eventure backend is running!");
});

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/event", eventRoutes);
app.use("/users", userRoutes);


export default app;