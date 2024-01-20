import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    body: String
}, { timestamps: true });

export const Note = mongoose.model("Note", noteSchema);