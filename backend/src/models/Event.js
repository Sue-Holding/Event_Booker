import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        date: { type: Date, required: true },
        time: { type: String },
        location: { type: String, required: true },
        price: { type: Number, default: 0 },
        organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        category: { type: String, default: "General" }, //kids, music etc
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true },
);

export default mongoose.model("Event", eventSchema);