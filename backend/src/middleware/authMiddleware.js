import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
     
    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing." });
    }

    try {
      // to verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // attach user to req and remove password for secruity
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      console.error (err);
      res.status(401).json({ message: "Not authorized, token failed."});
    }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized for this action" });
    }
    next();
  };
};