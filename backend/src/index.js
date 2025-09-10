// import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import app from "./app.js";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));