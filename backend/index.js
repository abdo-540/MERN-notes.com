import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json);
app.use(cors());
//app.use('/users', userRoute);

app.get("/", (req, res) => {
    console.log(req);
    return res.status(234).send("welcome");
});