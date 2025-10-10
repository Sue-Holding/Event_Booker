import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.js"  
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    let { name, email, password, role } = req.body;
    let status = "approved"; // default

    // If registering as organiser without admin, make pending
    if (role === "organiser") {
      role = "attendee"; // start as attendee
      status = "pending";
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      status,
    });

    res.status(201).json({
      message:
        role === "attendee"
          ? "Registration successful"
          : "Your organiser account is pending admin approval.",
      user,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.post("/login", 
    loginUser,
    async (req, res) => {
        const {email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return
            res.status(400).json({ message: "USer not found" });

            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(401).json({ message: "Invalid credentials" });

            // Block organiser login until approved
            if (user.role === "attendee" && user.status === "pending") {
                return res.json({
                message: "Your organiser account is awaiting admin approval. You are logged in as attendee.",
                token: generateJWT(user), // still attendee token
                });
            }

            const token = generateJWT(user);
            res.json({ token, name: user.name, role: user.role });
    });


router.post("/logout", logoutUser);

export default router;