import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { User } from "./models/user";
import { Note } from "./models/note";
import { Verify } from "./models/veryfy";

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

app.get("/notes", (req, res) => {
    //
});

app.post("/notes", (req, res) => {});

app.delete("/notes/:id", (req, res) => {});

app.put("/notes/:id", (req, res) => {});

app.post("/users", (req, res) => {});

app.put("/users/:id", (req, res) => {});

app.delete("/users/:id", (req, res) => {});