//import express from "express";
//import { Note } from "../models/note";

const express = require("express");
const { Note } = require("../models/note");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const notes = await Note.find({});
        return res.status(200).json(notes);
    } catch (err) {
        console.log(err);
        res.status(500).send({message: err.message});
    }
});

router.get("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const note = await Note.findById(id);
        return res.status(200).json(note);
    } catch (err) {
        console.log(err);
        res.status(500).send({message: err.message});
    }
});

router.post("/", async (req, res) => {
    try {
        if(!req.body.title) {
            return res.status(400).send({message: "Please enter the note's title"});
        }
        else{
            const newNote = {
                title: req.body.title,
                body: req.body.body,
                userID: req.body.id
            };
        const note = Note.create(newNote);
        return res.status(201).json(note);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({message: err.message});
    }
});

router.put("/:id", async (req, res) => {
    try {
        if(!req.body.title){
            return res.status(400).send({message: "Please enter the note's title"});
        }
        else{
            const {id} = req.params;
            const newNote = {
                title: req.body.title,
                body: req.body.body,
                userID: req.body.id
            };
            const note = Note.findByIdAndUpdate(id, newNote);
            return res.status(200).json(note);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({message: err.message});
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        await Note.findByIdAndDelete(id);
        return res.status(200);
    } catch (err) {
        console.log(err);
        res.status(500).send({message: err.message});
    }
});

module.exports = router;