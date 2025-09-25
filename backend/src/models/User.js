import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum:  ["attendee", "organiser", "admin"],
            default: "attendee",
        },
        favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
        bookedEvents: [
            {
                event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
                bookingRef: String,
                bookedAt: { type: Date, default: Date.now },
            }
            ],
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);