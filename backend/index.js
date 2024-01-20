import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { User } from "./models/user";
import { Verify } from "./models/veryfy";
import userRoute from "./routes/userRoute";
import noteRoute from "./routes/noteRoute";

dotenv.config();

const app = express();
const port = process.env.PORT;

const createtoken = (_id) => {
    return jsonwebtoken.sign({_id}, process.env.SECRET);
};

const mailer = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'abdelrahmanessam540@gmail.com',
        pass: 'Boda_2002'
    }
});

const sendEmail = async (to, url) => {
    const mailOptions = {
        from: "abdelrahmanessam540@gmail.com",
        to: to,
        subject: "OML verify",
        text: `Click on this link to verify: ${url}`,
        html: `-Click on this link to verify: ${url}`
    };

    await mailer.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error("Error sending email: ", err);
        } else {
            console.log("Email sent: ", info.response);
        }
    });
}

const signup = async (req, res) => {
    const {username, email, password} = req.body;

    try {
        const user = await User.signup(username, email, password);

        const verify = await new Verify({
            userID: user._id,
            token: crypto.randomBytes(32).toString("hex")
        }).save();

        //localhost should be dynamic
        await sendEmail(user.email, `localhost:8000/users/${user._id}/verify/${verify}`);

        const token = createtoken(user.id);

        res.status(200).json({email, token});
    }
    catch (err) {
        console.log(err);
        res.status(400).json({Error: err.message});
    }
};

const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.login(email, password);

        const token = createtoken(user.id);
        res.status(200).json({email, token});
    } catch (err) {
        console.log(err);
        res.status(400).json({Error: err.message});
    }
};


app.use(express.json);
app.use(cors());
app.use('/users', userRoute);
app.use('/notes', noteRoute);

app.get("/", (req, res) => {
    console.log(req);
    return res.status(234).send("welcome");
});

app.post("/signup", signup);

app.post("/login", login);

mongoose.connect(process.env.MONGOOSE_URL).then(() => {
    console.log("connected to db");
    app.listen(port, () => {
        console.log(`listening to port ${port}`);
    });
}).catch((err) => {
    console.log(err);
});