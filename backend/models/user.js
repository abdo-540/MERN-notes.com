import mongoose from "mongoose";
import validator from "validator";
import nodemailer from "nodemailer";
import { Verify } from "./verify";

const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

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

userSchema.statics.signup = async function (username, email, password){
    if(!username || !email || !password){
        throw Error('Please fill all requirement');
    }
    if(!validator.isEmail(email)){
        throw Error('Invalid email');
    }
    if(!validator.isStrongPassword(password)){
        throw Error('You need a stronger password')
    }

    const exist = await this.findOne({email});

    if(exist){
        throw Error('Email alredy exists');
    }

    const salt = bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await this.create({username, email, password: hashed});

    return user;
}

userSchema.statics.login = async function (email, password) {
    if(!email || !password){
        throw Error('Please fill all requirement');
    }

    const exist = await this.findOne({email});

    if(!exist){
        throw Error('Invalid email');
    }

    const comphash = await bcrypt.compare(password, exist.password);

    if(!comphash){
        throw Error('Invalid password');
    }

    if(!exist.verified){
        const verify = await new Verify({
            userID: exist._id,
            token: crypto.randomBytes(32).toString("hex")
        }).save();

        const token = Verify.findOne({
            userID: exist._id
        });

        if(!token){
            //localhost should be dynamic
            await sendEmail(exist.email, `localhost:8000/users/${exist._id}/verify/${verify}`);
        }

        throw Error('Please verify your account');
    }

    return exist;
}

export const User = mongoose.model("User", userSchema);