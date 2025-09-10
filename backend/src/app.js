import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";
// import eventRoutes from "./routes/eventRoutes.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:3000", //frontend server
    credentials: true,
}));

// app.use("/", router);

app.use("/auth", authRoutes);
// app.use("/admin", adminRoutes);
// app.use("/event", eventRoutes);


export default app;