//import mongoose from "mongoose";

const mongoose = require("mongoose");

const verifySchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    token: {
        type: String,
        required: true
    }
}, {timestamps: true});

//export const Verify = mongoose.model("Verify", verifySchema);