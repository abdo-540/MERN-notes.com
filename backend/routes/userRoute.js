import express from "express";
import { User } from "../models/user";
import { Verify } from "../models/verify";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json(users);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({message: err.message});
    }
});

router.get("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        return res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).send({message: err.message});
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);

        res.status(200);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({message: err.message});
    }
});

router.get("/:id/verify/:verify", async (req, res) => {
    try {
        const {id, verify} = req.params;
        const token = await Verify.findOne({
            userID: id,
            token : verify
        });
        const user = await User.findById(id);

        if(!user || !token){
            res.status(400).send({message: "invalid link"});
        }
        else{
            await User.updateOne({
                _id: user.id,
                verified: true
            });
            await token.remove();
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({message: err.message});
    }
});

export default router;