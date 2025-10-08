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
            enum: ["pending", "approved", "rejected", "needs-update", "cancelled"],
            default: "pending",
        },
        cancelReason: { type: String },
        // adminComment: { type: String },
        adminComments: [
            {
                userRole: { type: String, enum: ["admin", "organiser"], required: true },
                text: { type: String, required: true },
                date: { type: Date, default: Date.now },
            },
            ],

        imageUrl: { type: String },
    },
    { timestamps: true },
);

export default mongoose.model("Event", eventSchema);