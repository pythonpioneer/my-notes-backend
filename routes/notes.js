const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const fetchuser = require('../middleware/fetchuser');
const { check, body, validationResult } = require('express-validator');

// Route 1: To fetch all notes for logged in user: "/api/v1/notes/fetchallnotes" [ using GET ] (login required)
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ errors: "Internal server error" });
    }
});

// Route 2: To add a note by logged in user: "/api/v1/notes/addnotes" [ using POST ] (login required)
router.get('/addnotes', fetchuser, [

    // validating all inputs
    body('title', "Enter a valid title").isLength({ min: 1 }),
    body('description', "Enter description").isLength({ min: 1 }),
], async (req, res) => {

    try {
        // validating errors for notes addition
        const results = validationResult(req);
        if (!results.isEmpty()) {
            res.status(400).json({ errors: results.array() });
        }

        // if validation succeeded
        const notes = new Notes({
            title: req.body.title,
            description: req.body.description,
            tag: req.body.tag,
            user: req.user.id  // req.user.id is set when fetchuser middleware were called
        });

        // now save the note
        const savedNotes = await notes.save();
        res.send(savedNotes);
    } catch (err) {
        res.status(500).json({ errors: "Internal server error", issue: err });
    }
});

// Route 3: To update an existing note by logged in user: "/api/v1/notes/updatenotes/noteid=id" [ using PUT ] (login required)
router.put('/updatenotes/noteid=:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        // create a new note object
        const newNote = {};

        // now, fill all updated details 
        if (title) newNote.title = title;
        if (description) newNote.description = description;
        if (tag) newNote.tag = tag;

        /* find the note that to be updated by logged in user */
        // confirm that the note exist
        let note = await Notes.findById(req.params.id);
        if (!note) return res.status(404).send("Not Found");

        // confirm the user idenetity
        if (note.user.toString() !== req.user.id) return res.status(401).send("Not Allowed");

        // now, update the note
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    } catch (err) {
        res.status(500).json({ errors: "Internal server error", issue: err });
    }
});

// Route 4: To delete an existing note by logged in user: "/api/v1/notes/deletenotes/noteid=id" [ using DELETE ] (login required)
router.delete('/deletenotes/noteid=:id', fetchuser, async (req, res) => {
    try {

        /* find the note that to be deleted by logged in user */
        // confirm that the note exists
        let note = await Notes.findById(req.params.id);
        if (!note) return res.status(404).send("Not Found");

        // confirm the user idenetity
        if (note.user.toString() !== req.user.id) return res.status(401).send("Not Allowed");

        // now find the note and delete the note
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ success: "Note has been deleted", note: note, id: req.params.id });
    } catch (err) {
        res.status(500).json({ errors: "Internal server error", issue: err });
    }
});
module.exports = router;