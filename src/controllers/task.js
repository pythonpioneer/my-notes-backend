// importing all requirements
const User = require('../models/User');
const Notes = require('../models/Task');
const Category = require('../models/Category');


// to add notes
const createNote = async (req, res) => {
    try {
        // fetching the data from the request body
        const { title, desc } = req.body;
        const category = req.body.category.toLowerCase();

        // confirm that the useer exists
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User not found!!" });

        // now, add the notes in the notes model
        Notes.create({
            user: req.user.id,
            title: title,
            desc: desc,
            category: category
        })
            .then(async (notes) => {  // notes created successfully
                
                // now add the category in category model
                const noteCategory = await Category.findOne({ category });
                if (!noteCategory) {
                    // creating category
                    await Category.create({ category });
                }

                return res.status(200).json({ status: 200, message: "notes Created!", notes: notes });
            })
            .catch(err => {  // the notes is not added in the notes model
                return res.status(500).json({ status: 500, message: "notes creation failed!", errors: err });
            });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ status: 500, message: "Internal Server Errors", errors: err });
    }
};

// to get the notes by logged in users and delete all the blank notess
const getNotes = async (req, res) => {
    try {
        // fetch complete status from query
        let isCompleted = req.query.completed;
 
        if (isCompleted === 'true') isCompleted = true;
        else if (isCompleted === 'false' || !isCompleted) isCompleted = false;
        else return res.status(404).json({ status: 404, message: "Invalid Query!", info: "Complete takes boolean only." });

        // fetch page number from query params
        const page = Number(req.query.page) || 1;
        let limit = 10;
        let skip = (page - 1) * limit;

        // confirm that the logged in user exists
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found!" });

        // Fetch all the notes for the user
        const notes = await Notes.find({ user: req.user.id, isCompleted });

        // Sort the notes by the most recent date
        const sortedNotes = notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        // If there are no notes for the user
        if (sortedNotes.length === 0) {
            return res.status(200).json({ status: 200, message: "You haven't added any notes yet!" });
        }

        // Return paginated and sorted notes
        return res.status(200).json({
            status: 200,
            message: "Notes Found!",
            totalResults: sortedNotes.length,
            notes: sortedNotes.slice(skip, skip + limit),
        });
    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ status: 500, message: "Internal Server Errors", errors: err });
    }
};

// to delete the notes
const deleteNote = async (req, res) => {
    try {
        // fetch the notes id from the query param
        const noteId = req.query['note-id'];

        // verify that the user exists
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found!" });

        // now, confirm that the notes exists
        const notes = await Notes.findById(noteId);
        if (!notes) return res.status(404).json({ status: 404, message: "Note Not Found!" });

        // now, check that the notes is accessible by the user
        if (notes.user.toString() !== req.user.id) return res.status(403).json({ status: 403, message: "Access Denied!" });

        // now, delete the notes
        await Notes.findByIdAndDelete(noteId);
        return res.status(200).json({ status: 200, message: "Note Deleted Successfully!", noteId });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ status: 500, message: "Internal Server Errors", errors: err });
    }
};

// to update the notes
const updateNote = async (req, res) => {
    try {
        // fetching data from qyery params
        const noteId = req.query['note-id'];
        const { title, desc } = req.body;
        const category = req.body.category.toLowerCase();

        // now, find that the user exists
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User not found!!" });

        // now, confirm that the notes exists
        const notes = await Notes.findById(noteId);
        if (!notes) return res.status(404).json({ status: 404, message: "notes Not Found!" });

        // identify the fields to be updated
        let toBeUpdated = false;

        // update fields
        if (category) {
            notes.category = category;
            toBeUpdated = true;
        }
        if (desc) {
            notes.desc = desc;
            toBeUpdated = true;
        }
        if (title) {
            notes.title = title;
            toBeUpdated = true;
        }

        // save the note model, if we updated anything
        if (toBeUpdated) await notes.save();

        // notes updated successfully
        return res.status(200).json({ status: 200, message: "Note Updated!", notes: notes });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ status: 500, message: "Internal Server Errors", errors: err });
    }
};

// to mark the note as completed
const completeNote = async (req, res) => {
    try {
        // fetch the note id from query params
        const noteId = req.query['note-id'];

        // now, find that the user exists
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User not found!!" });

        // now, confirm that the notes exists
        const notes = await Notes.findById(noteId);
        if (!notes) return res.status(404).json({ status: 404, message: "Note Not Found!" });

        // now, check that the notes is accessible by the user
        if (notes.user.toString() !== req.user.id) return res.status(403).json({ status: 403, message: "Access Denied!" });

        // check that the note is not completed yet
        if (notes.isCompleted === true) return res.status(400).json({ status: 400, message: 'Note is already completed' });

        // now, mark the note as completed
        notes.isCompleted = true;
        notes.save();

        // notify the user
        return res.status(200).json({ status: 200, message: `Congratulate, ${user.fullName.split(' ')[0]}!!`, info: 'User completed the note' });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ status: 500, message: "Internal Server Errors", errors: err });
    }
};

// exporting notess functions
module.exports = { getNotes, createNote, deleteNote, updateNote, completeNote }; 