import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        date: { type: Date, required: true },
        location: { type: String, requried: true },
        organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true },
);

export default mongoose.model("Event", eventSchema);