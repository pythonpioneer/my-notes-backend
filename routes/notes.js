const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const Tags = require('../models/Tags')
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
    body('title', "Enter a valid title").isLength({ min: 1, max: 20 }),
    body('description', "Enter description").isLength({ min: 1, max: 200 }),
], async (req, res) => {

    try {
        // validating errors for notes addition
        const results = validationResult(req);
        if (!results.isEmpty()) {
            return res.status(400).json({ status: 400, message: results["errors"][0]["msg"], where: results["errors"][0]["path"] });
        }

        // if validation succeeded, make a note object entries
        let currentTag = req.body?.tag?.length > 0 ? req.body.tag : "General";
        const notes = new Notes({
            title: req.body.title,
            description: req.body.description,
            tag: currentTag,
            user: req.user.id  // req.user.id is set when fetchuser middleware were called
        });

        // now find the tag in Tags, if not there then only add in db
        let isTagExist = false;
        await Tags.findOne({ tag: currentTag }).then((result) => { result && (isTagExist = true) });

        // make a tag object entry
        if (!isTagExist) {
            const tag = new Tags({
                tag: currentTag,
            });

            // now save the tag in db
            await tag.save();
        }

        // now save the note
        const savedNotes = await notes.save();
        res.json({status: 200, message: 'Notes Added', note: savedNotes});
    } catch (err) {
        res.status(500).json({ status: 500, message: "Internal Server Error", issue: err });
    }
});

// Route 3: To update an existing note by logged in user: "/api/v1/notes/updatenotes/noteid=id" [ using PUT ] (login required)
router.put('/updatenotes/noteid=:id', fetchuser, [

    // validating all inputs
    body('title', "Enter a valid title").isLength({ min: 1, max: 20 }),
    body('description', "Enter description").isLength({ min: 1, max: 200 }),
], async (req, res) => {
    try {

        // validating errors for notes updation
        const results = validationResult(req);
        if (!results.isEmpty()) {
            return res.status(400).json({ status: 400, message: results["errors"][0]["msg"], where: results["errors"][0]["path"] });
        }

        const { title, description, tag } = req.body;

        // create a new note object
        const newNote = {timestamp: Date.now()};

        // now, fill all updated details 
        if (title) newNote.title = title;
        if (description) newNote.description = description;
        if (tag) newNote.tag = tag;

        /* find the note that to be updated by logged in user */
        // confirm that the note exist
        let note = await Notes.findById(req.params.id);
        if (!note) return res.status(404).json({status: 404, message: "Not Found"});

        // confirm the user idenetity
        if (note.user.toString() !== req.user.id) return res.status(401).json({status: 401, message: "Not Allowed"});

        // now find the tag in Tags, if not there then only add in db
        const currentTag = tag;  // ?.length > 0 ? tag : "General";
        let isTagExist = false;
        await Tags.findOne({ tag: currentTag }).then((result) => { result && (isTagExist = true) });

        // make a tag object entry
        if (!isTagExist && tag?.length > 0) {  // tag?.length condition will prevent from adding empty and null tags
            const tag = new Tags({
                tag: currentTag,
            });

            // now save the tag in db
            await tag.save();
        }

        // now, update the note
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({status: 200, message: 'Notes Updated', note: note});
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
        if (!note) return res.status(404).json({status: 404, message: "Not Found"});

        // confirm the user idenetity
        if (note.user.toString() !== req.user.id) return res.status(401).res.status(401).json({status: 401, message: "Not Allowed"});

        // now find the note and delete the note
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ status: 200, message: "Note has been deleted", note: note });
    } catch (err) {
        res.status(500).json({ errors: "Internal server error", issue: err });
    }
});

module.exports = router;