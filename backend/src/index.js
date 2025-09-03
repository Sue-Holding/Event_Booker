import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import path from "path";
import router from "./routes/routes.js";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// tell express to use EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use("/", router);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));